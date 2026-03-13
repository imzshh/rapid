import { Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import RapidMultilineTextRendererMeta from "./RapidMultilineTextRendererMeta";
import { wrapToRockComponent } from "@ruiapp/react-renderer";
import { RapidMultilineTextRendererProps, RapidMultilineTextRendererRockConfig } from "./rapid-multiline-text-renderer-types";

export function configRapidMultilineTextRenderer(config: RockComponentProps<RapidMultilineTextRendererRockConfig>): RapidMultilineTextRendererRockConfig {
  config.$type = RapidMultilineTextRendererMeta.$type;
  return config as RapidMultilineTextRendererRockConfig;
}

export function RapidMultilineTextRendererComponent(props: RockInstanceProps<RapidMultilineTextRendererProps>) {
  let { value, defaultText } = props;
  value ??= defaultText;

  return <pre>{value}</pre>;
}

export const RapidMultilineTextRenderer = wrapToRockComponent(RapidMultilineTextRendererMeta, RapidMultilineTextRendererComponent);

export default {
  Renderer: RapidMultilineTextRendererComponent,
  ...RapidMultilineTextRendererMeta,
} as Rock<RapidMultilineTextRendererRockConfig>;
