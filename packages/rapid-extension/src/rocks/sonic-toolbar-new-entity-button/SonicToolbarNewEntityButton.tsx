import type { Rock, RockInstance } from "@ruiapp/move-style";
import { fireEvent } from "@ruiapp/move-style";
import SonicToolbarNewEntityButtonMeta from "./SonicToolbarNewEntityButtonMeta";
import { genRockRenderer } from "@ruiapp/react-renderer";
import { SonicToolbarNewEntityButtonProps, SonicToolbarNewEntityButtonRockConfig } from "./sonic-toolbar-new-entity-button-types";
import { RapidToolbarButtonComponent } from "../rapid-toolbar-button/RapidToolbarButton";
import { getExtensionLocaleStringResource } from "../../helpers/i18nHelper";

export function configSonicToolbarNewEntityButton(config: SonicToolbarNewEntityButtonRockConfig): SonicToolbarNewEntityButtonRockConfig {
  return config;
}

export function SonicToolbarNewEntityButton(props: SonicToolbarNewEntityButtonProps) {
  const { _context: context } = props as any as RockInstance;
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

  return (
    <RapidToolbarButtonComponent
      {...props}
      text={props.text || getExtensionLocaleStringResource(framework, "new")}
      actionEventName="onClick"
      onAction={handleAction}
    />
  );
}

export default {
  Renderer: genRockRenderer(SonicToolbarNewEntityButtonMeta.$type, SonicToolbarNewEntityButton, true),
  ...SonicToolbarNewEntityButtonMeta,
} as Rock<SonicToolbarNewEntityButtonRockConfig>;
