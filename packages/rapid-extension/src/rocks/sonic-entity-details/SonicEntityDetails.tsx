import type { Rock, RockConfig } from "@ruiapp/move-style";
import { renderRock } from "@ruiapp/react-renderer";
import SonicEntityDetailsMeta from "./SonicEntityDetailsMeta";
import type { SonicEntityDetailsRockConfig } from "./sonic-entity-details-types";
import { get } from "lodash";
import rapidAppDefinition from "../../rapidAppDefinition";
import { generateEntityDetailStoreConfig } from "../../helpers/entityStoreHelper";
import { getEntityPropertyByCode } from "../../helpers/metaHelper";

export default {
  onInit(context, props) {
    const mainEntityCode = props.entityCode;
    const mainEntity = rapidAppDefinition.getEntityByCode(mainEntityCode);
    if (!mainEntity) {
      return;
    }

    if (props.entityId || props.$exps?.entityId) {
      let titlePropertyCode = props.titlePropertyCode;
      if (!titlePropertyCode) {
        const displayPropertyCode = mainEntity.displayPropertyCode || "name";
        const displayProperty = getEntityPropertyByCode(rapidAppDefinition.getAppDefinition(), mainEntity, displayPropertyCode);
        if (displayProperty) {
          titlePropertyCode = displayPropertyCode;
        }
      }

      const detailDataStoreConfig = generateEntityDetailStoreConfig({
        entityModel: mainEntity,
        entityId: props.entityId,
        entityIdExpression: props.$exps?.entityId,
        dataSourceCode: props.dataSourceCode,
        items: [...(props.descriptionItems || props.items), ...(props.formItems || props.form?.items || [])],
        extraProperties: [titlePropertyCode, props.subTitlePropertyCode, props.statePropertyCode, ...(props.extraProperties || [])],
        keepNonPropertyFields: props.keepNonPropertyFields,
        queryProperties: props.queryProperties,
        relations: props.relations,
      });
      context.scope.addStore(detailDataStoreConfig);
    }
  },

  Renderer(context, props, state) {
    const { scope, framework } = context;
    const logger = framework.getRockLogger(SonicEntityDetailsMeta.$type, props.$id);

    const mainEntityCode = props.entityCode;
    const mainEntity = rapidAppDefinition.getEntityByCode(mainEntityCode);
    if (!mainEntity) {
      return;
    }

    let dataSource = props.dataSource;
    if (!dataSource) {
      const dataSourceCode = props.dataSourceCode || "detail";
      dataSource = get(scope.stores[dataSourceCode], "data.list[0]");
    }

    if (!dataSource) {
      return null;
    }

    let titlePropertyCode = props.titlePropertyCode;
    if (!titlePropertyCode) {
      const displayPropertyCode = mainEntity.displayPropertyCode || "name";
      const displayProperty = getEntityPropertyByCode(rapidAppDefinition.getAppDefinition(), mainEntity, displayPropertyCode);
      if (displayProperty) {
        titlePropertyCode = displayPropertyCode;
      }
    }

    let title = "";
    if (titlePropertyCode) {
      title = get(dataSource, titlePropertyCode);
    }

    let subTitle = "";
    let subTitlePropertyCode = props.subTitlePropertyCode;
    if (subTitlePropertyCode) {
      const subTitleProperty = getEntityPropertyByCode(rapidAppDefinition.getAppDefinition(), mainEntity, subTitlePropertyCode);
      if (subTitleProperty) {
        subTitle = get(dataSource, subTitlePropertyCode);
      }
    }

    let statePropertyCode = props.statePropertyCode;
    let stateRockConfig: RockConfig;
    if (statePropertyCode) {
      const stateProperty = getEntityPropertyByCode(rapidAppDefinition.getAppDefinition(), mainEntity, statePropertyCode);
      if (stateProperty) {
        const stateValue = get(dataSource, statePropertyCode);
        stateRockConfig = {
          $id: `${props.$id}-state`,
          $type: "rapidOptionFieldRenderer",
          dictionaryCode: stateProperty.dataDictionary,
          value: stateValue,
        };
      }
    }

    let itemsRockConfig: RockConfig;
    if (props.mode === "edit") {
      itemsRockConfig = {
        entityCode: props.entityCode,
        dataSource,
        column: props.formColumn,
        items: props.formItems,
        ...props.form,
        $type: "rapidEntityForm",
        $id: `${props.$id}-form`,
      };
    } else {
      itemsRockConfig = {
        $id: `${props.$id}-descriptions`,
        $type: "rapidEntityDescriptions",
        entityCode: props.entityCode,
        dataSource,
        bordered: props.descriptionBordered,
        size: props.descriptionSize,
        layout: props.descriptionLayout,
        colon: props.descriptionColon,
        column: props.descriptionColumn || props.column,
        items: props.descriptionItems || props.items,
      };
    }

    let rockConfig: RockConfig;
    if (props.hideHeader) {
      rockConfig = {
        $id: `${props.$id}-internal-withoutHeader`,
        $type: "box",
        children: [itemsRockConfig, props.footer],
      };
    } else {
      setDefaultEntityPropsToActionRocks(props.actions, props.entityCode, props.entityId);

      rockConfig = {
        $id: `${props.$id}-internal-withHeader`,
        $type: "antdPageHeader",
        title,
        subTitle,
        tags: stateRockConfig,
        extra: props.actions,
        footer: props.footer,
        children: itemsRockConfig,
      };

      let onBack: any;
      if (props.showBackButton) {
        if (history.length) {
          onBack = () => {
            history.back();
          };
        } else if (props.backUrl) {
          onBack = () => {
            location.href = props.backUrl!;
          };
        }
      }

      if (onBack) {
        rockConfig.onBack = onBack;
      }
    }
    return renderRock({ context, rockConfig });
  },

  ...SonicEntityDetailsMeta,
} as Rock<SonicEntityDetailsRockConfig>;

function setDefaultEntityPropsToActionRocks(actionRocks: RockConfig[], entityCode?: string, entityId?: string) {
  if (!actionRocks) {
    return;
  }

  for (const actionRock of actionRocks) {
    if (!actionRock.entityCode) {
      actionRock.entityCode = entityCode;
    }
    if (!actionRock.entityId) {
      actionRock.entityId = entityId;
    }
  }
}
