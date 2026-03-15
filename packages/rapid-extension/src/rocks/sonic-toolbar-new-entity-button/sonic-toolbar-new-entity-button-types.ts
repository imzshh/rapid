import type { RockConfig, RockEventHandlerConfig } from "@ruiapp/move-style";
import type { RapidToolbarButtonProps } from "../rapid-toolbar-button/rapid-toolbar-button-types";

export const SONIC_TOOLBAR_NEW_ENTITY_BUTTON_ROCK_TYPE = "sonicToolbarNewEntityButton" as const;

export interface SonicToolbarNewEntityButtonProps extends Omit<RapidToolbarButtonProps, "onAction"> {
  onAction?: () => Promise<void> | void;
}

export type SonicToolbarNewEntityButtonRockConfig = RockConfig<
  Omit<SonicToolbarNewEntityButtonProps, "onAction"> & {
    onAction?: RockEventHandlerConfig;
  },
  typeof SONIC_TOOLBAR_NEW_ENTITY_BUTTON_ROCK_TYPE
>;
