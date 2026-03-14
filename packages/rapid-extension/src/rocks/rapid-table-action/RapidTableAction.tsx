import { Rock, RockComponentProps } from "@ruiapp/move-style";
import RapidTableActionMeta from "./RapidTableActionMeta";
import { RapidTableActionProps, RapidTableActionRockConfig } from "./rapid-table-action-types";
import { useRockInstanceContext, wrapToRockComponent } from "@ruiapp/react-renderer";
import { Modal, Tooltip } from "antd";
import { getExtensionLocaleStringResource } from "../../helpers/i18nHelper";
import "./style.css";
import React from "react";

export function configRapidTableAction(config: RockComponentProps<RapidTableActionRockConfig>): RapidTableActionRockConfig {
  config.$type = RapidTableActionMeta.$type;
  return config as RapidTableActionRockConfig;
}

export function RapidTableActionComponent(props: RapidTableActionProps) {
  const context = useRockInstanceContext();
  const { framework } = context;
  const { record, recordId, actionText, confirmTitle, confirmText, onAction, disabled, disabledTooltipText, url } = props;

  if (disabled) {
    const spanContent = (
      <span className="rui-table-action-link rui-table-action-link--disabled" data-record-id={recordId}>
        {actionText}
      </span>
    );

    if (disabledTooltipText) {
      return (
        <Tooltip title={disabledTooltipText} color="rgba(0,0,0,0.5)">
          {spanContent}
        </Tooltip>
      );
    }
    return spanContent;
  }

  const handleAction = (event: React.MouseEvent) => {
    if (!onAction) {
      return;
    }

    const runAction = async () => {
      await onAction({ record, recordId });
    };

    if (confirmText) {
      event.preventDefault();
      Modal.confirm({
        title: confirmTitle,
        content: confirmText,
        okText: getExtensionLocaleStringResource(framework, "ok"),
        cancelText: getExtensionLocaleStringResource(framework, "cancel"),
        onOk: runAction,
      });
    } else {
      runAction();
    }
  };

  return (
    <a href={url} className="rui-table-action-link" data-record-id={recordId} onClick={handleAction}>
      {actionText}
    </a>
  );
}

export const RapidTableAction = wrapToRockComponent(RapidTableActionMeta, RapidTableActionComponent);

export default {
  Renderer: RapidTableActionComponent,
  ...RapidTableActionMeta,
} as Rock<RapidTableActionRockConfig>;
