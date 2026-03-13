import type { RockConfig } from "@ruiapp/move-style";

export const RAPID_MONTH_PICKER_ROCK_TYPE = "rapidMonthPicker" as const;

export interface RapidMonthPickerProps {
  value?: string | moment.Moment | null;
  onChange?(value: string | null): void;
}

export type RapidMonthPickerRockConfig = RockConfig<RapidMonthPickerProps, typeof RAPID_MONTH_PICKER_ROCK_TYPE>;
