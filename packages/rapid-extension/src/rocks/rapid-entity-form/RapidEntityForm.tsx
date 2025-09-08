import type { RockEvent, Rock, RockEventHandler, RuiRockLogger, IScope, RuiEvent } from "@ruiapp/move-style";
import { Framework, handleComponentEvent, MoveStyleUtils } from "@ruiapp/move-style";
import { renderRock } from "@ruiapp/react-renderer";
import RapidEntityFormMeta from "./RapidEntityFormMeta";
import type { RapidEntityFormRockConfig } from "./rapid-entity-form-types";
import { filter, get, isUndefined, map, merge, uniq } from "lodash";
import rapidAppDefinition from "../../rapidAppDefinition";
import type { RapidDataDictionary, RapidDataDictionaryEntry, RapidEntity, RapidField, RapidFieldType } from "../../types/rapid-entity-types";
import { generateRockConfigOfError } from "../../rock-generators/generateRockConfigOfError";
import type { EntityStoreConfig } from "../../stores/entity-store";
import type { RapidFormItemConfig, RapidFormItemType } from "../rapid-form-item/rapid-form-item-types";
import type { RapidFormRockConfig } from "../rapid-form/rapid-form-types";
import type { RapidSelectConfig } from "../rapid-select/rapid-select-types";
import { RapidOptionFieldRendererConfig } from "../rapid-option-field-renderer/rapid-option-field-renderer-types";
import { message } from "antd";
import { RapidEntityTableSelectRockConfig } from "../rapid-entity-table-select/rapid-entity-table-select-types";
import { generateEntityDetailStoreConfig } from "../../helpers/entityStoreHelper";
import { getMetaDictionaryEntryLocaleName, getMetaPropertyLocaleName } from "../../helpers/i18nHelper";
import { RockEventHandlerSaveRapidEntity } from "../../event-actions/save-rapid-entity";

const fieldTypeToFormItemTypeMap: Record<RapidFieldType, RapidFormItemType | null> = {
  text: "text",
  boolean: "switch",
  integer: "number",
  long: "number",
  float: "number",
  double: "number",
  decimal: "number",
  date: "date",
  time: "time",
  datetime: "datetime",
  option: "select",
  "option[]": "select",
  relation: "entityTableSelect",
  "relation[]": "entityTableSelect",
  json: "json",
  file: "file",
  "file[]": "fileList",
  image: "image",
  "image[]": "imageList",
  richText: "richText",
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
  formItemConfig: RapidFormItemConfig;
  rpdField?: RapidField;
}

function decideFormItemType(formItemConfig: RapidFormItemConfig, rpdField?: RapidField) {
  let formItemType = formItemConfig.type;
  if (!formItemType || formItemType === "auto") {
    // 根据字段的类型选择合适的表单项类型
    let fieldType = formItemConfig.valueFieldType || rpdField?.type || "text";
    formItemType = fieldTypeToFormItemTypeMap[fieldType] || "text";
  }

  return formItemType;
}

function generateDataFormItemForOptionProperty(
  framework: Framework,
  option: GenerateEntityFormItemOption,
  valueFieldType: "option" | "option[]",
  formItemRequired: boolean,
) {
  const { formItemConfig, rpdField } = option;

  let dictionaryEntries: RapidDataDictionaryEntry[] = [];

  const dataDictionaryCode = rpdField?.dataDictionary;
  if (dataDictionaryCode) {
    let dataDictionary = rapidAppDefinition.getDataDictionaryByCode(dataDictionaryCode);

    dictionaryEntries = dataDictionary.entries.map((entry) => {
      return {
        ...entry,
        name: getMetaDictionaryEntryLocaleName(framework, dataDictionary, entry),
      };
    });
  }

  let formControlProps: Partial<RapidSelectConfig> = {
    allowClear: !formItemConfig.required,
    placeholder: formItemConfig.placeholder,
    listDataSource: {
      data: {
        list: dictionaryEntries,
      },
    },
    listTextFieldName: "name",
    listValueFieldName: "value",
    ...formItemConfig.formControlProps,
  };

  let rendererProps: RapidOptionFieldRendererConfig = {
    dictionaryCode: dataDictionaryCode,
  };

  let formItemType = decideFormItemType(formItemConfig, rpdField);

  let formItem: RapidFormItemConfig = {
    type: formItemType,
    valueFieldType: valueFieldType,
    multipleValues: valueFieldType === "option[]",
    uniqueKey: formItemConfig.uniqueKey,
    code: formItemConfig.code,
    required: formItemRequired,
    label: formItemConfig.label,
    hidden: formItemConfig.hidden,
    wrapperCol: formItemConfig.wrapperCol,
    labelCol: formItemConfig.labelCol,
    rules: formItemConfig.rules,
    formControlProps,
    rendererProps,
    storeDependencies: formItemConfig.storeDependencies,
    $exps: formItemConfig.$exps,
    $i18n: formItemConfig.$i18n,
    $locales: formItemConfig.$locales,
  };
  return formItem;
}

