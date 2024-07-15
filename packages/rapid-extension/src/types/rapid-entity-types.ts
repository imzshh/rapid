/**
 * 数据字典
 */
export type RapidDataDictionary = {
  /**
   * 表示仅用于描述数据字典，不在 Rapid 服务中注册
   */
  metaOnly?: boolean;

  /**
   * 字典编码
   */
  code: string;

  /**
   * 字典名称
   */
  name?: string;

  /**
   * 描述
   */
  description?: string;

  /**
   * 字典项值类型
   */
  valueType: "string" | "integer";

  /**
   * 字典级别
   */
  level: "sys" | "app" | "user";

  /**
   * 字典项
   */
  entries: RapidDataDictionaryEntry[];
};

/**
 * 数据字典项
 */
export type RapidDataDictionaryEntry = {
  /**
   * 名称
   */
  name: string;

  /**
   * 值
   */
  value: string | number;

  /**
   * 颜色
   */
  color?: string;

  /**
   * 图标
   */
  icon?: string;

  /**
   * 描述
   */
  description?: string;
};

export type RapidFieldType =
  | "text"
  | "boolean"
  | "integer"
  | "long"
  | "float"
  | "double"
  | "decimal"
  | "date"
  | "time"
  | "datetime"
  | "json"
  | "option"
  | "relation"
  | "relation[]";

export type RapidEntity<TEntitySingularCodes extends string = string, TDictionaryCodes extends string = string> = {
  /**
   * 表示仅用于描述实体，不在 Rapid 服务中注册
   */
  metaOnly?: boolean;

  /**
   * 命名空间
   */
  namespace: string;

  /**
   * 实体编码
   */
  code: string;

  /**
   * 实体名称
   */
  name: string;

  /**
   * 实体描述
   */
  description?: string;

  /**
   * 实体编码的单数形式
   */
  singularCode?: string;

  /**
   * 实体编码的复数形式
   */
  pluralCode?: string;

  /**
   * 数据库Schema
   */
  dbSchema?: string;

  /**
   * 数据表名
   */
  tableName?: string;

  /**
   * 基础实体编码的单数形式
   */
  base?: TEntitySingularCodes;

  /**
   * 扩展类型
   */
  derivedType?: string;

  /**
   * 保存扩展类型的属性编码
   */
  derivedTypePropertyCode?: string;

  /**
   * 展示实体的属性编码
   */
  displayPropertyCode?: string;

  /**
   * 实体字段
   */
  fields: RapidField<TEntitySingularCodes, TDictionaryCodes>[];

  /**
   * 权限控制策略
   */
  permissionPolicies?: RapidEntityPermissionPolicies;
};

export interface RapidEntityPermissionPolicies {
  find?: PermissionPolicy;
  create?: PermissionPolicy;
  update?: PermissionPolicy;
  delete?: PermissionPolicy;
}

export interface PermissionPolicy {
  any?: string[];
  all?: string[];
}

/**
 * 实体字段
 */
