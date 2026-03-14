import { fireEvent, type Rock, type RockInstance } from "@ruiapp/move-style";
import { genRockRenderer, renderRock, renderRockChildren } from "@ruiapp/react-renderer";
import { Modal } from "antd";
import { useState } from "react";
import { RapidToolbarButtonComponent } from "../rapid-toolbar-button/RapidToolbarButton";
import RapidToolbarModalButtonMeta from "./RapidToolbarModalButtonMeta";
import type { RapidToolbarModalButtonProps, RapidToolbarModalButtonRockConfig } from "./rapid-toolbar-modal-button-types";
import { omit } from "lodash";

export function configRapidToolbarModalButton(config: RapidToolbarModalButtonRockConfig): RapidToolbarModalButtonRockConfig {
  return config;
}

export function RapidToolbarModalButton(props: RapidToolbarModalButtonProps) {
  const { _context: context } = props as any as RockInstance;
  const { framework, page, scope } = context;
  const { modalTitle, modalBody, onModalOpen, onModalOk, onModalCancel, text, ...restProps } = props;

  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = async () => {
    setModalOpen(true);
    if (onModalOpen) {
      await fireEvent({
        eventName: "onModalOpen",
        framework,
        page,
        scope,
        sender: props,
        senderCategory: "component",
        eventHandlers: onModalOpen,
        eventArgs: [],
      });
    }
  };

  const handleOk = async () => {
    if (onModalOk) {
      await fireEvent({
        eventName: "onModalOk",
        framework,
        page,
        scope,
        sender: props,
        senderCategory: "component",
        eventHandlers: onModalOk,
        eventArgs: [],
      });
    }
    setModalOpen(false);
  };

  const handleCancel = async () => {
    if (onModalCancel) {
      await fireEvent({
        eventName: "onModalCancel",
        framework,
        page,
        scope,
        sender: props,
        senderCategory: "component",
        eventHandlers: onModalCancel,
        eventArgs: [],
      });
    }
    setModalOpen(false);
  };

  const btnProps = omit(restProps, ["$id", "_state", "_scope", "_initialized"]);

  return (
    <>
      <RapidToolbarButtonComponent {...btnProps} text={text} onAction={handleOpen} />
      <Modal title={modalTitle || text} open={modalOpen} onOk={handleOk} onCancel={handleCancel}>
        {renderRockChildren({ context, rockChildrenConfig: modalBody })}
      </Modal>
    </>
  );
}

export default {
  Renderer: genRockRenderer(RapidToolbarModalButtonMeta.$type, RapidToolbarModalButton, true),
  ...RapidToolbarModalButtonMeta,
} as Rock<RapidToolbarModalButtonRockConfig>;
