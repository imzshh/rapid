import type { RockEventHandlerConfig, SimpleRockConfig } from "@ruiapp/move-style";
import { RapidToolbarButtonProps } from "../rapid-toolbar-button/rapid-toolbar-button-types";
import { RapidEntityFormProps } from "../rapid-entity-form/rapid-entity-form-types";

export interface SonicRecordActionEditEntityConfig extends Omit<RapidToolbarButtonProps, "actionEventName"> {
  /**
   * 模态框的标题。
   */
  modalTitle?: string;

  form?: Partial<RapidEntityFormProps>;

  successMessage?: string;

  errorMessage?: string;
}

export interface SonicRecordActionEditEntityRockConfig extends SimpleRockConfig, SonicRecordActionEditEntityConfig {}
