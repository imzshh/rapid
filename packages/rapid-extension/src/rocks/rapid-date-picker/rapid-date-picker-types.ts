import type { RockConfig, RockEventHandlerConfig } from "@ruiapp/move-style";

export const RAPID_DATE_PICKER_ROCK_TYPE = "rapidDatePicker" as const;

export interface RapidDatePickerProps {
  value?: string | moment.Moment | null;
  picker?: "year" | "month" | "date";
  onChange?: (value: string | null) => void;
}

export type RapidDatePickerRockConfig = RockConfig<
  Omit<RapidDatePickerProps, "onChange"> & {
    onChange?: RockEventHandlerConfig;
  },
  typeof RAPID_DATE_PICKER_ROCK_TYPE
>;
