import type { RockEvent, Rock, RockEventHandler, RuiRockLogger, RockConfig } from "@ruiapp/move-style";
import { handleComponentEvent } from "@ruiapp/move-style";
import { renderRock } from "@ruiapp/react-renderer";
import RapidEntitySearchFormMeta from "./RapidEntitySearchFormMeta";
import type { RapidEntitySearchFormConfig, RapidEntitySearchFormRockConfig } from "./rapid-entity-search-form-types";
import { assign, each, filter, get, isUndefined, map, merge, omit, set, uniq } from "lodash";
import rapidAppDefinition from "../../rapidAppDefinition";
import type {
  RapidDataDictionary,
  RapidDataDictionaryEntry,
  RapidEntity,
  RapidField,
  RapidFieldType,
  SearchFormFilterConfiguration,
} from "../../types/rapid-entity-types";
import { generateRockConfigOfError } from "../../rock-generators/generateRockConfigOfError";
import type { RapidFormItemConfig, RapidFormItemType, RapidSearchFormItemConfig } from "../rapid-form-item/rapid-form-item-types";
import type { RapidFormAction, RapidFormRockConfig } from "../rapid-form/rapid-form-types";
import type { RapidSelectConfig } from "../rapid-select/rapid-select-types";
import { RapidOptionFieldRendererConfig } from "../rapid-option-field-renderer/rapid-option-field-renderer-types";
import { searchParamsToFilters } from "../../functions/searchParamsToFilters";
import { EntityTableSelectRockConfig } from "../rapid-entity-table-select/entity-table-select-types";
import { RapidExtStorage } from "../../mod";
import { useEffect } from "react";

type SearchableFieldType = Exclude<RapidFieldType, "file" | "file[]" | "image" | "image[]">;

const fieldTypeToFormItemTypeMap: Record<SearchableFieldType, RapidFormItemType | null> = {
  text: "text",
  boolean: "switch",
  integer: "number",
  long: "number",
  float: "number",
  double: "number",
  decimal: "number",
  date: "dateRange",
  time: "time",
  datetime: "dateTimeRange",
  option: "select",
  "option[]": "select",
  relation: "entityTableSelect",
  "relation[]": "entityTableSelect",
  json: "json",
};

const validationMessagesByFieldType: Partial<Record<RapidFieldType, any>> = {
  option: {
    // eslint-disable-next-line no-template-curly-in-string
    required: "请选择${label}",
  },

  relation: {
    // eslint-disable-next-line no-template-curly-in-string
    required: "请选择${label}",
  },
};

const defaultValidationMessages = {
  // eslint-disable-next-line no-template-curly-in-string
  required: "请输入${label}",
};

export interface GenerateEntityFormItemOption {
  formItemConfig: RapidFormItemConfig & RapidSearchFormItemConfig;
  mainEntity: RapidEntity;
  dataDictionaries: RapidDataDictionary[];
}

function generateSearchFormItemForOptionProperty(option: GenerateEntityFormItemOption, valueFieldType: RapidFieldType) {
  const { formItemConfig, mainEntity } = option;

  let entries: RapidDataDictionaryEntry[] = [];

  const rpdField = rapidAppDefinition.getEntityFieldByCode(mainEntity, formItemConfig.code);
  const dataDictionaryCode = rpdField?.dataDictionary;
  if (dataDictionaryCode) {
    let dataDictionary = rapidAppDefinition.getDataDictionaryByCode(dataDictionaryCode);
    entries = dataDictionary?.entries || [];
  }

  const { filterMode } = formItemConfig;
  const isMultiple = formItemConfig.multipleValues || filterMode === "in" || filterMode === "overlap";

  let formControlProps: Partial<RapidSelectConfig> = {
    allowClear: !formItemConfig.required,
    placeholder: formItemConfig.placeholder,
    mode: isMultiple ? "multiple" : undefined,
    multiple: isMultiple,
    listDataSource: {
      data: {
        list: entries,
      },
    },
    listTextFieldName: "name",
    listValueFieldName: "value",
    ...formItemConfig.formControlProps,
  };
  let rendererProps: RapidOptionFieldRendererConfig = {
    dictionaryCode: dataDictionaryCode,
  };
  let formItem: RapidFormItemConfig = {
    type: formItemConfig.type,
    valueFieldType: "option",
    code: formItemConfig.code,
    required: formItemConfig.required,
    label: formItemConfig.label,
    hidden: formItemConfig.hidden,
    formControlProps,
    rendererProps,
    $exps: formItemConfig.$exps,
  };
  return formItem;
}

