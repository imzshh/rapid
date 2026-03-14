import type { Rock, RockInstance } from "@ruiapp/move-style";
import { fireEvent } from "@ruiapp/move-style";
import SonicToolbarRefreshButtonMeta from "./SonicToolbarRefreshButtonMeta";
import { genRockRenderer } from "@ruiapp/react-renderer";
import { SonicToolbarRefreshButtonProps, SonicToolbarRefreshButtonRockConfig } from "./sonic-toolbar-refresh-button-types";
import { RapidToolbarButtonComponent } from "../rapid-toolbar-button/RapidToolbarButton";
import { getExtensionLocaleStringResource } from "../../helpers/i18nHelper";

export function configSonicToolbarRefreshButton(config: SonicToolbarRefreshButtonRockConfig): SonicToolbarRefreshButtonRockConfig {
  return config;
}

export function SonicToolbarRefreshButton(props: SonicToolbarRefreshButtonProps) {
  const { _context: context } = props as any as RockInstance;
  const { framework, page, scope } = context;

  const handleAction = async () => {
    await scope.notifyEvent({
      name: "onRefreshButtonClick",
      framework,
      page,
      scope,
      sender: props,
      senderCategory: "component",
      args: [],
    });
  };

  return <RapidToolbarButtonComponent {...props} text={props.text || getExtensionLocaleStringResource(framework, "refresh")} onAction={handleAction} />;
}

export default {
  Renderer: genRockRenderer(SonicToolbarRefreshButtonMeta.$type, SonicToolbarRefreshButton, true),
  ...SonicToolbarRefreshButtonMeta,
} as Rock<SonicToolbarRefreshButtonRockConfig>;
