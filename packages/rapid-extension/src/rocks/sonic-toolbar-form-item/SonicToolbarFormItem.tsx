import type { Rock, RockEvent } from "@ruiapp/move-style";
import RapidToolbarFormItemMeta from "./SonicToolbarFormItemMeta";
import { renderRock } from "@ruiapp/react-renderer";
import type { SonicToolbarFormItemRockConfig } from "./sonic-toolbar-form-item-types";
import { RapidFormItemRockConfig } from "../rapid-form-item/rapid-form-item-types";
import { SearchFormFilterConfiguration } from "../../types/rapid-entity-types";
import { EntityStore } from "../../mod";
import { searchParamsToFilters } from "../../functions/searchParamsToFilters";
import { RapidEntityListFilterCache } from "../rapid-entity-search-form/RapidEntitySearchForm";
import { useState } from "react";

export default {
  Renderer(context, props) {
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
              let inputValue = (event.args[0] || "").trim();

              const { scope } = event;
              const dataSourceCode = props.dataSourceCode || "list";
              // 设置搜索变量
              scope.setVars({
                [props.code]: inputValue,
                [`stores-${dataSourceCode}-pageNum`]: 1,
              });

              const store = scope.stores[dataSourceCode] as EntityStore;
              // 设置过滤filters
              const filterConfigurations: SearchFormFilterConfiguration[] = [];
              filterConfigurations.push({
                code: props.code,
                filterMode: props.filterMode,
                filterFields: props.filterFields,
              });

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

              // 启用高级查询参数缓存 & 设置参数缓存
              if (props.enabledFilterCache && props.filterCacheName) {
                RapidEntityListFilterCache.remove(props.filterCacheName);
              }

              store.clearPaginationOffset();
              // 重新加载数据
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
  },

  ...RapidToolbarFormItemMeta,
} as Rock<SonicToolbarFormItemRockConfig>;
