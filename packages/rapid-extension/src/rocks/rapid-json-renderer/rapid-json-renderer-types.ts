import type { RockConfig } from "@ruiapp/move-style";

export const RAPID_JSON_RENDERER_ROCK_TYPE = "rapidJsonRenderer" as const;

export interface RapidJsonRendererProps {
  value?: any;
  defaultText?: string;
}

export type RapidJsonRendererRockConfig = RockConfig<RapidJsonRendererProps, typeof RAPID_JSON_RENDERER_ROCK_TYPE>;
