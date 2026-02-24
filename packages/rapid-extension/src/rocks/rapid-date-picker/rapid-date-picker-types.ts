import type { SimpleRockConfig } from "@ruiapp/move-style";

export interface RapidDatePickerProps {
  value?: string | moment.Moment | null;
  picker?: "year" | "month" | "date";
  onChange?(value: string | null): void;
}

export interface RapidDatePickerRockConfig extends SimpleRockConfig, RapidDatePickerProps {}
