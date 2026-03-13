import type { RockConfig } from "@ruiapp/move-style";

export const RAPID_DATE_TIME_RENDERER_ROCK_TYPE = "rapidDateTimeRenderer" as const;

export interface RapidDateTimeRendererProps {
  value?: any;
  format?: string;
}

export type RapidDateTimeRendererRockConfig = RockConfig<RapidDateTimeRendererProps, typeof RAPID_DATE_TIME_RENDERER_ROCK_TYPE>;
