import type { FunctionMeta } from "@ruiapp/move-style";
import { isArray, isNull, isUndefined, map } from "lodash";
import { SearchFormFilterConfiguration } from "../types/rapid-entity-types";

export const searchParamsToFilters = (filterConfigurations: SearchFormFilterConfiguration[], searchParams: Record<string, any>) => {
  const filters: any[] = [];

  for (const filterConfig of filterConfigurations) {
    const paramValue = searchParams[filterConfig.code];
    if (isNull(paramValue) || isUndefined(paramValue)) {
      continue;
    }

    const filterMode = filterConfig.filterMode || "eq";
    let filterFields = filterConfig.filterFields || [filterConfig.code];
    if (!filterFields.length) {
      filterFields = [filterConfig.code];
    }

    if (filterFields.length === 1) {
      if (filterMode === "range") {
        if (!isArray(paramValue)) {
          continue;
        }

        filters.push({
          field: filterFields[0],
          operator: "gte",
          value: paramValue[0],
        });
        filters.push({
          field: filterFields[0],
          operator: "lt",
          value: paramValue[1],
        });
      } else {
        filters.push({
          field: filterFields[0],
          operator: filterMode,
          value: paramValue,
        });
      }
    } else {
      filters.push({
        operator: "or",
        filters: map(filterFields, (filterField) => {
          return {
            field: filterField,
            operator: filterMode,
            value: paramValue,
          };
        }),
      });
    }
  }

  return filters;
};

export default {
  name: "searchParamsToFilters",
  func: searchParamsToFilters,
} as FunctionMeta;
