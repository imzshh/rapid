import { Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import RapidTextRendererMeta from "./RapidTextRendererMeta";
import { RapidTextRendererProps, RapidTextRendererRockConfig } from "./rapid-text-renderer-types";
import { isNull, isUndefined } from "lodash";
import { wrapToRockComponent } from "@ruiapp/react-renderer";

export function configRapidTextRenderer(config: RockComponentProps<RapidTextRendererRockConfig>): RapidTextRendererRockConfig {
  config.$type = RapidTextRendererMeta.$type;
  return config as RapidTextRendererRockConfig;
}

export function RapidTextRendererComponent(props: RockInstanceProps<RapidTextRendererProps>) {
  const { value, defaultText } = props;

  if (isUndefined(value) || isNull(value)) {
    return defaultText || "";
  }

  return value.toString();
}

export const RapidTextRenderer = wrapToRockComponent(RapidTextRendererMeta, RapidTextRendererComponent);

export default {
  Renderer: RapidTextRendererComponent,
  ...RapidTextRendererMeta,
} as Rock<RapidTextRendererRockConfig>;