export function generateDataFormItemForRelationProperty(option: GenerateEntityFormItemOption, formItemRequired: boolean) {
  const { formItemConfig, rpdField } = option;

  let listDataSourceCode = formItemConfig.formControlProps?.listDataSourceCode;
  if (!listDataSourceCode) {
    listDataSourceCode = `dataFormItemList-${formItemConfig.code}`;
  }

  let fieldTypeRelatedRendererProps: any = {};
  const relationEntity = rapidAppDefinition.getEntityBySingularCode(rpdField?.targetSingularCode);
  if (relationEntity?.displayPropertyCode) {
    fieldTypeRelatedRendererProps.format = `{{${relationEntity.displayPropertyCode}}}`;
  }

  const rendererProps = {
    ...fieldTypeRelatedRendererProps,
    ...formItemConfig.rendererProps,
  };

  let formControlProps: Partial<RapidEntityTableSelectRockConfig> = {
    allowClear: !formItemConfig.required,
    placeholder: formItemConfig.placeholder,
    valueFieldName: "id",
    ...formItemConfig.formControlProps,
    listDataSourceCode,
    entityCode: relationEntity.code,
    mode: rpdField?.relation === "many" ? "multiple" : "single",
    multiple: rpdField?.relation === "many",
    requestParams: merge({}, formItemConfig.listDataFindOptions, formItemConfig.formControlProps?.requestParams),
  };

  let formItemType = decideFormItemType(formItemConfig, rpdField);

  let formItem: RapidFormItemConfig = {
    type: formItemType,
    valueFieldType: "relation",
    multipleValues: rpdField?.relation === "many",
    uniqueKey: formItemConfig.uniqueKey,
    code: formItemConfig.code,
    required: formItemRequired,
    label: formItemConfig.label,
    hidden: formItemConfig.hidden,
    wrapperCol: formItemConfig.wrapperCol,
    labelCol: formItemConfig.labelCol,
    rules: formItemConfig.rules,
    formControlType: formItemConfig.formControlType,
    formControlProps,
    rendererType: formItemConfig.rendererType,
    rendererProps,
    storeDependencies: formItemConfig.storeDependencies,
    $exps: formItemConfig.$exps,
    $i18n: formItemConfig.$i18n,
    $locales: formItemConfig.$locales,
  };
  return formItem;
}

