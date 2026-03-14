import type { RockChildrenConfig, RockConfig, RockEventHandlerConfig } from "@ruiapp/move-style";
import { RapidToolbarButtonProps } from "../rapid-toolbar-button/rapid-toolbar-button-types";

export const RAPID_TOOLBAR_FORM_MODAL_BUTTON_ROCK_TYPE = "rapidToolbarFormModalButton" as const;

export interface RapidToolbarFormModalButtonProps extends Omit<RapidToolbarButtonProps, "actionEventName"> {
  /**
   * 模态框的标题
   */
  modalTitle?: string;

  modalBody?: RockChildrenConfig;

  form?: RockConfig;

  onModalOpen?: () => Promise<void> | void;

  onModalOk?: () => Promise<void> | void;

  onModalCancel?: () => Promise<void> | void;

  /**
   * @deprecated 请使用 onSubmitSuccess
   */
  onSaveSuccess?: RockEventHandlerConfig;

  onSubmitSuccess?: RockEventHandlerConfig;

  /**
   * @deprecated 请使用 onSubmitError
   */
  onSaveError?: RockEventHandlerConfig;

  onSubmitError?: RockEventHandlerConfig;
}

export type RapidToolbarFormModalButtonRockConfig = RockConfig<
  Omit<RapidToolbarFormModalButtonProps, "onModalOpen" | "onModalOk" | "onModalCancel"> & {
    onModalOpen?: RockEventHandlerConfig;
    onModalOk?: RockEventHandlerConfig;
    onModalCancel?: RockEventHandlerConfig;
  },
  typeof RAPID_TOOLBAR_FORM_MODAL_BUTTON_ROCK_TYPE
>;