export type RapidField<TEntitySingularCodes extends string = string, TDictionaryCodes extends string = string> = {
  /**
   * 字段编码
   */
  code: string;

  /**
   * 字段名称
   */
  name: string;

  /**
   * 描述
   */
  description?: string;

  /**
   * 字段类型
   * @enum RapidFieldType
   */
  type: RapidFieldType;

  /**
   * 必需填写
   */
  required?: boolean;

  /**
   * 数据库列名
   */
  columnName?: string | null;

  /**
   * 默认值的SQL表达式表示
   */
  defaultValue?: string;

  /**
   * 属性配置。
   */
  config?: Record<string, any>;

  /**
   * 是否自增长。
   */
  autoIncrement?: boolean;

  /**
   * 数据字典编码。当类型为`option`时设置
   */
  dataDictionary?: TDictionaryCodes;

  /**
   * 关系类型。
   */
  relation?: "one" | "many";

  /**
   * 关联对象的singular code
   */
  targetSingularCode?: TEntitySingularCodes;

  /**
   * 当 relation 为 one 时，设置当前模型表中表示关联实体 id 的列名。
   * 当 relation 为 many，并且使用关联关系表保存关联信息时，设置关联关系表中表示关联实体 id 的列名。
   * 当 relation 为 many，并且不使用关联关系表保存关联信息时，关联实体 id 的列名默认为`id`，此时可以不设置 targetIdColumnName。
   */
  targetIdColumnName?: string;

  /**
   * 当 relation 为 many 时，设置目标模型表或关联关系表中表示自身实体 id 的列名。
   */
  selfIdColumnName?: string;

  /**
   * 当 relation 为 many 时，可以使用关联关系表保存关联信息，此时需要设置关联关系表的名称。
   */
  linkTableName?: string;

  /**
   * 当设置了 linkTableName 时，可以设置关联关系表所在的 Schema。
   */
  linkDbSchema?: string;

  /**
   * 最小长度
   */
  minLength?: number;

  /**
   * 最大长度
   */
  maxLength?: number;
};

export type RapidSearchFormItemFilterMode = EntityFilterRelationalOperators | "range";

export interface SearchFormFilterConfiguration {
  /**
   * 变量名
   */
  code: string;

  /**
   * 过滤模式。
   */
  filterMode: RapidSearchFormItemFilterMode;

  /**
   * 过滤应用于哪些字段，多个字段任意一个满足条件即可。默认使用表单项编码`code`作为过滤字段。
   */
  filterFields?: string[];
}

export type EntityFilterOptions =
  | FindEntityRelationalFilterOptions
  | FindEntityLogicalFilterOptions
  | FindEntityUnaryFilterOptions
  | FindEntityExistenceFilterOptions;

export interface FindEntityOptions {
  filters?: EntityFilterOptions[] | null;
  orderBy?: FindEntityOrderByOptions[] | null;
  pagination?: FindEntityPaginationOptions | null;
  properties?: string[] | Record<string, any> | null;
  relations?: Record<string, FindEntitySelectRelationOptions>;
  keepNonPropertyFields?: boolean | null;
}

export type FindEntitySelectRelationOptions =
  | true
  | {
      properties?: string[];
      relations?: Record<string, FindEntitySelectRelationOptions>;
    };

export interface FindEntityRelationalFilterOptions {
  field: string;
  operator: EntityFilterRelationalOperators;
  value: any;
}

export interface FindEntityLogicalFilterOptions {
  operator: EntityFilterLogicalOperators;
  filters: EntityFilterOptions[];
}

export interface FindEntityUnaryFilterOptions {
  field: string;
  operator: EntityFilterUnaryOperators;
}

export interface FindEntityExistenceFilterOptions {
  field: string;
  operator: EntityFilterExistenceOperators;
  filters: EntityFilterOptions[];
}

export interface FindEntityPaginationOptions {
  offset: number;
  limit: number;
  withoutTotal?: boolean;
}

export interface FindEntityOrderByOptions {
  field: string;
  desc?: boolean;
}

export interface CountEntityOptions {
  filters?: EntityFilterOptions[];
}

export type EntityFilterOperators = EntityFilterLogicalOperators | EntityFilterFieldOperators;

export type EntityFilterFieldOperators = EntityFilterRelationalOperators | EntityFilterUnaryOperators | EntityFilterExistenceOperators;

export type EntityFilterRelationalOperators =
  | "eq"
  | "ne"
  | "lt"
  | "lte"
  | "gt"
  | "gte"
  | "in"
  | "notIn"
  | "contains"
  | "notContains"
  | "containsCS"
  | "notContainsCS"
  | "startsWith"
  | "notStartsWith"
  | "endsWith"
  | "notEndsWith";

export type EntityFilterLogicalOperators = "or" | "and";

export type EntityFilterUnaryOperators = "null" | "notNull";

export type EntityFilterExistenceOperators = "exists" | "notExists";