export function generateSearchFormItemForRelationProperty(option: GenerateEntityFormItemOption, field: RapidField) {
  const { formItemConfig } = option;

  let listDataSourceCode = formItemConfig.formControlProps?.listDataSourceCode;
  if (!listDataSourceCode) {
    listDataSourceCode = `searchFormItemList-${formItemConfig.code}`;
  }

  let fieldTypeRelatedRendererProps: any = {};
  const relationEntity = rapidAppDefinition.getEntityBySingularCode(field.targetSingularCode);
  if (relationEntity?.displayPropertyCode) {
    fieldTypeRelatedRendererProps.format = `{{${relationEntity.displayPropertyCode}}}`;
  }

  const rendererProps = {
    ...fieldTypeRelatedRendererProps,
    ...formItemConfig.rendererProps,
  };

  const isMultiple =
    field.relation === "many" || formItemConfig.multipleValues || formItemConfig.filterMode === "in" || formItemConfig.filterMode === "overlap";

  let formControlProps: Partial<EntityTableSelectRockConfig> = {
    allowClear: !formItemConfig.required,
    placeholder: formItemConfig.placeholder,
    mode: isMultiple ? "multiple" : undefined,
    multiple: isMultiple,
    valueFieldName: "id",
    ...formItemConfig.formControlProps,
    listDataSourceCode,
    entityCode: relationEntity.code,
    requestParams: merge({}, formItemConfig.listDataFindOptions, formItemConfig.formControlProps?.requestParams),
  };

  let formItem: RapidFormItemConfig = {
    type: formItemConfig.type,
    valueFieldType: "relation",
    multipleValues: isMultiple,
    code: formItemConfig.code,
    required: formItemConfig.required,
    label: formItemConfig.label,
    hidden: formItemConfig.hidden,
    formControlType: formItemConfig.formControlType,
    formControlProps,
    rendererType: formItemConfig.rendererType,
    rendererProps,
    $exps: formItemConfig.$exps,
  };
  return formItem;
}

function generateSearchFormItem(logger: RuiRockLogger, entityFormProps: any, option: GenerateEntityFormItemOption) {
  const { formItemConfig, mainEntity } = option;

  const rpdField = rapidAppDefinition.getEntityFieldByCode(mainEntity, formItemConfig.code);
  if (!rpdField) {
    logger.warn(entityFormProps, `Field with code '${formItemConfig.code}' not found.`);
  }

  let valueFieldType = formItemConfig.valueFieldType || rpdField?.type || "text";

  if (valueFieldType === "option" || valueFieldType === "option[]") {
    return generateSearchFormItemForOptionProperty(option, valueFieldType);
  } else if (valueFieldType === "relation" || valueFieldType === "relation[]") {
    return generateSearchFormItemForRelationProperty(option, rpdField);
  }

  const isMultiple = formItemConfig.multipleValues || formItemConfig.filterMode === "in" || formItemConfig.filterMode === "overlap";

  const formControlProps = {
    mode: isMultiple ? "multiple" : undefined,
    multiple: isMultiple,
    ...(formItemConfig.formControlProps || {}),
  };

  let formItem: Omit<RapidFormItemConfig, "$type"> = {
    type: formItemConfig.type,
    code: formItemConfig.code,
    required: formItemConfig.required,
    label: formItemConfig.label,
    hidden: formItemConfig.hidden,
    valueFieldType,
    valueFieldName: formItemConfig.valueFieldName,
    multipleValues: formItemConfig.multipleValues,
    formControlType: formItemConfig.formControlType,
    formControlProps,
    rendererType: formItemConfig.rendererType,
    rendererProps: formItemConfig.rendererProps,
    $exps: formItemConfig.$exps,
  };

  return formItem;
}

