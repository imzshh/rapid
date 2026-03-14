import { fireEvent, Rock, RockInstance, wait } from "@ruiapp/move-style";
import RapidToolbarUpdateEntityButtonMeta from "./RapidToolbarUpdateEntityButtonMeta";
import { genRockRenderer } from "@ruiapp/react-renderer";
import { RapidToolbarUpdateEntityButtonProps, RapidToolbarUpdateEntityButtonRockConfig } from "./rapid-toolbar-update-entity-button-types";
import { find } from "lodash";
import rapidAppDefinition from "../../rapidAppDefinition";
import { message } from "antd";
import { getExtensionLocaleStringResource } from "../../helpers/i18nHelper";
import { getRapidApi } from "../../rapidApi";
import { RapidToolbarButtonComponent } from "../rapid-toolbar-button/RapidToolbarButton";

export function configRapidToolbarUpdateEntityButton(config: RapidToolbarUpdateEntityButtonRockConfig): RapidToolbarUpdateEntityButtonRockConfig {
  return config;
}

export function RapidToolbarUpdateEntityButton(props: RapidToolbarUpdateEntityButtonProps) {
  const { _context: context } = props as any as RockInstance;
  const { framework } = context;

  const handleAction = async () => {
    const entities = rapidAppDefinition.getEntities();
    const entityCode = props.entityCode;
    if (!entityCode) {
      message.error(`"entityCode" was not configured.`);
      return;
    }

    const mainEntity = find(entities, (item) => item.code === entityCode);
    if (!mainEntity) {
      message.error(`Entity with code "${entityCode}" was not found.`);
      return;
    }

    const rapidApi = getRapidApi();
    try {
      await rapidApi.patch(`${mainEntity.namespace}/${mainEntity.pluralCode}/${props.entityId}`, props.entity);

      const successMessage = props.successMessage ? props.successMessage : getExtensionLocaleStringResource(framework, "updateSuccess");
      message.success(successMessage);
      await wait(1000);

      if (props.onSuccess) {
        props.onSuccess();
      }
    } catch (err: any) {
      const errorMessage = props.errorMessage
        ? `${props.errorMessage} ${err.message}`
        : getExtensionLocaleStringResource(framework, "updateError", { message: err.message });
      message.error(errorMessage);
      await wait(1000);

      if (props.onError) {
        props.onError();
      }
    }
  };

  return <RapidToolbarButtonComponent {...props} onAction={handleAction} />;
}

export default {
  Renderer: genRockRenderer(RapidToolbarUpdateEntityButtonMeta.$type, RapidToolbarUpdateEntityButton, true),
  ...RapidToolbarUpdateEntityButtonMeta,
} as Rock<RapidToolbarUpdateEntityButtonRockConfig>;
