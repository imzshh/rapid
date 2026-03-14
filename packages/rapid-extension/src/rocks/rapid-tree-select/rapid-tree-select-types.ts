import type { RockConfig, RockEventHandlerConfig } from "@ruiapp/move-style";

export const RAPID_TREE_SELECT_ROCK_TYPE = "rapidTreeSelect" as const;

/**
 * 下拉树选择组件
 */
export interface RapidTreeSelectProps {
  /**
   * 是否支持清除
   */
  allowClear?: boolean;

  placeholder?: string;

  size?: "large" | "middle" | "small";

  mode?: "multiple";

  /**
   * 是否禁用
   */
  disabled?: boolean;

  value?: any;

  valueFieldName?: string;

  /**
   * 下拉列表的数据源编号
   */
  listDataSourceCode?: string;

  listDataSource?: {
    data?: {
      list: Record<string, any>[];
    };
  };

  /**
   * 树节点中表示值的字段名。默认为`id`。
   */
  treeNodeValueFieldName?: string;

  /**
   * 树节点中作为文本展示的字段名。默认为`name`。
   */
  treeNodeLabelFieldName?: string;

  /**
   * 文本展示的格式字符串。如果设置了此项，则忽略`listTextFieldName`设置。
   */
  treeNodeLabelFormat?: string;

  /**
   * 表示列表能否搜索
   */
  listSearchable?: boolean;

  /**
   * 搜索时匹配哪些字段
   */
  listFilterFields?: string[];

  /**
   * 列表中的上级字段名。通常为`parent.id`或者`parentId`等。
   */
  listParentField?: string;

  listIdField?: string;
  treeChildrenField?: string;
  treeTopParentValue?: string | number;

  onChange?: (value: any, label: any, extra: any) => void;
}

export type RapidTreeSelectRockConfig = RockConfig<
  Omit<RapidTreeSelectProps, "onChange"> & {
    onChange?: RockEventHandlerConfig;
  },
  typeof RAPID_TREE_SELECT_ROCK_TYPE
>;
