import type { RockConfig, RockEventHandler } from "@ruiapp/move-style";

export const RAPID_JSON_FORM_INPUT_ROCK_TYPE = "rapidJsonFormInput" as const;

export interface RapidJsonFormInputProps {
  value?: any;
  onChange?: (value: any) => void;
}

export type RapidJsonFormInputRockConfig = RockConfig<RapidJsonFormInputProps, typeof RAPID_JSON_FORM_INPUT_ROCK_TYPE>;
