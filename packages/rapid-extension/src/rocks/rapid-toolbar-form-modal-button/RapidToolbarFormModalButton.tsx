import {
  RockEventHandler,
  type Rock,
  type RockComponentProps,
  type RockInstanceProps,
  RockChildrenConfig,
  omitSystemRockConfigFields,
  RockInstance,
} from "@ruiapp/move-style";
import { renderRockChildren, useRockInstance, useRockInstanceContext, wrapToRockComponent } from "@ruiapp/react-renderer";
import RapidToolbarFormModalButtonMeta from "./RapidToolbarFormModalButtonMeta";
import { RapidToolbarFormModalButtonProps, RapidToolbarFormModalButtonRockConfig } from "./rapid-toolbar-form-modal-button-types";
import { RapidFormRockConfig } from "../rapid-form/rapid-form-types";
import { getExtensionLocaleStringResource } from "../../helpers/i18nHelper";
import { Modal } from "antd";
import { useState } from "react";
import { RapidToolbarButtonComponent } from "../rapid-toolbar-button/RapidToolbarButton";
import { omit } from "lodash";

export function configRapidToolbarFormModalButton(config: RockComponentProps<RapidToolbarFormModalButtonRockConfig>): RapidToolbarFormModalButtonRockConfig {
  config.$type = RapidToolbarFormModalButtonMeta.$type;
  return config as RapidToolbarFormModalButtonRockConfig;
}

export function RapidToolbarFormModalButtonComponent(props: RockInstanceProps<RapidToolbarFormModalButtonProps>) {
  const context = useRockInstanceContext();
  const { framework, page } = context;
  const { $id } = useRockInstance(props, RapidToolbarFormModalButtonMeta.$type);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSaving, setModalSaving] = useState(false);

  const handleOpen = async () => {
    if (props.onAction) {
      await props.onAction();
    }
    setModalOpen(true);
    if (props.onModalOpen) {
      await props.onModalOpen();
    }
  };

  const handleCancel = async () => {
    if (props.onModalCancel) {
      await props.onModalCancel();
    }
    setModalOpen(false);
  };

  const formRockId = `${$id}-form`;

  const handleOk = async () => {
    if (props.onModalOk) {
      await props.onModalOk();
    }
    page.sendComponentMessage(formRockId, { name: "submit" });
  };

  let modalBody: RockChildrenConfig | null = null;
  if (props.form) {
    const formRockConfig: RapidFormRockConfig = {
      $id: formRockId,
      ...(props.form as RapidFormRockConfig),
      beforeSubmit: [
        {
          $action: "script",
          script: () => {
            setModalSaving(true);
          },
        },
        ...((props.form.beforeSubmit as RockEventHandler[]) || []),
      ],
      onSubmitSuccess: [
        {
          $action: "script",
          script: () => {
            setModalSaving(false);
            setModalOpen(false);
          },
        },
        ...(((props.form.onSubmitSuccess || props.form.onSaveSuccess) as RockEventHandler[]) || []),
        ...(((props.onSubmitSuccess || props.onSaveSuccess) as RockEventHandler[]) || []),
      ],
      onSubmitError: [
        {
          $action: "script",
          script: () => {
            setModalSaving(false);
          },
        },
        ...(((props.form.onSubmitError || props.form.onSaveError) as RockEventHandler[]) || []),
        ...(((props.onSubmitError || props.onSaveError) as RockEventHandler[]) || []),
      ],
    };
    modalBody = formRockConfig;
  } else {
    modalBody = props.modalBody || [];
  }

  const btnProps = omit(omitSystemRockConfigFields(props as RockInstance), ["onModalOpen", "onModalOk", "onModalCancel"]);

  return (
    <>
      <RapidToolbarButtonComponent {...btnProps} onAction={handleOpen} />
      <Modal
        title={props.modalTitle || props.text}
        open={modalOpen}
        confirmLoading={modalSaving}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={getExtensionLocaleStringResource(framework, "ok")}
        cancelText={getExtensionLocaleStringResource(framework, "cancel")}
        destroyOnClose={true}
        maskClosable={false}
      >
        {renderRockChildren({ context, rockChildrenConfig: modalBody })}
      </Modal>
    </>
  );
}

export const RapidToolbarFormModalButton = wrapToRockComponent(RapidToolbarFormModalButtonMeta, RapidToolbarFormModalButtonComponent);

export default {
  Renderer: RapidToolbarFormModalButtonComponent,
  ...RapidToolbarFormModalButtonMeta,
} as Rock<RapidToolbarFormModalButtonRockConfig>;