function generateDataFormItem(framework: Framework, logger: RuiRockLogger, entityFormProps: any, option: GenerateEntityFormItemOption) {
  const { formItemConfig, rpdField } = option;

  let valueFieldType = formItemConfig.valueFieldType || rpdField?.type || "text";
  if (formItemConfig.type === "richText") {
    valueFieldType = "richText";
  }

  let formItemRequired = rpdField?.required;
  if (formItemConfig.hasOwnProperty("required")) {
    formItemRequired = formItemConfig.required;
  }

  if (valueFieldType === "option" || valueFieldType === "option[]") {
    return generateDataFormItemForOptionProperty(framework, option, valueFieldType, formItemRequired);
  } else if (valueFieldType === "relation" || valueFieldType === "relation[]") {
    return generateDataFormItemForRelationProperty(option, formItemRequired);
  }

  let formItemType = decideFormItemType(formItemConfig, rpdField);

  let formItem: Omit<RapidFormItemConfig, "$type"> = {
    type: formItemType,
    code: formItemConfig.code,
    uniqueKey: formItemConfig.uniqueKey,
    required: formItemRequired,
    hidden: formItemConfig.hidden,
    wrapperCol: formItemConfig.wrapperCol,
    labelCol: formItemConfig.labelCol,
    rules: formItemConfig.rules,
    valueFieldType,
    valueFieldName: formItemConfig.valueFieldName,
    multipleValues: formItemConfig.multipleValues,
    formControlType: formItemConfig.formControlType,
    formControlProps: formItemConfig.formControlProps,
    rendererType: formItemConfig.rendererType,
    rendererProps: formItemConfig.rendererProps,
    storeDependencies: formItemConfig.storeDependencies,
    $exps: formItemConfig.$exps,
    $i18n: formItemConfig.$i18n,
    $locales: formItemConfig.$locales,
  };

  return formItem;
}

function initDataStore(props: RapidEntityFormRockConfig, scope: IScope) {
  const mainEntityCode = props.entityCode;
  const mainEntity = rapidAppDefinition.getEntityByCode(mainEntityCode);
  if (!mainEntity) {
    return;
  }

  if (props.mode != "new" && !props.disabledLoadStore) {
    const detailDataStoreConfig = generateEntityDetailStoreConfig({
      entityModel: mainEntity,
      entityId: props.entityId,
      entityIdExpression: props.$exps?.entityId,
      dataSourceCode: props.dataSourceCode,
      items: props.items,
      extraProperties: props.extraProperties,
      keepNonPropertyFields: props.keepNonPropertyFields,
      queryProperties: props.queryProperties,
      relations: props.relations,
    });
    scope.addStore(detailDataStoreConfig);
  }
}

