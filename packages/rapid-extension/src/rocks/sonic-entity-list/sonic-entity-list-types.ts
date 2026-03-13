import type { RockChildrenConfig, RockEventHandlerConfig, SimpleRockConfig, StoreConfig } from "@ruiapp/move-style";
import type { RapidEntityListProps } from "../rapid-entity-list/rapid-entity-list-types";
import type { RapidEntityFormProps } from "../rapid-entity-form/rapid-entity-form-types";
import { RapidEntitySearchFormConfig } from "../rapid-entity-search-form/rapid-entity-search-form-types";
import { IRapidEntityListToolboxConfig } from "../rapid-entity-list-toolbox/RapidEntityListToolbox";

export interface SonicEntityListConfig extends RapidEntityListProps {
  newModalTitle?: string;
  newForm?: Partial<RapidEntityFormProps>;
  editModalTitle?: string;
  editForm?: Partial<RapidEntityFormProps>;
  searchForm?: Partial<RapidEntitySearchFormConfig>;
  footer?: RockChildrenConfig;
  stores?: StoreConfig[];
  toolbox?: IRapidEntityListToolboxConfig;
  hideToolbox?: boolean;
  actionSubscriptions?: SonicEntityListActionSubscriptionConfig[];
}

export interface SonicEntityListActionSubscriptionConfig {
  actionName: string;
  handlers: RockEventHandlerConfig;
}

export interface SonicEntityListRockConfig extends SimpleRockConfig, SonicEntityListConfig {}
