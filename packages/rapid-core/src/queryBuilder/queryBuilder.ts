import { find } from "lodash";
import {
  RpdDataModel,
  RpdDataModelProperty,
  CreateEntityOptions,
  QuoteTableOptions,
  DatabaseQuery,
} from "../types";
import {
  CountRowOptions,
  DeleteRowOptions,
  FindRowLogicalFilterOptions,
  FindRowRelationalFilterOptions,
  FindRowSetFilterOptions,
  FindRowUnaryFilterOptions,
  FindRowOptions,
  RowFilterOptions,
  RowFilterRelationalOperators,
  UpdateRowOptions,
  ColumnQueryOptions,
} from "~/dataAccess/dataAccessTypes";

const objLeftQuoteChar = '"';
const objRightQuoteChar = '"';

const relationalOperatorsMap = new Map<RowFilterRelationalOperators, string>([
  ["eq", "="],
  ["ne", "<>"],
  ["gt", ">"],
  ["gte", ">="],
  ["lt", "<"],
  ["lte", "<="],
]);

export interface BuildQueryContext {
  builder: QueryBuilder;
  params: any[];
  emitTableAlias: boolean;
}

export interface InitQueryBuilderOptions {
  dbDefaultSchema: string;
}

export default class QueryBuilder {
  #dbDefaultSchema: string;

  constructor(options: InitQueryBuilderOptions) {
    this.#dbDefaultSchema = options.dbDefaultSchema;
  }

  quoteTable(options: QuoteTableOptions) {
    const { schema, tableName } = options;
    if (schema) {
      return `${this.quoteObject(schema)}.${this.quoteObject(tableName)}`;
    } else if (this.#dbDefaultSchema) {
      return `${this.quoteObject(this.#dbDefaultSchema)}.${this.quoteObject(tableName)}`;
    } else {
      return this.quoteObject(tableName);
    }
  }

  quoteObject(name: string) {
    return `${objLeftQuoteChar}${name}${objRightQuoteChar}`;
  }

  quoteColumn(column: ColumnQueryOptions, emitTableAlias: boolean) {
    if (typeof column === "string") {
      return `${objLeftQuoteChar}${column}${objRightQuoteChar}`;
    } else if (emitTableAlias && column.tableName) {
      return `${objLeftQuoteChar}${column.tableName}${objRightQuoteChar}.${objLeftQuoteChar}${column.name}${objRightQuoteChar}`;
    } else {
      return `${objLeftQuoteChar}${column.name}${objRightQuoteChar}`;
    }
  }

  select(model: RpdDataModel, options: FindRowOptions): DatabaseQuery {
    const ctx: BuildQueryContext = {
      builder: this,
      params: [],
      emitTableAlias: false,
    };
    let { fields: columns, filters, orderBy, pagination } = options;
    let command = "SELECT ";
    if (!columns || !columns.length) {
      command += "* FROM ";
    } else {
      command += columns.map((column) => this.quoteColumn(column, ctx.emitTableAlias)).join(", ");
      command += " FROM ";
    }

    command += this.quoteTable(model);

    if (filters && filters.length) {
      command += " WHERE ";
      command += buildFiltersQuery(ctx, filters);
    }

    if (orderBy && orderBy.length) {
      command += " ORDER BY ";
      command += orderBy
        .map((item) => {
          const quotedName = this.quoteColumn(item.field,  ctx.emitTableAlias);
          return item.desc ? quotedName + " DESC" : quotedName;
        })
        .join(", ");
    }

    if (pagination) {
      command += " OFFSET ";
      ctx.params.push(pagination.offset);
      command += "$" + ctx.params.length;

      command += " LIMIT ";
      ctx.params.push(pagination.limit);
      command += "$" + ctx.params.length;
    }

    return {
      command,
      params: ctx.params,
    };
  }

  selectDerived(derivedModel: RpdDataModel, baseModel: RpdDataModel, options: FindRowOptions): DatabaseQuery {
    const ctx: BuildQueryContext = {
      builder: this,
      params: [],
      emitTableAlias: true,
    };
    let { fields: columns, filters, orderBy, pagination } = options;
    let command = "SELECT ";
    if (!columns || !columns.length) {
      command += `${this.quoteObject(derivedModel.tableName)}.* FROM `;
    } else {
      command += columns.map((column) => {
        return this.quoteColumn(column, ctx.emitTableAlias);
      }).join(", ");
      command += " FROM ";
    }

    command += `${this.quoteTable(derivedModel)} LEFT JOIN ${this.quoteTable(baseModel)} ON ${this.quoteObject(derivedModel.tableName)}.id = ${this.quoteObject(baseModel.tableName)}.id`;

    if (filters && filters.length) {
      command += " WHERE ";
      command += buildFiltersQuery(ctx, filters);
    }

    if (orderBy && orderBy.length) {
      command += " ORDER BY ";
      command += orderBy
        .map((item) => {
          const quotedName = this.quoteColumn(item.field, ctx.emitTableAlias);
          return item.desc ? quotedName + " DESC" : quotedName;
        })
        .join(", ");
    }

    if (pagination) {
      command += " OFFSET ";
      ctx.params.push(pagination.offset);
      command += "$" + ctx.params.length;

      command += " LIMIT ";
      ctx.params.push(pagination.limit);
      command += "$" + ctx.params.length;
    }

    return {
      command,
      params: ctx.params,
    };
  }

