import type { RockConfig } from "@ruiapp/move-style";

export const RAPID_TOOLBAR_ROCK_TYPE = "rapidToolbar" as const;

export interface RapidToolbarProps {
  extraClassName?: string;
  items?: RockConfig[];
  extras?: RockConfig[];
  rightExtras?: RockConfig[];
}

export type RapidToolbarRockConfig = RockConfig<RapidToolbarProps, typeof RAPID_TOOLBAR_ROCK_TYPE>;
