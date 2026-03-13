import type { Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import RapidPercentRendererMeta from "./RapidPercentRendererMeta";
import { RAPID_PERCENT_RENDERER_ROCK_TYPE, type RapidPercentRendererProps, type RapidPercentRendererRockConfig } from "./rapid-percent-renderer-types";
import { isNull, isString, isUndefined } from "lodash";
import { wrapToRockComponent } from "@ruiapp/react-renderer";

export function configRapidPercentRenderer(config: RockComponentProps<RapidPercentRendererRockConfig>): RapidPercentRendererRockConfig {
  config.$type = RAPID_PERCENT_RENDERER_ROCK_TYPE;
  return config as RapidPercentRendererRockConfig;
}

export function RapidPercentRendererComponent(props: RockInstanceProps<RapidPercentRendererProps>) {
  const { defaultText, usingThousandSeparator, decimalPlaces, roundingMode } = props;
  let { value } = props;

  if (isUndefined(value) || isNull(value)) {
    return defaultText || "";
  }

  if (isString(value)) {
    value = parseFloat(value);
  }

  const useGrouping = !!usingThousandSeparator;

  if (roundingMode !== "halfExpand" && decimalPlaces) {
    const powNum = Math.pow(10, decimalPlaces);
    if (roundingMode === "ceil") {
      value = Math.ceil(value * powNum) / powNum;
    } else if (roundingMode === "floor") {
      value = Math.floor(value * powNum) / powNum;
    }
  }

  return Intl.NumberFormat("Zh-cn", {
    style: "percent",
    minimumFractionDigits: decimalPlaces,
    useGrouping: useGrouping,
  }).format(value);
}

export const RapidPercentRenderer = wrapToRockComponent(RapidPercentRendererMeta, RapidPercentRendererComponent);

export default {
  Renderer: RapidPercentRendererComponent,
  ...RapidPercentRendererMeta,
} as Rock<RapidPercentRendererRockConfig>;
