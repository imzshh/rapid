import type { Rock, RuiRockLogger, RockConfig, RockInstance } from "@ruiapp/move-style";
import { genRockRenderer, renderRock } from "@ruiapp/react-renderer";
import RapidEntityDescriptionsMeta from "./RapidEntityDescriptionsMeta";
import type { RapidDescriptionsItemConfig, RapidEntityDescriptionsProps, RapidEntityDescriptionsRockConfig } from "./rapid-entity-descriptions-types";
import { get, isUndefined, omit } from "lodash";
import rapidAppDefinition from "../../rapidAppDefinition";
import type { RapidDataDictionary, RapidDataDictionaryEntry, RapidEntity, RapidField, RapidFieldType } from "@ruiapp/rapid-common";
import { generateRockConfigOfError } from "../../rock-generators/generateRockConfigOfError";
import { RapidOptionFieldRendererConfig } from "../rapid-option-field-renderer/rapid-option-field-renderer-types";
import RapidExtensionSetting from "../../RapidExtensionSetting";
import { generateEntityDetailStoreConfig } from "../../helpers/entityStoreHelper";
import { Descriptions } from "antd";

export interface GenerateEntityDescriptionItemOption {
  descriptionItemConfig: RapidDescriptionsItemConfig;
  mainEntity: RapidEntity;
  dataDictionaries: RapidDataDictionary[];
}

function generateDescriptionItemForOptionProperty(option: GenerateEntityDescriptionItemOption, valueFieldType: "option" | "option[]", value: any) {
  const { descriptionItemConfig, mainEntity } = option;

  const rpdField = rapidAppDefinition.getEntityFieldByCode(mainEntity, descriptionItemConfig.code);
  const dataDictionaryCode = rpdField?.dataDictionary;

  let rendererProps: RapidOptionFieldRendererConfig = {
    dictionaryCode: dataDictionaryCode,
  };
  let descriptionItem: RapidDescriptionsItemConfig = {
    valueFieldType: valueFieldType,
    multipleValues: valueFieldType === "option[]",
    rendererProps,
    ...descriptionItemConfig,
    value,
  };
  return descriptionItem;
}

export function generateDataDescriptionItemForRelationProperty(option: GenerateEntityDescriptionItemOption, field: RapidField, value: any) {
  const { descriptionItemConfig } = option;

  let fieldTypeRelatedRendererProps: any = {};
  const relationEntity = rapidAppDefinition.getEntityBySingularCode(field.targetSingularCode);
  if (relationEntity?.displayPropertyCode) {
    fieldTypeRelatedRendererProps.format = `{{${relationEntity.displayPropertyCode}}}`;
  }

  const rendererProps = {
    ...fieldTypeRelatedRendererProps,
    ...descriptionItemConfig.rendererProps,
  };

  let descriptionItem: RapidDescriptionsItemConfig = {
    ...descriptionItemConfig,
    multipleValues: field.relation === "many",
    valueFieldType: "relation",
    rendererProps,
    value,
  };
  return descriptionItem;
}

function generateDataDescriptionItem(logger: RuiRockLogger, entityDescriptionsProps: any, option: GenerateEntityDescriptionItemOption, value: any) {
  const { descriptionItemConfig, mainEntity } = option;

  const rpdField = rapidAppDefinition.getEntityFieldByCode(mainEntity, descriptionItemConfig.code);
  if (!rpdField) {
    logger.warn(entityDescriptionsProps, `Field with code '${descriptionItemConfig.code}' not found.`);
  }

  let valueFieldType = descriptionItemConfig.valueFieldType || rpdField?.type || "text";
  if (descriptionItemConfig.type === "richText") {
    valueFieldType = "richText";
  }

  if (valueFieldType === "option" || valueFieldType === "option[]") {
    return generateDescriptionItemForOptionProperty(option, valueFieldType, value);
  } else if (valueFieldType === "relation" || valueFieldType === "relation[]") {
    return generateDataDescriptionItemForRelationProperty(option, rpdField, value);
  }

  const defaultRendererProps = RapidExtensionSetting.getDefaultRendererProps(valueFieldType, descriptionItemConfig.rendererType);
  const rendererProps = {
    ...defaultRendererProps,
    ...descriptionItemConfig.rendererProps,
  };

  let descriptionItem: Omit<RapidDescriptionsItemConfig, "$type"> = {
    ...descriptionItemConfig,
    valueFieldType,
    rendererProps,
    value,
  };

  return descriptionItem;
}

export function configRapidEntityDescriptions(config: RapidEntityDescriptionsRockConfig): RapidEntityDescriptionsRockConfig {
  return config;
}

