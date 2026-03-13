import { Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import { find } from "lodash";
import RapidReferenceRendererMeta from "./RapidReferenceRendererMeta";
import { RapidReferenceRendererProps, RapidReferenceRendererRockConfig } from "./rapid-reference-renderer-types";
import { wrapToRockComponent, wrapToRockRenderer } from "@ruiapp/react-renderer";

export function configRapidReferenceRenderer(config: RockComponentProps<RapidReferenceRendererRockConfig>): RapidReferenceRendererRockConfig {
  config.$type = RapidReferenceRendererMeta.$type;
  return config as RapidReferenceRendererRockConfig;
}

export function RapidReferenceRendererComponent(props: RockInstanceProps<RapidReferenceRendererProps>) {
  const { list, value, valueFieldName, textFieldName, itemRenderer } = props;

  const item = find(list, (item) => {
    return item[valueFieldName] == value;
  });
  if (!item) {
    return null;
  }

  if (itemRenderer) {
    return itemRenderer(item);
  }

  return "" + item[textFieldName];
}

export const RapidReferenceRenderer = wrapToRockComponent(RapidReferenceRendererMeta, RapidReferenceRendererComponent);

export default {
  Renderer: wrapToRockRenderer(RapidReferenceRendererMeta, RapidReferenceRendererComponent),
  ...RapidReferenceRendererMeta,
} as Rock<RapidReferenceRendererRockConfig>;