export default {
  onInit(context, props) {
    const mainEntityCode = props.entityCode;
    const mainEntity = rapidAppDefinition.getEntityByCode(mainEntityCode);
    if (!mainEntity) {
      return;
    }

    for (const formItem of props.items) {
      const field = rapidAppDefinition.getEntityFieldByCode(mainEntity, formItem.code);
      if (field) {
        // 使用字段名称作为表单项的标签
        if (isUndefined(formItem.label)) {
          formItem.label = field?.name;
        }

        if (!formItem.hasOwnProperty("required")) {
          // 使用字段的必填设置作为表单项的必填设置
          formItem.required = field.required;
        }
      }

      let fieldType = formItem.valueFieldType || field?.type || "text";
      if (formItem.type === "auto") {
        // 根据字段的类型选择合适的表单项类型
        formItem.type = fieldTypeToFormItemTypeMap[fieldType] || "text";
      }
    }

    if (props.items) {
      props.items.forEach((formItemConfig) => {
        const rpdField = rapidAppDefinition.getEntityFieldByCode(mainEntity, formItemConfig.code);
        if (!rpdField) {
          return;
        }

        // if (rpdField.type === "relation" || rpdField.type === "relation[]") {
        //   let listDataSourceCode = formItemConfig.formControlProps?.listDataSourceCode;
        //   if (listDataSourceCode) {
        //     // use specified data store.
        //     return;
        //   }

        //   const listDataStoreName = `searchFormItemList-${formItemConfig.code}`;

        //   const rpdField = rapidAppDefinition.getEntityFieldByCode(mainEntity, formItemConfig.code);
        //   const targetEntity = rapidAppDefinition.getEntityBySingularCode(rpdField.targetSingularCode);

        //   let { listDataFindOptions = {} } = formItemConfig;

        //   const listDataStoreConfig: EntityStoreConfig = {
        //     type: "entityStore",
        //     name: listDataStoreName,
        //     entityModel: targetEntity,
        //     fixedFilters: listDataFindOptions.fixedFilters,
        //     filters: listDataFindOptions.filters,
        //     properties: listDataFindOptions.properties || [],
        //     orderBy: listDataFindOptions.orderBy || [
        //       {
        //         field: "id",
        //       },
        //     ],
        //     pagination: listDataFindOptions.pagination,
        //     keepNonPropertyFields: listDataFindOptions.keepNonPropertyFields,
        //     $exps: listDataFindOptions.$exps,
        //   };

        //   context.scope.addStore(listDataStoreConfig);
        // }
      });
    }
  },

  onReceiveMessage(message, state, props) {
    if (message.name === "submit") {
      message.page.sendComponentMessage(`${props.$id}-rapidForm`, {
        name: "submit",
      });
    } else if (message.name === "setFieldsValue") {
      message.page.sendComponentMessage(`${props.$id}-rapidForm`, {
        name: "setFieldsValue",
        payload: message.payload,
      });
    } else if (message.name === "resetFields") {
      message.page.sendComponentMessage(`${props.$id}-rapidForm`, {
        name: "resetFields",
      });
    } else if (message.name === "refreshView") {
      message.page.sendComponentMessage(`${props.$id}-rapidForm`, {
        name: "refreshView",
      });
    }
  },

  Renderer(context, props, state) {
    const { logger } = context;
    const dataDictionaries = rapidAppDefinition.getDataDictionaries();
    const formConfig = props;
    const mainEntityCode = formConfig.entityCode;
    const mainEntity = rapidAppDefinition.getEntityByCode(mainEntityCode);
    if (!mainEntity) {
      const errorRockConfig = generateRockConfigOfError(new Error(`Entitiy with code '${mainEntityCode}' not found.`));
      return renderRock({ context, rockConfig: errorRockConfig });
    }

    const formItems: RapidFormItemConfig[] = [];

    const formId = `${props.$id}-rapidForm`;

    if (formConfig && formConfig.items) {
      formConfig.items.forEach((formItemConfig) => {
        const formItem = generateSearchFormItem(logger, props, {
          formItemConfig,
          mainEntity,
          dataDictionaries,
        });

        formItem.required = false;
        formItems.push(formItem as RapidFormItemConfig);
      });
    }

    const formActions: RapidFormAction[] = [
      {
        actionType: "reset",
        actionText: "重置",
        actionProps: {
          onClick: [
            {
              $action: "script",
              script: (event: RockEvent) => {
                event.page.sendComponentMessage(formId, { name: "resetFields" });
                event.page.sendComponentMessage(formId, { name: "submit" });
              },
            },
          ],
        },
      },
      {
        actionType: "submit",
        actionText: "搜索",
      },
    ];

    const formOnFinish: RockEventHandler[] = [
      {
        $action: "script",
        script: async (event: RockEvent) => {
          const filterConfigurations: SearchFormFilterConfiguration[] = [];
          for (const formItem of props.items) {
            filterConfigurations.push({
              code: formItem.code,
              filterMode: formItem.filterMode,
              filterFields: formItem.filterFields,
              itemType: formItem.itemType,
              filterExtra: formItem.filterExtra,
            });
          }

          const searchParams = event.args[0];
          const filters = searchParamsToFilters(filterConfigurations, searchParams);

          const dataSourceCode = props.dataSourceCode || "list";
          // 设置搜索变量
          event.scope.setVars({
            [`stores-${dataSourceCode}-pageNum`]: 1,
          });

          await handleComponentEvent("onSearch", event.framework, event.page as any, event.scope, props, props.onSearch, [{ filters, formData: searchParams }]);
        },
      },
    ];

    const rockConfig: RapidFormRockConfig = {
      $id: formId,
      $type: "rapidForm",
      size: formConfig.size,
      layout: formConfig.layout,
      column: formConfig.column || 4,
      colon: formConfig.colon,
      actions: formConfig.actions || formActions,
      actionsAlign: formConfig.actionsAlign,
      defaultFormFields: formConfig.defaultFormFields,
      formDataAdapter: formConfig.formDataAdapter,
      onFormSubmit: formConfig.onFormSubmit,
      onFormRefresh: formConfig.onFormRefresh,
      onValuesChange: formConfig.onValuesChange,
      items: formItems,
      onFinish: formOnFinish,
    };
    return renderRock({ context, rockConfig });
  },

  ...RapidEntitySearchFormMeta,
} as Rock<RapidEntitySearchFormRockConfig>;

