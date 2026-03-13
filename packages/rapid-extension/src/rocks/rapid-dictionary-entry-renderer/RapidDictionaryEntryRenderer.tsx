import { Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import RapidDictionaryEntryRendererMeta from "./RapidDictionaryEntryRendererMeta";
import { RapidDictionaryEntryRendererProps, RapidDictionaryEntryRendererRockConfig } from "./rapid-dictionary-entry-renderer-types";
import { wrapToRockComponent } from "@ruiapp/react-renderer";
import { Tag } from "antd";

export function configRapidDictionaryEntryRenderer(config: RockComponentProps<RapidDictionaryEntryRendererRockConfig>): RapidDictionaryEntryRendererRockConfig {
  config.$type = RapidDictionaryEntryRendererMeta.$type;
  return config as RapidDictionaryEntryRendererRockConfig;
}

export function RapidDictionaryEntryRendererComponent(props: RapidDictionaryEntryRendererProps) {
  const { value } = props;

  if (!value) {
    return null;
  }

  return <Tag color={value.color}>{value.name}</Tag>;
}

export const RapidDictionaryEntryRenderer = wrapToRockComponent(RapidDictionaryEntryRendererMeta, RapidDictionaryEntryRendererComponent);

export default {
  Renderer: RapidDictionaryEntryRendererComponent,
  ...RapidDictionaryEntryRendererMeta,
} as Rock<RapidDictionaryEntryRendererRockConfig>;
