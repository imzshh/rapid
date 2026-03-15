import type { Rock, RockComponentProps, RockEvent, RockInstanceProps } from "@ruiapp/move-style";
import { renderRock, useRockInstanceContext, wrapToRockComponent } from "@ruiapp/react-renderer";
import SonicToolbarFormItemMeta from "./SonicToolbarFormItemMeta";
import type { SonicToolbarFormItemProps, SonicToolbarFormItemRockConfig } from "./sonic-toolbar-form-item-types";
import type { RapidFormItemRockConfig } from "../rapid-form-item/rapid-form-item-types";
import type { SearchFormFilterConfiguration } from "~/types/rapid-search-form-types";
import type { EntityStore } from "../../mod";
import { searchParamsToFilters } from "../../functions/searchParamsToFilters";
import { RapidEntityListFilterCache } from "../rapid-entity-search-form/RapidEntitySearchForm";

export function configSonicToolbarFormItem(config: RockComponentProps<SonicToolbarFormItemRockConfig>): SonicToolbarFormItemRockConfig {
  config.$type = SonicToolbarFormItemMeta.$type;
  return config as SonicToolbarFormItemRockConfig;
}

export function SonicToolbarFormItemComponent(props: RockInstanceProps<SonicToolbarFormItemProps>) {
  const context = useRockInstanceContext();
  const actionEventName = props.actionEventName || "onClick";

  const rockConfig: RapidFormItemRockConfig = {
    $type: "rapidFormItem",
    code: props.code,
    type: props.formItemType,
    label: props.label,
    placeholder: props.placeholder,
    filterMode: props.filterMode,
    filterFields: props.filterFields,
    formControlType: props.formControlType,
    formControlProps: {
      ...props.formControlProps,
      [actionEventName]: [
        {
          $action: "script",
          script: (event: RockEvent) => {
            const inputValue = (event.args[0] || "").trim();

            const { scope } = event;
            const dataSourceCode = props.dataSourceCode || "list";
            scope.setVars({
              [props.code]: inputValue,
              [`stores-${dataSourceCode}-pageNum`]: 1,
            });

            const store = scope.stores[dataSourceCode] as EntityStore;
            const filterConfigurations: SearchFormFilterConfiguration[] = [
              {
                code: props.code,
                filterMode: props.filterMode,
                filterFields: props.filterFields,
              },
            ];

            const filters = searchParamsToFilters(filterConfigurations, scope.vars);
            store.updateConfig({
              filters: filters.length
                ? [
                    {
                      operator: "or",
                      filters,
                    },
                  ]
                : filters,
            });

            if (props.enabledFilterCache && props.filterCacheName) {
              RapidEntityListFilterCache.remove(props.filterCacheName);
            }

            store.clearPaginationOffset();
            store.loadData();
          },
        },
      ],
    },
  };

  if (props.onAction) {
    rockConfig[actionEventName] = props.onAction;
  }

  return renderRock({ context, rockConfig });
}

export const SonicToolbarFormItem = wrapToRockComponent(SonicToolbarFormItemMeta, SonicToolbarFormItemComponent);

export default {
  Renderer: SonicToolbarFormItemComponent,
  ...SonicToolbarFormItemMeta,
} as Rock<SonicToolbarFormItemRockConfig>;
