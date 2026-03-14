import type { Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import { Button, Modal, Tooltip } from "antd";
import RapidToolbarButtonMeta from "./RapidToolbarButtonMeta";
import { useRockInstanceContext, wrapToRockComponent } from "@ruiapp/react-renderer";
import type { RapidToolbarButtonProps, RapidToolbarButtonRockConfig } from "./rapid-toolbar-button-types";
import { getExtensionLocaleStringResource } from "../../helpers/i18nHelper";
import AntdIcon from "~/components/antd-icon/AntdIcon";

export function configRapidToolbarButton(config: RockComponentProps<RapidToolbarButtonRockConfig>): RapidToolbarButtonRockConfig {
  config.$type = RapidToolbarButtonMeta.$type;
  return config as RapidToolbarButtonRockConfig;
}

export function RapidToolbarButtonComponent(props: RockInstanceProps<RapidToolbarButtonProps>) {
  const context = useRockInstanceContext();
  const { framework } = context;
  const {
    onAction,
    confirmTitle,
    confirmText,
    tooltipTitle,
    tooltipColor,
    text,
    icon,
    actionStyle,
    danger,
    ghost,
    size,
    disabled,
    actionEventName = "onClick",
    url,
  } = props;

  let href: string | undefined;
  if (url) {
    href = url;
  }

  const handleClick = () => {
    if (!onAction) return;

    if (confirmText) {
      Modal.confirm({
        title: confirmTitle,
        content: confirmText,
        okText: getExtensionLocaleStringResource(framework, "ok"),
        cancelText: getExtensionLocaleStringResource(framework, "cancel"),
        onOk: () => onAction?.(),
      });
    } else {
      onAction?.();
    }
  };

  const buttonProps: Record<string, any> = {
    type: actionStyle,
    danger: !!danger,
    ghost: !!ghost,
    size,
    disabled,
    href,
  };

  if (onAction) {
    buttonProps[actionEventName] = handleClick;
  }

  const buttonElement = (
    <Button {...buttonProps} icon={icon ? <AntdIcon name={icon} /> : undefined}>
      <span>{text}</span>
    </Button>
  );

  if (tooltipTitle) {
    return (
      <Tooltip title={tooltipTitle} color={tooltipColor}>
        {buttonElement}
      </Tooltip>
    );
  }

  return buttonElement;
}

export const RapidToolbarButton = wrapToRockComponent(RapidToolbarButtonMeta, RapidToolbarButtonComponent);

export default {
  Renderer: RapidToolbarButtonComponent,
  ...RapidToolbarButtonMeta,
} as Rock<RapidToolbarButtonRockConfig>;
