import type { RockConfig, RockEventHandlerConfig } from "@ruiapp/move-style";
import type { RapidToolbarActionBase } from "../../types/rapid-action-types";

export const RAPID_TOOLBAR_BUTTON_ROCK_TYPE = "rapidToolbarButton" as const;

export interface RapidToolbarButtonProps extends RapidToolbarActionBase {
  url?: string;

  /**
   * @deprecated
   */
  pageCode?: string;

  onAction?: () => Promise<void> | void;
}

export type RapidToolbarButtonRockConfig = RockConfig<
  Omit<RapidToolbarButtonProps, "onAction"> & {
    onAction?: RockEventHandlerConfig;
  },
  typeof RAPID_TOOLBAR_BUTTON_ROCK_TYPE
>;
