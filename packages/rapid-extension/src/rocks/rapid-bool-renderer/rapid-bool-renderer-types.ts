import type { RockConfig } from "@ruiapp/move-style";

export const RAPID_BOOL_RENDERER_ROCK_TYPE = "rapidBoolRenderer" as const;

export interface RapidBoolRendererProps {
  value?: boolean | null;
  strictEquals?: boolean;
  trueText?: string;
  falseText?: string;
  defaultText?: string;
}

export type RapidBoolRendererRockConfig = RockConfig<RapidBoolRendererProps, typeof RAPID_BOOL_RENDERER_ROCK_TYPE>;
