import type { RockConfig, RockExpsConfig, RockI18nConfig, RockLocalesConfig } from "@ruiapp/move-style";
import { FindEntityFindRelationEntitiesOptions, RapidFieldType } from "@ruiapp/rapid-common";
import { CSSProperties } from "react";
import { RapidPropertyDisplayType } from "~/types/rapid-extension-types";

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

/**
 * 描述项
 */
export type RapidDescriptionsItemConfig = {
  /**
   * 描述项类型
   */
  type?: RapidPropertyDisplayType;

  /**
   * 值的类型
   */
  valueFieldType?: RapidFieldType;

  /**
   * 获取value的字段名，默认为code。
   * 例如record为`{"name": "do sth.", "project": {"id":23, name: "RUI"}}`，此时设置`code`为`project`，`fieldName`为`project.name`，单元格将展示`RUI`。
   */
  valueFieldName?: string;

  /**
   * 多个值
   */
  multipleValues?: boolean;

  /**
   * 表单项编码
   */
  code: string;

  uniqueKey?: string;

  /**
   * 表单项标签文字
   */
  label?: string;

  /**
   * 自定义标签样式
   */
  labelStyle?: CSSProperties;

  /**
   * 自定义内容样式
   */
  contentStyle?: CSSProperties;

  /**
   * 栏数，默认为1
   */
  column?: number;

  /**
   * 属性值
   */
  value?: any;

  /**
   * 占位文字
   */
  placeholder?: string;

  /**
   * 默认值
   */
  defaultValue?: any;

  /**
   * 展示值的渲染器类型
   */
  rendererType?: string;

  /**
   * 展示值的渲染器属性
   */
  rendererProps?: Record<string, any>;

  /**
   * 是否隐藏。作用同`_hidden`。
   */
  hidden?: boolean;

  $exps?: RockExpsConfig;
  $i18n?: RockI18nConfig;
  $locales?: RockLocalesConfig;
};

export type RapidEntityDescriptionsRockConfig = RockConfig<RapidEntityDescriptionsProps, typeof RAPID_ENTITY_DESCRIPTIONS_ROCK_TYPE>;
