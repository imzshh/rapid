import type { RockConfig } from "@ruiapp/move-style";
import type { RapidNumberRendererProps } from "../rapid-number-renderer/rapid-number-renderer-types";

export const RAPID_CURRENCY_RENDERER_ROCK_TYPE = "rapidCurrencyRenderer" as const;

export interface RapidCurrencyRendererProps extends Omit<RapidNumberRendererProps, "value"> {
  value: string | number | null | undefined;
  currencyCode?: string;
}

export type RapidCurrencyRendererRockConfig = RockConfig<RapidCurrencyRendererProps, typeof RAPID_CURRENCY_RENDERER_ROCK_TYPE>;
