import type { ContainerRockConfig, RockEventHandlerConfig } from "@ruiapp/move-style";
import { RapidFormConfig } from "../rapid-form/rapid-form-types";
import { RapidFormItemConfig, RapidSearchFormItemConfig } from "../rapid-form-item/rapid-form-item-types";

export interface RapidEntitySearchFormConfig extends RapidFormConfig {
  entityCode: string;

  /**
   * 表单项
   */
  items: RapidEntitySearchFormItemConfig[];

  onFormSubmit?: RockEventHandlerConfig;

  onFormRefresh?: RockEventHandlerConfig;

  onValuesChange?: RockEventHandlerConfig;
}

export interface RapidEntitySearchFormRockConfig extends ContainerRockConfig, RapidEntitySearchFormConfig {}

export interface RapidEntitySearchFormItemConfig extends RapidFormItemConfig, RapidSearchFormItemConfig {}
