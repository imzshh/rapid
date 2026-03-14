import { MoveStyleUtils, RockInstance, RuiEvent, fireEvent, type Rock, type RockConfig } from "@ruiapp/move-style";
import { genRockRenderer, renderRock } from "@ruiapp/react-renderer";
import RapidFormModalRecordActionMeta from "./RapidFormModalRecordActionMeta";
import { RapidFormModalRecordActionRockConfig } from "./rapid-form-modal-record-action-types";
import { cloneDeep } from "lodash";
import { Modal, message } from "antd";
import { RapidFormRockConfig } from "../rapid-form/rapid-form-types";
import { getExtensionLocaleStringResource } from "../../helpers/i18nHelper";
import { useState } from "react";
import { RapidTableActionComponent } from "../rapid-table-action/RapidTableAction";

export function configRapidFormModalRecordAction(config: RapidFormModalRecordActionRockConfig): RapidFormModalRecordActionRockConfig {
  return config;
}

export function RapidFormModalRecordAction(props: RapidFormModalRecordActionRockConfig) {
  const { $id, _context: context } = props as unknown as RockInstance;
  const { framework, page, scope } = context;
  const { resetFormOnModalOpen, form, onSubmit, onFormSubmit, successMessage, errorMessage, onModalOpen, onModalCancel } = props;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalSaving, setModalSaving] = useState(false);

  // TODO: need a better implementation. a component should not care about whether it's in a slot.
  const slotIndex = props.$slot?.index || "0";
  const formRockId = `${$id}-form-${slotIndex}`;
  const formRockConfig = cloneDeep(form) as RapidFormRockConfig;
  formRockConfig.$id = formRockId;

  const handleFormSubmit = async (formData: any) => {
    setModalSaving(true);

    const submitHandler = onSubmit || onFormSubmit;
    try {
      if (submitHandler) {
        await fireEvent({
          eventName: "onSubmit",
          framework,
          page,
          scope,
          sender: props,
          eventHandlers: submitHandler,
          eventArgs: [formData],
        });
      }

      setModalSaving(false);
      setModalOpen(false);
      message.success(successMessage);
    } catch (ex: any) {
      setModalSaving(false);
      let errMsg = ex.message;
      if (errorMessage) {
        errMsg = errorMessage + errMsg;
      }
      message.error(errMsg);
    }
  };
  formRockConfig.onSubmit = handleFormSubmit;

  const handleOpenModal = async () => {
    setModalOpen(true);

    if (resetFormOnModalOpen) {
      page.sendComponentMessage(formRockId, {
        name: "resetFields",
      });
    }

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

  const handleOk = () => {
    page.sendComponentMessage(formRockId, {
      name: "submit",
    });
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

  const formScopeConfig: RockConfig = {
    $type: "scope",
    $id: `${props.$id}-scope-${slotIndex}`,
    children: [formRockConfig],
  };

  return (
    <>
      <RapidTableActionComponent {...MoveStyleUtils.omitSystemRockConfigFields(props as RockConfig)} onAction={handleOpenModal} />
      <Modal
        title={props.modalTitle || props.actionText}
        open={modalOpen}
        confirmLoading={modalSaving}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={getExtensionLocaleStringResource(framework, "ok")}
        cancelText={getExtensionLocaleStringResource(framework, "cancel")}
      >
        {renderRock({ context, rockConfig: formScopeConfig })}
      </Modal>
    </>
  );
}

export default {
  Renderer: genRockRenderer(RapidFormModalRecordActionMeta.$type, RapidFormModalRecordAction, true),

  ...RapidFormModalRecordActionMeta,
} as Rock<RapidFormModalRecordActionRockConfig>;