export function RapidEntityDescriptions(props: RapidEntityDescriptionsProps) {
  const { $id, _context: context } = props as any as RockInstance;
  const { logger, page, scope } = context;
  const dataDictionaries = rapidAppDefinition.getDataDictionaries();
  const descriptionsConfig = props;
  const mainEntityCode = descriptionsConfig.entityCode;
  const mainEntity = rapidAppDefinition.getEntityByCode(mainEntityCode);

  if (!mainEntity) {
    const errorRockConfig = generateRockConfigOfError(new Error(`Entitiy with code '${mainEntityCode}' not found.`));
    return renderRock({ context, rockConfig: errorRockConfig });
  }

  const items = (props.items || []).map((item) => ({ ...item }));

  for (const descriptionItem of items) {
    const field = rapidAppDefinition.getEntityFieldByCode(mainEntity, descriptionItem.code);
    if (field) {
      // 使用字段名称作为表单项的标签
      if (isUndefined(descriptionItem.label)) {
        descriptionItem.label = field?.name;
      }

      if (!descriptionItem.valueFieldType) {
        descriptionItem.valueFieldType = field.type;
      }
    }

    // 推断渲染器类型
    if (!descriptionItem.rendererType) {
      if (descriptionItem.valueFieldType) {
        descriptionItem.rendererType = RapidExtensionSetting.getDefaultRendererTypeOfFieldType(descriptionItem.valueFieldType);
      } else {
        descriptionItem.rendererType = RapidExtensionSetting.getDefaultRendererTypeOfDisplayType(descriptionItem.type);
      }
    }
  }

  const descriptionItemRocks: RockConfig[] = [];
  let dataSource = props.dataSource;
  if (!dataSource) {
    const dataSourceCode = props.dataSourceCode || "detail";
    dataSource = get(scope.stores[dataSourceCode], "data.list[0]");
  }

  if (!dataSource) {
    return null;
  }

  const form = {
    getFieldValue(name: string) {
      return get(dataSource, name);
    },
  };

  items.forEach((descriptionItemConfig) => {
    const propValue = get(dataSource, descriptionItemConfig.valueFieldName || descriptionItemConfig.code);

    const descriptionItem = generateDataDescriptionItem(
      logger,
      props,
      {
        descriptionItemConfig,
        mainEntity,
        dataDictionaries,
      },
      propValue,
    );

    // 兼容 rapidEntityForm
    (descriptionItem as any).form = form;
    page.interpreteComponentProperties(props as any as RockConfig, descriptionItem as any, {});

    const itemRockId = `${$id}-items-${descriptionItemConfig.uniqueKey || descriptionItemConfig.code}`;
    const descriptionItemRockConfig: RockConfig = {
      $id: itemRockId,
      $type: "antdDescriptionsItem",
      _hidden: (descriptionItem as any)._hidden,
      $i18n: descriptionItemConfig.$i18n,
      $locales: descriptionItemConfig.$locales,
      label: descriptionItem.label,
      labelStyle: descriptionItem.labelStyle,
      contentStyle: descriptionItem.contentStyle,
      span: descriptionItem.column,
      children: {
        $id: `${itemRockId}-display`,
        $type: descriptionItem.rendererType,
        value: descriptionItem.value,
        ...descriptionItem.rendererProps,
      },
    };

    if (!descriptionItemRockConfig._hidden && !descriptionItemConfig.hidden) {
      descriptionItemRocks.push(descriptionItemRockConfig);
    }
  });

  const rockConfig: RockConfig = {
    $id: `${$id}-internal`,
    $type: "antdDescriptions",
    bordered: descriptionsConfig.bordered,
    size: descriptionsConfig.size,
    layout: descriptionsConfig.layout,
    colon: descriptionsConfig.colon,
    column: descriptionsConfig.column,
    labelStyle: descriptionsConfig.labelStyle,
    children: descriptionItemRocks,
  };
  return renderRock({ context, rockConfig });
}

export default {
  onInit(context, props) {
    const mainEntityCode = props.entityCode;
    const mainEntity = rapidAppDefinition.getEntityByCode(mainEntityCode);
    if (!mainEntity) {
      return;
    }

    if (props.entityId || props.$exps?.entityId) {
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
      context.scope.addStore(detailDataStoreConfig);
    }
  },

  Renderer: genRockRenderer(RapidEntityDescriptionsMeta.$type, RapidEntityDescriptions, true),

  ...RapidEntityDescriptionsMeta,
} as Rock<RapidEntityDescriptionsRockConfig>;