interface IFilterCacheData {
  filters?: any[];
  formData?: any;
  pageNum?: number;
}

const FILTER_CACHE_KEY = "rapid_entity_list_filter_cache";

export function getRapidEntityListFilters(formItems: RapidEntitySearchFormConfig["items"], formData: Record<string, any>) {
  const filterConfigurations: SearchFormFilterConfiguration[] = [];
  for (const formItem of formItems) {
    filterConfigurations.push({
      code: formItem.code,
      filterMode: formItem.filterMode,
      filterFields: formItem.filterFields,
      itemType: formItem.itemType,
      filterExtra: formItem.filterExtra,
    });
  }

  const filters = searchParamsToFilters(filterConfigurations, formData);

  return filters;
}

export class RapidEntityListFilterCache {
  static set(listName: string, data: IFilterCacheData) {
    const existedData = RapidExtStorage.get(FILTER_CACHE_KEY) || {};

    set(existedData, listName, { ...get(existedData, listName), ...data });

    RapidExtStorage.set(FILTER_CACHE_KEY, existedData);
  }

  static get(listName: string) {
    const cacheData = RapidExtStorage.get(FILTER_CACHE_KEY);
    return get(cacheData, listName);
  }

  static remove(listName: string) {
    const existedData = RapidExtStorage.get(FILTER_CACHE_KEY) || {};
    RapidExtStorage.set(FILTER_CACHE_KEY, omit(existedData, [listName]));
  }
}
