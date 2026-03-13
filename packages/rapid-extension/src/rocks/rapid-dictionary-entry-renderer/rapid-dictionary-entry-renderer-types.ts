import type { RockConfig } from "@ruiapp/move-style";
import type { RapidDataDictionaryEntry } from "@ruiapp/rapid-common";

export const RAPID_DICTIONARY_ENTRY_RENDERER_ROCK_TYPE = "rapidDictionaryEntryRenderer" as const;

export interface RapidDictionaryEntryRendererProps {
  value?: RapidDataDictionaryEntry;
}

export type RapidDictionaryEntryRendererRockConfig = RockConfig<RapidDictionaryEntryRendererProps, typeof RAPID_DICTIONARY_ENTRY_RENDERER_ROCK_TYPE>;
