import type { RockConfig } from "@ruiapp/move-style";
import type { RapidToolbarButtonProps } from "../rapid-toolbar-button/rapid-toolbar-button-types";

export const SONIC_TOOLBAR_REFRESH_BUTTON_ROCK_TYPE = "sonicToolbarRefreshButton" as const;

export interface SonicToolbarRefreshButtonProps extends Omit<RapidToolbarButtonProps, "actionEventName" | "onAction"> {}

export type SonicToolbarRefreshButtonRockConfig = RockConfig<SonicToolbarRefreshButtonProps, typeof SONIC_TOOLBAR_REFRESH_BUTTON_ROCK_TYPE>;
