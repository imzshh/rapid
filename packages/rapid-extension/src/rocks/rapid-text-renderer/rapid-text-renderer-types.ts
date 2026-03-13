import type { RockConfig } from "@ruiapp/move-style";

export const RAPID_TEXT_RENDERER_ROCK_TYPE = "rapidTextRenderer" as const;

export interface RapidTextRendererProps {
  value?: string | null;
  defaultText?: string;
  format?: string;
}

export type RapidTextRendererRockConfig = RockConfig<RapidTextRendererProps, typeof RAPID_TEXT_RENDERER_ROCK_TYPE>;
