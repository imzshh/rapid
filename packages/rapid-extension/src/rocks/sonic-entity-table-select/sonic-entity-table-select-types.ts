import type { RockConfig } from "@ruiapp/move-style";
import { FilterFieldConfig } from "../rapid-form-item/rapid-form-item-types";
import { RapidTableSelectRockConfig } from "../rapid-table-select/rapid-table-select-types";
import { RapidTableColumnConfig } from "../rapid-table-column/rapid-table-column-types";

export const SONIC_ENTITY_TABLE_SELECT_ROCK_TYPE = "sonicEntityTableSelect" as const;

export interface SonicEntityTableSelectProps {
  searchPlaceholder?: string;
  placeholder?: string;
  allowClear?: boolean;
  disabled?: boolean;

  /**
   * 是否只读
   */
  readOnly?: boolean;
  pageSize?: number;
  mode?: "multiple" | "single";

  /**
   * 是否禁用搜索
   */
  filterDisabled?: boolean;

  /**
   * 默认 name
   */
  listFilterFields?: (string | FilterFieldConfig)[];

  /**
   * @deprecated use labelRendererType
   */
  listTextFormat?: string;
  listTextFieldName?: string; // 默认 name
  listValueFieldName?: string; // 默认 id
  columns?: RapidTableColumnConfig[];
  dropdownMatchSelectWidth?: boolean | number;
  entityCode: string;
  requestParams?: RapidTableSelectRockConfig["requestConfig"]["params"];
  value?: string | string[];
  bordered?: boolean;
  onChange?(value: string | string[]): void;
  onSelectedRecord?(record: Record<string, any> | Record<string, any>[] | null, selectedRecords: Record<string, any>[], recordMap: Record<string, any>): void;

  /**
   * 标签渲染器类型
   */
  labelRendererType?: string;

  /**
   * 标签渲染器属性
   */
  labelRendererProps?: Record<string, any>;

  /**
   * 表格高度
   */
  tableHeight?: number;
}

export type SonicEntityTableSelectRockConfig = RockConfig<SonicEntityTableSelectProps, typeof SONIC_ENTITY_TABLE_SELECT_ROCK_TYPE>;
