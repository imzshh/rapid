import type { RockConfig } from "@ruiapp/move-style";
import { FindEntityFindRelationEntitiesOptions } from "@ruiapp/rapid-common";
import type { CSSProperties } from "react";
import type { RapidDescriptionsItemConfig } from "../rapid-descriptions-item/rapid-descriptions-item-types";

export type { RapidDescriptionsItemConfig } from "../rapid-descriptions-item/rapid-descriptions-item-types";

export const RAPID_ENTITY_DESCRIPTIONS_ROCK_TYPE = "rapidEntityDescriptions" as const;

export interface RapidEntityDescriptionsProps {
  entityCode: string;

  entityId?: string;

  dataSource?: any;

  /**
   * 数据源编号
   */
  dataSourceCode?: string | null;

  /**
   * 指定数据查询的属性。如果指定了`queryProperties`，则不会自动从`items`和`extraProperties`中提取查询属性。
   */
  queryProperties?: string[];

  /**
   * 数据查询时需要查询的额外属性。
   */
  extraProperties?: string[];

  /**
   * 查询关联对象的设置
   */
  relations?: Record<string, FindEntityFindRelationEntitiesOptions>;

  keepNonPropertyFields?: boolean;

  /**
   * 是否展示边框
   */
  bordered?: boolean;

  /**
   * 大小，默认为`middle`
   */
  size?: "default" | "middle" | "small";

  /**
   * 布局模式，默认为`horizontal`
   */
  layout?: "horizontal" | "vertical";

  /**
   * 是否显示冒号
   */
  colon?: boolean;

  /**
   * 栏数，默认为1
   */
  column?: number;

  /**
   * 自定义内容样式
   */
  labelStyle?: CSSProperties;

  /**
   * 表单项
   */
  items: RapidDescriptionsItemConfig[];
}

export type RapidEntityDescriptionsRockConfig = RockConfig<RapidEntityDescriptionsProps, typeof RAPID_ENTITY_DESCRIPTIONS_ROCK_TYPE>;
