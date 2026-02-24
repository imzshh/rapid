import { Rock } from "@ruiapp/move-style";
import RapidJsonRendererMeta from "./RapidJsonRendererMeta";
import { RapidJsonRendererProps, RapidJsonRendererRockConfig } from "./rapid-json-renderer-types";

export function configRapidJsonRenderer(config: RapidJsonRendererRockConfig): RapidJsonRendererRockConfig {
  return config;
}

export function RapidJsonRenderer(props: RapidJsonRendererProps) {
  const { value, defaultText } = props;
  if (value) {
    return <pre>{JSON.stringify(value, null, 2)}</pre>;
  } else {
    return defaultText || "";
  }
}

export default {
  $type: "rapidJsonRenderer",

  Renderer(context, props: RapidJsonRendererRockConfig) {
    return RapidJsonRenderer(props);
  },

  ...RapidJsonRendererMeta,
} as Rock<RapidJsonRendererRockConfig>;