export default {
  onInit(context, props) {
    if (!props.lazyLoadData) {
      initDataStore(props, context.scope);
    }

    // if (props.items) {
    //   props.items.forEach((formItemConfig) => {
    //     const rpdField = rapidAppDefinition.getEntityFieldByCode(mainEntity, formItemConfig.code);
    //     if (!rpdField) {
    //       return;
    //     }
    //     if (rpdField.type === "relation" || rpdField.type === "relation[]") {
    //       let listDataSourceCode = formItemConfig.formControlProps?.listDataSourceCode;
    //       if (listDataSourceCode) {
    //         // use specified data store.
    //         return;
    //       }
    //     const listDataStoreName = `dataFormItemList-${formItemConfig.code}`;
    //     const rpdField = rapidAppDefinition.getEntityFieldByCode(mainEntity, formItemConfig.code);
    //     const targetEntity = rapidAppDefinition.getEntityBySingularCode(rpdField.targetSingularCode);
    //     let { listDataFindOptions = {} } = formItemConfig;
    //     const listDataStoreConfig: EntityStoreConfig = {
    //       type: "entityStore",
    //       name: listDataStoreName,
    //       entityModel: targetEntity,
    //       fixedFilters: listDataFindOptions.fixedFilters,
    //       filters: listDataFindOptions.filters,
    //       properties: listDataFindOptions.properties || [],
    //       orderBy: listDataFindOptions.orderBy || [
    //         {
    //           field: "id",
    //         },
    //       ],
    //       pagination: listDataFindOptions.pagination,
    //       keepNonPropertyFields: listDataFindOptions.keepNonPropertyFields,
    //       $exps: listDataFindOptions.$exps,
    //     };
    //     context.scope.addStore(listDataStoreConfig);
    //     }
    //   });
    // }
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
    const { logger, framework } = context;
    const formConfig = props;
    const mainEntityCode = formConfig.entityCode;
    const mainEntity = rapidAppDefinition.getEntityByCode(mainEntityCode);
    if (!mainEntity) {
      const errorRockConfig = generateRockConfigOfError(new Error(`Entitiy with code '${mainEntityCode}' not found.`));
      return renderRock({ context, rockConfig: errorRockConfig });
    }

    if (props.lazyLoadData) {
      initDataStore(props, context.scope);
    }

    const formItems: RapidFormItemConfig[] = [];

    if (formConfig && formConfig.items) {
      formConfig.items.forEach((formItemConfig) => {
        const rpdField = rapidAppDefinition.getEntityFieldByCode(mainEntity, formItemConfig.code);
        if (!rpdField) {
          logger.warn(props, `Field with code '${formItemConfig.code}' not found.`);
        }
        const formItem = generateDataFormItem(framework, logger, props, {
          rpdField,
          formItemConfig,
        });

        let formItemLabel = formItemConfig.label;
        // 使用字段名称作为表单项的标签
        if (isUndefined(formItemLabel)) {
          formItemLabel = getMetaPropertyLocaleName(framework, mainEntity, rpdField);
        }
        formItem.label = formItemLabel;
        // MoveStyleUtils.localizeConfigProps(framework, logger, formItemConfig);

        if (formConfig.mode === "view") {
          formItem.required = false;
          formItem.mode = "display";
        } else {
          // auto config formItem.rules
          const validationMessagesOfFieldType = validationMessagesByFieldType[formItem.valueFieldType!];
          if (formItem.required) {
            if (!formItem.rules || !formItem.rules.length) {
              formItem.rules = [
                {
                  required: true,
                  message: validationMessagesOfFieldType?.required || defaultValidationMessages.required,
                },
              ];
            }
          }
        }
        formItems.push(formItem as RapidFormItemConfig);
      });
    }

    let customRequest: RockEventHandlerSaveRapidEntity["customRequest"] = null;
    if (formConfig.customRequest) {
      customRequest = formConfig.customRequest;
    }

    if (formConfig.submitUrl) {
      customRequest = {
        url: formConfig.submitUrl,
        method: formConfig.submitMethod || "post",
      };
    }

    const formOnFinish: RockEventHandler[] = [
      {
        $action: "saveRapidEntity",
        entityNamespace: mainEntity.namespace,
        entityPluralCode: mainEntity.pluralCode,
        customRequest,
        entityId: props.entityId,
        onSuccess: [
          {
            $action: "script",
            script: async (event: RockEvent) => {
              message.success("保存成功。");
              if (formConfig.onSaveSuccess) {
                await handleComponentEvent("onSaveSuccess", event.framework, event.page as any, event.scope, event.sender, formConfig.onSaveSuccess, [
                  event.args[0],
                ]);
              }
            },
          },
        ],
        onError: [
          {
            $action: "script",
            script: async (event: RockEvent) => {
              message.error(`保存失败：${event.args[0].message}`);
              if (formConfig.onSaveError) {
                await handleComponentEvent("onSaveError", event.framework, event.page as any, event.scope, event.sender, formConfig.onSaveError, [
                  event.args[0],
                ]);
              }
            },
          },
        ],
      },
    ];

    const rockConfig: RapidFormRockConfig = {
      $id: `${props.$id}-rapidForm`,
      $type: "rapidForm",
      size: formConfig.size,
      layout: formConfig.layout,
      column: formConfig.column,
      colon: formConfig.colon,
      actions: formConfig.actions,
      actionsLayout: formConfig.actionsLayout,
      defaultFormFields: formConfig.defaultFormFields,
      formDataAdapter: formConfig.formDataAdapter,
      onFormSubmit: formConfig.onFormSubmit,
      onFormRefresh: formConfig.onFormRefresh,
      onValuesChange: formConfig.onValuesChange,
      items: formItems,
      disabledLoadStore: formConfig.disabledLoadStore,
      dataSourceCode: formConfig.mode === "new" ? null : !props.disabledLoadStore ? props.dataSourceCode || "detail" : null,
      fixedFields: formConfig.fixedFields,
      onFinish: formConfig.mode === "view" ? null : formOnFinish,
    };
    return renderRock({ context, rockConfig });
  },

  ...RapidEntityFormMeta,
} as Rock<RapidEntityFormRockConfig>;
