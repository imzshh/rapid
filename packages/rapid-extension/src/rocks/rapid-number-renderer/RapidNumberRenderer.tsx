import { Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import RapidNumberRendererMeta from "./RapidNumberRendererMeta";
import { RapidNumberRendererProps, RapidNumberRendererRockConfig } from "./rapid-number-renderer-types";
import { isNull, isString, isUndefined } from "lodash";
import { wrapToRockComponent } from "@ruiapp/react-renderer";

export function configRapidNumberRenderer(config: RockComponentProps<RapidNumberRendererRockConfig>): RapidNumberRendererRockConfig {
  config.$type = RapidNumberRendererMeta.$type;
  return config as RapidNumberRendererRockConfig;
}

export function RapidNumberRendererComponent(props: RockInstanceProps<RapidNumberRendererProps>) {
  const { defaultText, conversionCoefficient, usingThousandSeparator, decimalPlaces, roundingMode } = props;
  let { value } = props;

  if (isUndefined(value) || isNull(value)) {
    return defaultText || "";
  }

  if (isString(value)) {
    value = parseFloat(value);
  }

  value = value / (conversionCoefficient || 1);

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
    minimumFractionDigits: decimalPlaces,
    useGrouping: useGrouping,
  }).format(value);
}

export const RapidNumberRenderer = wrapToRockComponent(RapidNumberRendererMeta, RapidNumberRendererComponent);

export default {
  Renderer: RapidNumberRendererComponent,
  ...RapidNumberRendererMeta,
} as Rock<RapidNumberRendererRockConfig>;
