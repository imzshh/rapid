import { MoveStyleUtils, Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import RapidLinkRendererMeta from "./RapidLinkRendererMeta";
import { RapidLinkRendererProps, RapidLinkRendererRockConfig } from "./rapid-link-renderer-types";
import { wrapToRockComponent } from "@ruiapp/react-renderer";
import { isString } from "lodash";

export function configRapidLinkRenderer(config: RockComponentProps<RapidLinkRendererRockConfig>): RapidLinkRendererRockConfig {
  config.$type = RapidLinkRendererMeta.$type;
  return config as RapidLinkRendererRockConfig;
}

export function RapidLinkRendererComponent(props: RockInstanceProps<RapidLinkRendererProps>) {
  const { value, text, url, defaultText } = props;

  if (!value) {
    return defaultText || "";
  }

  const href = MoveStyleUtils.fulfillVariablesInString(url, value);
  const displayText = isString(text) ? MoveStyleUtils.fulfillVariablesInString(text, value) : href;

  return <a href={href}>{displayText}</a>;
}

export const RapidLinkRenderer = wrapToRockComponent(RapidLinkRendererMeta, RapidLinkRendererComponent);

export default {
  Renderer: RapidLinkRendererComponent,
  ...RapidLinkRendererMeta,
} as Rock<RapidLinkRendererRockConfig>;
