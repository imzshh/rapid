import { Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import RapidOptionFieldRendererMeta from "./RapidOptionFieldRendererMeta";
import { RapidOptionFieldRendererProps, RapidOptionFieldRendererRockConfig } from "./rapid-option-field-renderer-types";
import { useRockInstanceContext, wrapToRockComponent } from "@ruiapp/react-renderer";
import { find, isArray } from "lodash";
import rapidAppDefinition from "../../rapidAppDefinition";
import { getMetaDictionaryEntryLocaleName } from "../../helpers/i18nHelper";
import { RapidDictionaryEntryRendererComponent } from "../rapid-dictionary-entry-renderer/RapidDictionaryEntryRenderer";
import { RapidArrayRenderer } from "../rapid-array-renderer/RapidArrayRenderer";
import { ReactNode } from "react";

export function configRapidOptionFieldRenderer(config: RockComponentProps<RapidOptionFieldRendererRockConfig>): RapidOptionFieldRendererRockConfig {
  config.$type = RapidOptionFieldRendererMeta.$type;
  return config as RapidOptionFieldRendererRockConfig;
}

export function RapidOptionFieldRendererComponent(props: RockInstanceProps<RapidOptionFieldRendererProps>) {
  const context = useRockInstanceContext();
  const { dictionaryCode, value, item, separator, noSeparator, listContainer, itemContainer } = props;

  if (!value) {
    return null;
  }

  if (!context) {
    return "" + value;
  }

  const { framework } = context;
  const dataDictionaries = rapidAppDefinition.getDataDictionaries();
  const dataDictionary = find(dataDictionaries, { code: dictionaryCode });

  if (!dataDictionary) {
    return "" + value;
  }

  // 查找对应的 entry/entries
  const findEntry = (val: any) => find(dataDictionary.entries, { value: val });

  // 默认的 item renderer - 使用 RapidDictionaryEntryRenderer
  const defaultItemRenderer = (itemValue: any, index: number): ReactNode => {
    let entry = findEntry(itemValue);
    if (entry) {
      entry = {
        ...entry,
        name: getMetaDictionaryEntryLocaleName(framework, dataDictionary, entry),
      };
      return <RapidDictionaryEntryRendererComponent value={entry} />;
    }
    return "" + value;
  };

  // 使用传入的 item renderer 或默认的
  const itemRenderer = item || defaultItemRenderer;

  if (isArray(value)) {
    // 数组值使用 RapidArrayRenderer
    return (
      <RapidArrayRenderer
        value={value}
        item={itemRenderer}
        separator={separator}
        noSeparator={noSeparator}
        listContainer={listContainer}
        itemContainer={itemContainer}
      />
    );
  } else {
    // 单值直接渲染
    return itemRenderer(value, 0);
  }
}

export const RapidOptionFieldRenderer = wrapToRockComponent(RapidOptionFieldRendererMeta, RapidOptionFieldRendererComponent);

export default {
  Renderer: RapidOptionFieldRendererComponent,
  ...RapidOptionFieldRendererMeta,
} as unknown as Rock<RapidOptionFieldRendererRockConfig>;
