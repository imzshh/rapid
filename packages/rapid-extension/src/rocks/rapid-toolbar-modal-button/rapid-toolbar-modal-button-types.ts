import type { RockChildrenConfig, RockConfig, RockEventHandlerConfig } from "@ruiapp/move-style";
import { RapidToolbarButtonProps } from "../rapid-toolbar-button/rapid-toolbar-button-types";

export const RAPID_TOOLBAR_MODAL_BUTTON_ROCK_TYPE = "rapidToolbarModalButton" as const;

export interface RapidToolbarModalButtonProps extends Omit<RapidToolbarButtonProps, "actionEventName"> {
  /**
   * 模态框的标题
   */
  modalTitle?: string;

  modalBody?: RockChildrenConfig;

  onModalOpen?: () => Promise<void> | void;

  onModalOk?: () => Promise<void> | void;

  onModalCancel?: () => Promise<void> | void;
}

export type RapidToolbarModalButtonRockConfig = RockConfig<
  Omit<RapidToolbarModalButtonProps, "onModalOpen" | "onModalOk" | "onModalCancel"> & {
    onModalOpen?: RockEventHandlerConfig;
    onModalOk?: RockEventHandlerConfig;
    onModalCancel?: RockEventHandlerConfig;
  },
  typeof RAPID_TOOLBAR_MODAL_BUTTON_ROCK_TYPE
>;
