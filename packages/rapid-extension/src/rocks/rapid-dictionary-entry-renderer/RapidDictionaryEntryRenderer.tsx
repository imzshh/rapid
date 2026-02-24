import { Rock } from "@ruiapp/move-style";
import RapidDictionaryEntryRendererMeta from "./RapidDictionaryEntryRendererMeta";
import { RapidDictionaryEntryRendererProps, RapidDictionaryEntryRendererRockConfig } from "./rapid-dictionary-entry-renderer-types";
import { genRockRenderer } from "@ruiapp/react-renderer";
import { Tag } from "antd";

export function configRapidDictionaryEntryRenderer(config: RapidDictionaryEntryRendererRockConfig): RapidDictionaryEntryRendererRockConfig {
  return config;
}

export function RapidDictionaryEntryRenderer(props: RapidDictionaryEntryRendererProps) {
  const { value } = props;

  if (!value) {
    return null;
  }

  return <Tag color={value.color}>{value.name}</Tag>;
}

export default {
  Renderer: genRockRenderer(RapidDictionaryEntryRendererMeta.$type, RapidDictionaryEntryRenderer),

  ...RapidDictionaryEntryRendererMeta,
} as Rock<RapidDictionaryEntryRendererRockConfig>;
