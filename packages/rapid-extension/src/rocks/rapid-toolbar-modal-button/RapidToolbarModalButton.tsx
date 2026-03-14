import { omitSystemRockConfigFields, type Rock, type RockComponentProps, type RockInstance, type RockInstanceProps } from "@ruiapp/move-style";
import { renderRockChildren, useRockInstanceContext, wrapToRockComponent } from "@ruiapp/react-renderer";
import { Modal } from "antd";
import { useState } from "react";
import { RapidToolbarButtonComponent } from "../rapid-toolbar-button/RapidToolbarButton";
import RapidToolbarModalButtonMeta from "./RapidToolbarModalButtonMeta";
import type { RapidToolbarModalButtonProps, RapidToolbarModalButtonRockConfig } from "./rapid-toolbar-modal-button-types";
import { omit } from "lodash";

export function configRapidToolbarModalButton(config: RockComponentProps<RapidToolbarModalButtonRockConfig>): RapidToolbarModalButtonRockConfig {
  config.$type = RapidToolbarModalButtonMeta.$type;
  return config as RapidToolbarModalButtonRockConfig;
}

export function RapidToolbarModalButtonComponent(props: RockInstanceProps<RapidToolbarModalButtonProps>) {
  const context = useRockInstanceContext();
  const { modalTitle, modalBody, onModalOpen, onModalOk, onModalCancel, text } = props;

  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = async () => {
    if (props.onAction) {
      await props.onAction();
    }
    setModalOpen(true);
    if (onModalOpen) {
      await onModalOpen();
    }
  };

  const handleOk = async () => {
    if (onModalOk) {
      await onModalOk();
    }
    setModalOpen(false);
  };

  const handleCancel = async () => {
    if (onModalCancel) {
      await onModalCancel();
    }
    setModalOpen(false);
  };

  const btnProps = omit(omitSystemRockConfigFields(props as RockInstance), ["modalTitle", "modalBody", "onModalOpen", "onModalOk", "onModalCancel"]);

  return (
    <>
      <RapidToolbarButtonComponent {...btnProps} text={text} onAction={handleOpen} />
      <Modal title={modalTitle || text} open={modalOpen} onOk={handleOk} onCancel={handleCancel}>
        {modalOpen ? renderRockChildren({ context, rockChildrenConfig: modalBody }) : null}
      </Modal>
    </>
  );
}

export const RapidToolbarModalButton = wrapToRockComponent(RapidToolbarModalButtonMeta, RapidToolbarModalButtonComponent);

export default {
  Renderer: RapidToolbarModalButtonComponent,
  ...RapidToolbarModalButtonMeta,
} as Rock<RapidToolbarModalButtonRockConfig>;
