import type { RockConfig } from "@ruiapp/move-style";
import type { RapidNumberRendererProps } from "../rapid-number-renderer/rapid-number-renderer-types";

export const RAPID_PERCENT_RENDERER_ROCK_TYPE = "rapidPercentRenderer" as const;

export interface RapidPercentRendererProps extends RapidNumberRendererProps {}

export type RapidPercentRendererRockConfig = RockConfig<RapidPercentRendererProps, typeof RAPID_PERCENT_RENDERER_ROCK_TYPE>;
