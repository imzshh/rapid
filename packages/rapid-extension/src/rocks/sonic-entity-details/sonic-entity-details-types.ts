import type { RockConfig, SimpleRockConfig } from "@ruiapp/move-style";
import { RapidDescriptionsItemConfig } from "../rapid-entity-descriptions/rapid-entity-descriptions-types";
import { FindEntityFindRelationEntitiesOptions } from "@ruiapp/rapid-common";
import { CSSProperties } from "react";
import { RapidEntityFormRockConfig } from "../rapid-entity-form/rapid-entity-form-types";

export interface SonicEntityDetailsConfig {
  mode?: "view" | "edit";

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
   * 标题属性的Code。如果没有设置，则会尝试使用实体模型的`displayPropertyCode`。
   */
  titlePropertyCode?: string;

  /**
   * 副标题属性的Code。
   */
  subTitlePropertyCode?: string;

  /**
   * 状态属性的Code。
   */
  statePropertyCode?: string;

  /**
   * 是否展示边框
   */
  descriptionBordered?: boolean;

  /**
   * 大小，默认为`middle`
   */
  descriptionSize?: "default" | "middle" | "small";

  /**
   * 布局模式，默认为`horizontal`
   */
  descriptionLayout?: "horizontal" | "vertical";

  /**
   * 是否显示冒号
   */
  descriptionColon?: boolean;

  /**
   * 栏数，默认为1
   */
  descriptionColumn?: number;

  /**
   * 栏数，默认为1
   * @deprecated
   */
  column?: number;

  /**
   * 自定义内容样式
   */
  descriptionLabelStyle?: CSSProperties;

  /**
   * 描述项
   */
  descriptionItems?: RapidDescriptionsItemConfig[];

  /**
   * 描述项
   * @deprecated
   */
  items?: RapidDescriptionsItemConfig[];

  /**
   * 操作项
   */
  actions?: RockConfig[];

  footer?: RockConfig[];

  /**
   * 是否隐藏头部（标题、状态、操作项等）
   */
  hideHeader?: boolean;

  /**
   * 是否显示返回按钮，默认根据浏览器历史记录自动判断
   */
  showBackButton?: boolean;

  /**
   * 当没有浏览器历史记录时，设置返回按钮的跳转链接。
   * 当设置showBackButton为true时，建议同时设置backUrl。
   */
  backUrl?: string;

  formColumn?: number;

  formItems?: RapidEntityFormRockConfig["items"];

  form?: Partial<RapidEntityFormRockConfig>;
}

export interface SonicEntityDetailsRockConfig extends SimpleRockConfig, SonicEntityDetailsConfig {}
