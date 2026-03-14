import type { Rock, RockComponentProps, RockInstance, RockInstanceProps } from "@ruiapp/move-style";
import { omitSystemRockConfigFields, wait } from "@ruiapp/move-style";
import RapidToolbarUpdateEntityButtonMeta from "./RapidToolbarUpdateEntityButtonMeta";
import { useRockInstanceContext, wrapToRockComponent } from "@ruiapp/react-renderer";
import type { RapidToolbarUpdateEntityButtonProps, RapidToolbarUpdateEntityButtonRockConfig } from "./rapid-toolbar-update-entity-button-types";
import { find, omit } from "lodash";
import rapidAppDefinition from "../../rapidAppDefinition";
import { message } from "antd";
import { getExtensionLocaleStringResource } from "../../helpers/i18nHelper";
import { getRapidApi } from "../../rapidApi";
import { RapidToolbarButtonComponent } from "../rapid-toolbar-button/RapidToolbarButton";

export function configRapidToolbarUpdateEntityButton(
  config: RockComponentProps<RapidToolbarUpdateEntityButtonRockConfig>,
): RapidToolbarUpdateEntityButtonRockConfig {
  config.$type = RapidToolbarUpdateEntityButtonMeta.$type;
  return config as RapidToolbarUpdateEntityButtonRockConfig;
}

export function RapidToolbarUpdateEntityButtonComponent(props: RockInstanceProps<RapidToolbarUpdateEntityButtonProps>) {
  const context = useRockInstanceContext();
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

  const btnProps = omit(omitSystemRockConfigFields(props as RockInstance), [
    "entityCode",
    "entityId",
    "entity",
    "successMessage",
    "errorMessage",
    "onSuccess",
    "onError",
  ]);

  return <RapidToolbarButtonComponent {...btnProps} onAction={handleAction} />;
}

export const RapidToolbarUpdateEntityButton = wrapToRockComponent(RapidToolbarUpdateEntityButtonMeta, RapidToolbarUpdateEntityButtonComponent);

export default {
  Renderer: RapidToolbarUpdateEntityButtonComponent,
  ...RapidToolbarUpdateEntityButtonMeta,
} as Rock<RapidToolbarUpdateEntityButtonRockConfig>;
