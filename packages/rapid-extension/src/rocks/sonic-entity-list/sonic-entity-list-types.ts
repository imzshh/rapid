import type { RockChildrenConfig, SimpleRockConfig, StoreConfig } from "@ruiapp/move-style";
import type { RapidEntityListConfig } from "../rapid-entity-list/rapid-entity-list-types";
import type { RapidEntityFormConfig } from "../rapid-entity-form/rapid-entity-form-types";
import { RapidEntitySearchFormConfig } from "../rapid-entity-search-form/rapid-entity-search-form-types";
import { IRapidEntityListToolboxConfig } from "../rapid-entity-list-toolbox/RapidEntityListToolbox";

export interface SonicEntityListConfig extends RapidEntityListConfig {
  newForm?: Partial<RapidEntityFormConfig>;
  editForm?: Partial<RapidEntityFormConfig>;
  searchForm?: Partial<RapidEntitySearchFormConfig>;
  footer?: RockChildrenConfig;
  stores?: StoreConfig[];
  toolbox?: IRapidEntityListToolboxConfig;
}

export interface SonicEntityListRockConfig extends SimpleRockConfig, SonicEntityListConfig {}
