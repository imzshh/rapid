import type { ReactNode } from "react";
import type { RockConfig, RockI18nConfig, RockLocalesConfig, RockPropExpressions } from "@ruiapp/move-style";
import { FindEntityOptions, RapidFieldType, RapidSearchFormItemFilterMode } from "../../rapid-types";
import { FormItemProps } from "antd";

export const RAPID_FORM_ITEM_ROCK_TYPE = "rapidFormItem" as const;

/**
 * 表单项
 */
export interface RapidFormItemProps {
  /**
   * 表单项类型
   */
  type?: RapidFormItemType;

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

  /**
   * 是否隐藏字段（依然会收集和校验字段）
   */
  hidden?: boolean;

  /**
   * 表单项标签文字
   */
  label?: string;

  /**
   * 栏数，默认为1
   */
  column?: number;

  /**
   * 模式。`input`表示输入，`display`表示展示模式。默认为`input`。
   */
  mode?: "input" | "display";

  /**
   * 是否必须选择或填写
   */
  required?: boolean;

  /**
   * 占位文字
   */
  placeholder?: string;

  /**
   * 默认值
   */
  defaultValue?: any;

  /**
   * 表单校验规则
   */
  rules?: FormItemProps["rules"];

  /**
   * 查询列表数据的选项
   */
  listDataFindOptions?: FindEntityOptions & {
    fixedFilters?: FindEntityOptions["filters"];

    $exps?: RockPropExpressions;
  };

  /**
   * 表单项控件类型
   */
  formControlType?: string;

  /**
   * 表单控件属性
   */
  formControlProps?: Record<string, any>;

  formControlValuePropName?: string;

  /**
   * 展示值的渲染器类型
   */
  rendererType?: string;

  /**
   * 展示值的渲染器属性
   */
  rendererProps?: Record<string, any>;

  rendererValuePropName?: string;

  /**
   * 表单项唯一性字段
   */
  uniqueKey?: string;

  /**
   * 表单实例
   */
  form?: any;

  labelCol?: { span?: number; offset?: number; flex?: string | number };
  wrapperCol?: { span?: number; offset?: number; flex?: string | number };

  /**
   * 标签对齐方式
   */
  labelAlign?: "left" | "right";

  /**
   * 额外的提示信息
   */
  extra?: ReactNode;

  /**
   * 配置提示信息
   */
  tooltip?: ReactNode;

  /**
   * 依赖form字段, 依赖字段变更触发表单项reload store
   */
  storeDependencies?: string[];
  $exps?: RockPropExpressions;

  $i18n?: RockI18nConfig;

  $locales?: RockLocalesConfig;
}

export interface FilterFieldConfig {
  field: string;
  operator: string;
  filters?: FilterFieldConfig[];
  itemType?: string;
  extra?: {
    /**
     * 时间过滤开始、结束区间的单位
     */
    rangeUnit?: "year" | "month" | "quarter" | "week" | "day" | "hour" | "minute" | "second";
  };
}

/**
 * 搜索表单项
 */
export type RapidSearchFormItemConfig = {
  /**
   * 过滤模式。
   */
  filterMode?: RapidSearchFormItemFilterMode;

  /**
   * 过滤应用于哪些字段，多个字段任意一个满足条件即可。默认使用表单项编码`code`作为过滤字段。
   */
  filterFields?: (string | FilterFieldConfig)[];

  /**
   * 请求参数值类型
   */
  itemType?: string;

  /**
   * 过滤项额外配置
   */
  filterExtra?: FilterFieldConfig["extra"];

  /**
   * 查询配置项，该配置会覆盖 filterMode + filterFields + filterExtra + itemType
   */
  filters?: FilterFieldConfig[];
};

export type RapidFormItemConfig = RapidFormItemProps;

export type RapidFormItemType =
  | "auto"
  | "box"
  | "text"
  | "textarea"
  | "richText"
  | "password"
  | "number"
  | "switch"
  | "checkbox"
  | "checkboxList"
  | "radioList"
  | "date"
  | "month"
  | "time"
  | "datetime"
  | "dateRange"
  | "dateTimeRange"
  | "select"
  | "treeSelect"
  | "tableSelect"
  | "entityTableSelect"
  | "search"
  | "json"
  | "file"
  | "fileList"
  | "image"
  | "imageList"
  | "custom";

export type RapidFormItemRockConfig = RockConfig<RapidFormItemProps, typeof RAPID_FORM_ITEM_ROCK_TYPE>;