  count(model: RpdDataModel, options: CountRowOptions): DatabaseQuery {
    const ctx: BuildQueryContext = {
      builder: this,
      params: [],
      emitTableAlias: false,
    };
    let { filters } = options;
    let command = 'SELECT COUNT(*)::int as "count" FROM ';

    command += this.quoteTable(model);

    if (filters && filters.length) {
      command += " WHERE ";
      command += buildFiltersQuery(ctx, filters);
    }

    return {
      command,
      params: ctx.params,
    };
  }

  countDerived(derivedModel: RpdDataModel, baseModel: RpdDataModel, options: CountRowOptions): DatabaseQuery {
    const ctx: BuildQueryContext = {
      builder: this,
      params: [],
      emitTableAlias: true,
    };
    let { filters } = options;
    let command = 'SELECT COUNT(*)::int as "count" FROM ';

    command += `${this.quoteTable(derivedModel)} LEFT JOIN ${this.quoteTable(baseModel)} ON ${this.quoteObject(derivedModel.tableName)}.id = ${this.quoteObject(baseModel.tableName)}.id`;

    if (filters && filters.length) {
      command += " WHERE ";
      command += buildFiltersQuery(ctx, filters);
    }

    return {
      command,
      params: ctx.params,
    };
  }

  insert(model: RpdDataModel, options: CreateEntityOptions): DatabaseQuery {
    const params: any[] = [];
    const ctx: BuildQueryContext = {
      builder: this,
      params,
      emitTableAlias: false,
    };
    const { entity } = options;
    let command = "INSERT INTO ";

    command += this.quoteTable(model);

    const propertyNames: string[] = Object.keys(entity);
    let values = "";
    propertyNames.forEach((propertyName, index) => {
      if (index) {
        values += ", ";
      }

      let property: RpdDataModelProperty | null = null;
      if (model) {
        property = find(model.properties, (e: RpdDataModelProperty) => e.code === propertyName);
      }

      if (property && property.type === "json") {
        params.push(JSON.stringify(entity[propertyName]));
        values += `$${params.length}::jsonb`;
      } else {
        params.push(entity[propertyName]);
        values += `$${params.length}`;
      }
    });

    command += ` (${propertyNames.map(this.quoteObject).join(", ")})`;
    command += ` VALUES (${values}) RETURNING *`;

    return {
      command,
      params: ctx.params,
    };
  }

  update(model: RpdDataModel, options: UpdateRowOptions): DatabaseQuery {
    const params: any[] = [];
    const ctx: BuildQueryContext = {
      builder: this,
      params,
      emitTableAlias: false,
    };
    let { entity, filters } = options;
    let command = "UPDATE ";

    command += this.quoteTable(model);

    command += " SET ";
    const propertyNames: string[] = Object.keys(entity);
    propertyNames.forEach((propertyName, index) => {
      if (index) {
        command += ", ";
      }

      let property: RpdDataModelProperty | null = null;
      if (model) {
        property = find(model.properties, (e: RpdDataModelProperty) => (e.columnName || e.code) === propertyName);
      }

      if (property && property.type === "json") {
        params.push(JSON.stringify(entity[propertyName]));
        command += `${this.quoteObject(propertyName)}=$${params.length}::jsonb`;
      } else {
        params.push(entity[propertyName]);
        command += `${this.quoteObject(propertyName)}=$${params.length}`;
      }
    });

    if (filters && filters.length) {
      command += " WHERE ";
      command += buildFiltersQuery(ctx, filters);
    }

    command += " RETURNING *";

    return {
      command,
      params: ctx.params,
    };
  }

  delete(model: RpdDataModel, options: DeleteRowOptions): DatabaseQuery {
    const params: any[] = [];
    const ctx: BuildQueryContext = {
      builder: this,
      params,
      emitTableAlias: false,
    };
    let { filters } = options;
    let command = "DELETE FROM ";

    command += this.quoteTable(model);

    if (filters && filters.length) {
      command += " WHERE ";
      command += buildFiltersQuery(ctx, filters);
    }

    return {
      command,
      params: ctx.params,
    };
  }
}

export function buildFiltersQuery(ctx: BuildQueryContext, filters: RowFilterOptions[]) {
  return buildFilterQuery(0, ctx, {
    operator: "and",
    filters,
  });
}

