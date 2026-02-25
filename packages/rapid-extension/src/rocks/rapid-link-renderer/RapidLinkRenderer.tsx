import { MoveStyleUtils, Rock } from "@ruiapp/move-style";
import RapidLinkRendererMeta from "./RapidLinkRendererMeta";
import { RapidLinkRendererProps, RapidLinkRendererRockConfig } from "./rapid-link-renderer-types";
import { genRockRenderer } from "@ruiapp/react-renderer";
import { isString } from "lodash";

export function configRapidLinkRenderer(config: RapidLinkRendererRockConfig): RapidLinkRendererRockConfig {
  return config;
}

export function RapidLinkRenderer(props: RapidLinkRendererProps) {
  const { value, text, url, defaultText } = props;

  if (!value) {
    return defaultText || "";
  }

  const href = MoveStyleUtils.fulfillVariablesInString(url, value);
  const displayText = isString(text) ? MoveStyleUtils.fulfillVariablesInString(text, value) : href;

  return <a href={href}>{displayText}</a>;
}

export default {
  Renderer: genRockRenderer(RapidLinkRendererMeta.$type, RapidLinkRenderer),
  ...RapidLinkRendererMeta,
} as Rock<RapidLinkRendererRockConfig>;
