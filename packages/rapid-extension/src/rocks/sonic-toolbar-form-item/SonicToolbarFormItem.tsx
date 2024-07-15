import type { IStore, Rock, RockEvent } from "@ruiapp/move-style";
import RapidToolbarFormItemMeta from "./SonicToolbarFormItemMeta";
import { renderRock } from "@ruiapp/react-renderer";
import type { SonicToolbarFormItemRockConfig } from "./sonic-toolbar-form-item-types";
import { RapidFormItemRockConfig } from "../rapid-form-item/rapid-form-item-types";
import { SearchFormFilterConfiguration } from "../../types/rapid-entity-types";
import { EntityStore } from "../../mod";
import { searchParamsToFilters } from "../../functions/searchParamsToFilters";

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
              const { scope } = event;
              const dataSourceCode = props.dataSourceCode || "list";
              // 设置搜索变量
              scope.setVars({
                [props.code]: event.args[0],
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
              store.updateConfig({
                filters: searchParamsToFilters(filterConfigurations, scope.vars),
              });
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
