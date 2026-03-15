import type { Rock, RockComponentProps, RockInstance, RockInstanceProps } from "@ruiapp/move-style";
import { fireEvent, omitSystemRockConfigFields } from "@ruiapp/move-style";
import SonicToolbarRefreshButtonMeta from "./SonicToolbarRefreshButtonMeta";
import { useRockInstanceContext, wrapToRockComponent } from "@ruiapp/react-renderer";
import type { SonicToolbarRefreshButtonProps, SonicToolbarRefreshButtonRockConfig } from "./sonic-toolbar-refresh-button-types";
import { RapidToolbarButtonComponent } from "../rapid-toolbar-button/RapidToolbarButton";
import { getExtensionLocaleStringResource } from "../../helpers/i18nHelper";

export function configSonicToolbarRefreshButton(config: RockComponentProps<SonicToolbarRefreshButtonRockConfig>): SonicToolbarRefreshButtonRockConfig {
  config.$type = SonicToolbarRefreshButtonMeta.$type;
  return config as SonicToolbarRefreshButtonRockConfig;
}

export function SonicToolbarRefreshButtonComponent(props: RockInstanceProps<SonicToolbarRefreshButtonProps>) {
  const context = useRockInstanceContext();
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

  const btnProps = omitSystemRockConfigFields(props as RockInstance);

  return (
    <RapidToolbarButtonComponent
      {...btnProps}
      text={props.text || getExtensionLocaleStringResource(framework, "refresh")}
      icon={props.icon || "ReloadOutlined"}
      actionEventName="onClick"
      onAction={handleAction}
    />
  );
}

export const SonicToolbarRefreshButton = wrapToRockComponent(SonicToolbarRefreshButtonMeta, SonicToolbarRefreshButtonComponent);

export default {
  Renderer: SonicToolbarRefreshButtonComponent,
  ...SonicToolbarRefreshButtonMeta,
} as Rock<SonicToolbarRefreshButtonRockConfig>;
