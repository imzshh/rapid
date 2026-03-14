import type { Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import { Button } from "antd";
import RapidToolbarLinkMeta from "./RapidToolbarLinkMeta";
import { wrapToRockComponent } from "@ruiapp/react-renderer";
import type { RapidToolbarLinkProps, RapidToolbarLinkRockConfig } from "./rapid-toolbar-link-types";
import AntdIcon from "../../components/antd-icon/AntdIcon";

export function configRapidToolbarLink(config: RockComponentProps<RapidToolbarLinkRockConfig>): RapidToolbarLinkRockConfig {
  config.$type = RapidToolbarLinkMeta.$type;
  return config as RapidToolbarLinkRockConfig;
}

export function RapidToolbarLinkComponent(props: RockInstanceProps<RapidToolbarLinkProps>) {
  const { text, icon, actionStyle, danger, ghost, size, disabled, url, target, onAction, actionEventName = "onClick" } = props;

  const buttonProps: Record<string, any> = {
    type: actionStyle,
    danger,
    ghost,
    size,
    disabled,
    href: url,
    target,
  };

  if (onAction) {
    buttonProps[actionEventName] = onAction;
  }

  return (
    <Button {...buttonProps} icon={icon ? <AntdIcon name={icon} /> : undefined}>
      {text}
    </Button>
  );
}

export const RapidToolbarLink = wrapToRockComponent(RapidToolbarLinkMeta, RapidToolbarLinkComponent);

export default {
  Renderer: RapidToolbarLinkComponent,
  ...RapidToolbarLinkMeta,
} as Rock<RapidToolbarLinkRockConfig>;
