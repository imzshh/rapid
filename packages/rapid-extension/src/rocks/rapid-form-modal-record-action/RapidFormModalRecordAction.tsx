import {
  MoveStyleUtils,
  RockInstance,
  fireEvent,
  omitSystemRockConfigFields,
  type Rock,
  type RockComponentProps,
  type RockConfig,
  type RockInstanceProps,
} from "@ruiapp/move-style";
import { renderRock, useRockInstance, useRockInstanceContext, wrapToRockComponent } from "@ruiapp/react-renderer";
import RapidFormModalRecordActionMeta from "./RapidFormModalRecordActionMeta";
import { RapidFormModalRecordActionProps, RapidFormModalRecordActionRockConfig } from "./rapid-form-modal-record-action-types";
import { cloneDeep, omit } from "lodash";
import { Modal, message } from "antd";
import { RapidFormRockConfig } from "../rapid-form/rapid-form-types";
import { getExtensionLocaleStringResource } from "../../helpers/i18nHelper";
import { useState } from "react";
import { RapidTableActionComponent } from "../rapid-table-action/RapidTableAction";

export function configRapidFormModalRecordAction(config: RockComponentProps<RapidFormModalRecordActionRockConfig>): RapidFormModalRecordActionRockConfig {
  config.$type = RapidFormModalRecordActionMeta.$type;
  return config as RapidFormModalRecordActionRockConfig;
}

export function RapidFormModalRecordActionComponent(props: RockInstanceProps<RapidFormModalRecordActionProps>) {
  const context = useRockInstanceContext();
  const { $id } = useRockInstance(props, RapidFormModalRecordActionMeta.$type);
  const { framework, page, scope } = context;
  const { resetFormOnModalOpen, form, onSubmit, onFormSubmit, successMessage, errorMessage, onModalOpen, onModalCancel } = props;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalSaving, setModalSaving] = useState(false);

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

  const btnProps = omit(omitSystemRockConfigFields(props as unknown as RockInstance), [
    "modalTitle",
    "form",
    "errorMessage",
    "successMessage",
    "onFormSubmit",
    "onSubmit",
    "onModalOpen",
    "onModalCancel",
    "resetFormOnModalOpen",
  ]);

  return (
    <>
      <RapidTableActionComponent {...btnProps} onAction={handleOpenModal} />
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

export const RapidFormModalRecordAction = wrapToRockComponent(RapidFormModalRecordActionMeta, RapidFormModalRecordActionComponent);

export default {
  Renderer: RapidFormModalRecordActionComponent,

  ...RapidFormModalRecordActionMeta,
} as Rock<RapidFormModalRecordActionRockConfig>;
