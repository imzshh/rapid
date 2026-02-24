import { RapidNumberRendererRockConfig } from "../rapid-number-renderer/rapid-number-renderer-types";

export interface RapidCurrencyRendererProps {
  value: string | number | null | undefined;
  currencyCode?: string;
}

export interface RapidCurrencyRendererRockConfig extends RapidCurrencyRendererProps, Omit<RapidNumberRendererRockConfig, "value"> {}
