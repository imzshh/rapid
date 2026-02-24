import { RockConfig, SimpleRockConfig } from "@ruiapp/move-style";
import { RapidDataDictionaryEntry } from "@ruiapp/rapid-common";

export interface RapidDictionaryEntryRendererProps {
  value?: RapidDataDictionaryEntry;
}

export interface RapidDictionaryEntryRendererRockConfig extends SimpleRockConfig, RapidDictionaryEntryRendererProps {}