function buildFilterQuery(level: number, ctx: BuildQueryContext, filter: RowFilterOptions): string {
  const { operator } = filter;
  if (operator === "eq" || operator === "ne" || operator === "gt" || operator === "gte" || operator === "lt" || operator === "lte") {
    return buildRelationalFilterQuery(ctx, filter);
  } else if (operator === "and" || operator === "or") {
    return buildLogicalFilterQuery(level, ctx, filter);
  } else if (operator === "null" || operator === "notNull") {
    return buildUnaryFilterQuery(ctx, filter);
  } else if (operator === "in" || operator === "notIn") {
    return buildInFilterQuery(ctx, filter);
  } else if (operator === "contains") {
    return buildContainsFilterQuery(ctx, filter);
  } else if (operator === "notContains") {
    return buildNotContainsFilterQuery(ctx, filter);
  } else if (operator === "startsWith") {
    return buildStartsWithFilterQuery(ctx, filter);
  } else if (operator === "notStartsWith") {
    return buildNotStartsWithFilterQuery(ctx, filter);
  } else if (operator === "endsWith") {
    return buildEndsWithFilterQuery(ctx, filter);
  } else if (operator === "notEndsWith") {
    return buildNotEndsWithFilterQuery(ctx, filter);
  } else {
    throw new Error(`Filter operator '${operator}' is not supported.`);
  }
}

function buildLogicalFilterQuery(level: number, ctx: BuildQueryContext, filter: FindRowLogicalFilterOptions) {
  let dbOperator;
  if (filter.operator === "and") {
    dbOperator = " AND ";
  } else {
    dbOperator = " OR ";
  }

  let command = filter.filters.map(buildFilterQuery.bind(null, level + 1, ctx)).join(dbOperator);
  if (level) {
    return `(${command})`;
  }
  return command;
}

function buildUnaryFilterQuery(ctx: BuildQueryContext, filter: FindRowUnaryFilterOptions) {
  let command = ctx.builder.quoteColumn(filter.field, ctx.emitTableAlias);
  if (filter.operator === "null") {
    command += " IS NULL";
  } else {
    command += " IS NOT NULL";
  }
  return command;
}

function buildInFilterQuery(ctx: BuildQueryContext, filter: FindRowSetFilterOptions) {
  let command = ctx.builder.quoteColumn(filter.field, ctx.emitTableAlias);

  if (filter.operator === "in") {
    command += " = ";
  } else {
    command += " <> ";
  }
  ctx.params.push(filter.value);
  command += `ANY($${ctx.params.length}::${filter.itemType || "int"}[])`;

  return command;
}

function buildContainsFilterQuery(ctx: BuildQueryContext, filter: FindRowRelationalFilterOptions) {
  let command = ctx.builder.quoteColumn(filter.field, ctx.emitTableAlias);

  command += " LIKE ";
  ctx.params.push(`%${filter.value}%`);
  command += "$" + ctx.params.length;

  return command;
}

function buildNotContainsFilterQuery(ctx: BuildQueryContext, filter: FindRowRelationalFilterOptions) {
  let command = ctx.builder.quoteColumn(filter.field, ctx.emitTableAlias);

  command += " NOT LIKE ";
  ctx.params.push(`%${filter.value}%`);
  command += "$" + ctx.params.length;

  return command;
}

function buildStartsWithFilterQuery(ctx: BuildQueryContext, filter: FindRowRelationalFilterOptions) {
  let command = ctx.builder.quoteColumn(filter.field, ctx.emitTableAlias);

  command += " LIKE ";
  ctx.params.push(`${filter.value}%`);
  command += "$" + ctx.params.length;

  return command;
}

function buildNotStartsWithFilterQuery(ctx: BuildQueryContext, filter: FindRowRelationalFilterOptions) {
  let command = ctx.builder.quoteColumn(filter.field, ctx.emitTableAlias);

  command += " NOT LIKE ";
  ctx.params.push(`${filter.value}%`);
  command += "$" + ctx.params.length;

  return command;
}

function buildEndsWithFilterQuery(ctx: BuildQueryContext, filter: FindRowRelationalFilterOptions) {
  let command = ctx.builder.quoteColumn(filter.field, ctx.emitTableAlias);

  command += " LIKE ";
  ctx.params.push(`%${filter.value}`);
  command += "$" + ctx.params.length;

  return command;
}

function buildNotEndsWithFilterQuery(ctx: BuildQueryContext, filter: FindRowRelationalFilterOptions) {
  let command = ctx.builder.quoteColumn(filter.field, ctx.emitTableAlias);

  command += " NOT LIKE ";
  ctx.params.push(`%${filter.value}`);
  command += "$" + ctx.params.length;

  return command;
}

function buildRelationalFilterQuery(ctx: BuildQueryContext, filter: FindRowRelationalFilterOptions) {
  let command = ctx.builder.quoteColumn(filter.field, ctx.emitTableAlias);

  command += relationalOperatorsMap.get(filter.operator);

  ctx.params.push(filter.value);
  command += "$" + ctx.params.length;

  return command;
}
