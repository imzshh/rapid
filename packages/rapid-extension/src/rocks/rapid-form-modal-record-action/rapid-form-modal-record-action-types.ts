import type { RockConfig, RockEventHandlerConfig } from "@ruiapp/move-style";
import type { RapidTableActionProps } from "../rapid-table-action/rapid-table-action-types";

export const RAPID_FORM_MODAL_RECORD_ACTION_ROCK_TYPE = "rapidFormModalRecordAction" as const;

export interface RapidFormModalRecordActionProps extends RapidTableActionProps {
  /**
   * 模态框的标题
   */
  modalTitle?: string;

  form: RockConfig;

  successMessage?: string;

  errorMessage?: string;

  /**
   * @deprecated 请使用 onSubmit
   */
  onFormSubmit?: RockEventHandlerConfig;

  onSubmit?: RockEventHandlerConfig;

  onModalOpen?: RockEventHandlerConfig;

  onModalCancel?: RockEventHandlerConfig;

  resetFormOnModalOpen?: boolean;
}

export type RapidFormModalRecordActionRockConfig = RockConfig<RapidFormModalRecordActionProps, typeof RAPID_FORM_MODAL_RECORD_ACTION_ROCK_TYPE>;
