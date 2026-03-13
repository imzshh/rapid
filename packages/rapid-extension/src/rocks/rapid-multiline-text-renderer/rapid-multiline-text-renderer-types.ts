import type { RockConfig } from "@ruiapp/move-style";

export const RAPID_MULTILINE_TEXT_RENDERER_ROCK_TYPE = "rapidMultilineTextRenderer" as const;

export interface RapidMultilineTextRendererProps {
  value?: string | null;
  defaultText?: string;
}

export type RapidMultilineTextRendererRockConfig = RockConfig<RapidMultilineTextRendererProps, typeof RAPID_MULTILINE_TEXT_RENDERER_ROCK_TYPE>;
