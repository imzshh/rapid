import type { Rock, RockComponentProps, RockInstance, RockInstanceProps } from "@ruiapp/move-style";
import { fireEvent, omitSystemRockConfigFields } from "@ruiapp/move-style";
import SonicToolbarNewEntityButtonMeta from "./SonicToolbarNewEntityButtonMeta";
import { useRockInstanceContext, wrapToRockComponent } from "@ruiapp/react-renderer";
import type { SonicToolbarNewEntityButtonProps, SonicToolbarNewEntityButtonRockConfig } from "./sonic-toolbar-new-entity-button-types";
import { RapidToolbarButtonComponent } from "../rapid-toolbar-button/RapidToolbarButton";
import { getExtensionLocaleStringResource } from "../../helpers/i18nHelper";
export function configSonicToolbarNewEntityButton(config: RockComponentProps<SonicToolbarNewEntityButtonRockConfig>): SonicToolbarNewEntityButtonRockConfig {
  config.$type = SonicToolbarNewEntityButtonMeta.$type;
  return config as SonicToolbarNewEntityButtonRockConfig;
}

export function SonicToolbarNewEntityButtonComponent(props: RockInstanceProps<SonicToolbarNewEntityButtonProps>) {
  const context = useRockInstanceContext();
  const { framework, page, scope } = context;

  const handleAction = async () => {
    await fireEvent({
      eventName: "onAction",
      framework,
      page,
      scope,
      sender: props,
      senderCategory: "component",
      eventHandlers: [
        {
          $action: "notifyEvent",
          eventName: "onNewEntityButtonClick",
        },
      ],
      eventArgs: [],
    });
  };

  const btnProps = omitSystemRockConfigFields(props as RockInstance);

  return (
    <RapidToolbarButtonComponent
      {...btnProps}
      text={props.text || getExtensionLocaleStringResource(framework, "new")}
      actionEventName="onClick"
      onAction={handleAction}
    />
  );
}

export const SonicToolbarNewEntityButton = wrapToRockComponent(SonicToolbarNewEntityButtonMeta, SonicToolbarNewEntityButtonComponent);

export default {
  Renderer: SonicToolbarNewEntityButtonComponent,
  ...SonicToolbarNewEntityButtonMeta,
} as Rock<SonicToolbarNewEntityButtonRockConfig>;
