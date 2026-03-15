import type { RockConfig, RockEventHandlerConfig } from "@ruiapp/move-style";
import type { RapidActionBase } from "../../types/rapid-action-types";
import type { RapidFormItemType, RapidSearchFormItemConfig } from "../rapid-form-item/rapid-form-item-types";

export const SONIC_TOOLBAR_FORM_ITEM_ROCK_TYPE = "sonicToolbarFormItem" as const;

export interface SonicToolbarFormItemProps extends RapidActionBase, RapidSearchFormItemConfig {
  label?: string;
  placeholder?: string;
  formItemType: RapidFormItemType;
  formInput?: RockConfig;
  dataSourceCode?: string;
  enabledFilterCache?: boolean;
  filterCacheName?: string;
  formControlType?: string;
  formControlProps?: Record<string, any>;
  onAction?: RockEventHandlerConfig;
}

export type SonicToolbarFormItemRockConfig = RockConfig<
  Omit<SonicToolbarFormItemProps, "onAction"> & {
    onAction?: RockEventHandlerConfig;
  },
  typeof SONIC_TOOLBAR_FORM_ITEM_ROCK_TYPE
>;
