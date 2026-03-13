import { Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import RapidJsonRendererMeta from "./RapidJsonRendererMeta";
import { RapidJsonRendererProps, RapidJsonRendererRockConfig } from "./rapid-json-renderer-types";
import { wrapToRockComponent } from "@ruiapp/react-renderer";

export function configRapidJsonRenderer(config: RockComponentProps<RapidJsonRendererRockConfig>): RapidJsonRendererRockConfig {
  config.$type = RapidJsonRendererMeta.$type;
  return config as RapidJsonRendererRockConfig;
}

export function RapidJsonRendererComponent(props: RockInstanceProps<RapidJsonRendererProps>) {
  const { value, defaultText } = props;

  if (value) {
    return <pre>{JSON.stringify(value, null, 2)}</pre>;
  }

  return defaultText || "";
}

export const RapidJsonRenderer = wrapToRockComponent(RapidJsonRendererMeta, RapidJsonRendererComponent);

export default {
  Renderer: RapidJsonRendererComponent,
  ...RapidJsonRendererMeta,
} as Rock<RapidJsonRendererRockConfig>;
