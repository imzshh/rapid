import type { RockConfig, RockEventHandlerConfig } from "@ruiapp/move-style";

export const RAPID_TIME_PICKER_ROCK_TYPE = "rapidTimePicker" as const;

export interface RapidTimePickerProps {
  value?: string | moment.Moment | null;
  onChange?: (value: string | null) => void;
}

export type RapidTimePickerRockConfig = RockConfig<
  Omit<RapidTimePickerProps, "onChange"> & {
    onChange?: RockEventHandlerConfig;
  },
  typeof RAPID_TIME_PICKER_ROCK_TYPE
>;
