import type { Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import { MoveStyleUtils } from "@ruiapp/move-style";
import { wrapToRockComponent } from "@ruiapp/react-renderer";
import RapidObjectRendererMeta from "./RapidObjectRendererMeta";
import type { RapidObjectRendererProps, RapidObjectRendererRockConfig } from "./rapid-object-renderer-types";

export function configRapidObjectRenderer(config: RockComponentProps<RapidObjectRendererRockConfig>) {
  config.$type = RapidObjectRendererMeta.$type;
  return config as RapidObjectRendererRockConfig;
}

export function RapidObjectRendererComponent(props: RockInstanceProps<RapidObjectRendererProps>) {
  const { value, format, defaultText } = props;
  if (value) {
    if (!format) {
      // TODO: render items
      return value.toString();
    }
    return MoveStyleUtils.fulfillVariablesInString(format, value);
  } else {
    return defaultText || "";
  }
}

export const RapidObjectRenderer = wrapToRockComponent(RapidObjectRendererMeta, RapidObjectRendererComponent);

export default {
  Renderer: RapidObjectRendererComponent,
  ...RapidObjectRendererMeta,
} as Rock<RapidObjectRendererRockConfig>;
