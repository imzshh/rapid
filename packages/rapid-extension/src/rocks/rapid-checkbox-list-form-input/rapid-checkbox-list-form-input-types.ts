import type { RockConfig, RockEventHandlerConfig } from "@ruiapp/move-style";
import { CSSProperties } from "react";

export const RAPID_CHECKBOX_LIST_FORM_INPUT_ROCK_TYPE = "rapidCheckboxListFormInput" as const;

export interface RapidCheckboxListFormInputProps {
  /**
   * 是否禁用
   */
  disabled?: boolean;

  /**
   * 值
   */
  value?: any;

  /**
   * 值变更回调
   */
  onChange?: (checkedValues: (string | number | boolean)[]) => void;

  /**
   * 值的字段名
   */
  valueFieldName?: string;

  /**
   * 列表
   */
  listItems?: Record<string, any>[];

  /**
   * 列表的数据源
   */
  listDataSource?: {
    data?: {
      list: Record<string, any>[];
    };
  };

  /**
   * 列表的数据源编号
   */
  listDataSourceCode?: string;

  /**
   * 列表数据中表示值的字段名。默认为`id`。
   */
  listValueFieldName?: string;

  /**
   * 列表数据中作为文本展示的字段名。默认为`name`。
   */
  listTextFieldName?: string;

  /**
   * 文本展示的格式字符串。如果设置了此项，则忽略`listTextFieldName`设置。
   */
  listTextFormat?: string;

  /**
   * 列表数据中表示是否禁用的字段名。默认为`disabled`。
   */
  listDisabledFieldName?: string;

  /**
   * 用于分组的字段名。
   */
  groupByFieldName?: string;

  /**
   * 分组
   */
  groupItems?: Record<string, any>[];

  /**
   * 分组的数据源
   */
  groupDataSource?: {
    data?: {
      list: Record<string, any>[];
    };
  };

  /**
   * 分组数据源编号
   */
  groupDataSourceCode?: string;

  /**
   * @deprecated
   * 分组的数据源
   */
  groupsDataSource?: {
    data?: {
      list: Record<string, any>[];
    };
  };

  /**
   * @deprecated
   * 分组数据源编号
   */
  groupsDataSourceCode?: string;

  /**
   * 分组数据中表示值的字段名。默认为`id`。
   */
  groupValueFieldName?: string;

  /**
   * 分组数据中作为文本展示的字段名。默认为`name`。
   */
  groupTextFieldName?: string;

  /**
   * 分组的 className
   */
  groupClassName?: string;

  /**
   * 分组的样式
   */
  groupStyle?: CSSProperties;

  /**
   * 分组标题的 className
   */
  groupTitleClassName?: string;

  /**
   * 分组标题的样式
   */
  groupTitleStyle?: CSSProperties;

  /**
   * 复选框列表的 className
   */
  itemListClassName?: string;

  /**
   * 复选框列表的样式
   */
  itemListStyle?: CSSProperties;

  /**
   * 复选框的排列方向
   */
  direction?: "horizontal" | "vertical";
}

export type RapidCheckboxListFormInputRockConfig = RockConfig<
  Omit<RapidCheckboxListFormInputProps, "onChange"> & {
    onChange?: RockEventHandlerConfig;
  },
  typeof RAPID_CHECKBOX_LIST_FORM_INPUT_ROCK_TYPE
>;
