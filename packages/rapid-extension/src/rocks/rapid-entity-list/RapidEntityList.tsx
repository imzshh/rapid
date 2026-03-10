import {
  fireEvent,
  RockInstance,
  RockInstanceContext,
  RuiRockLogger,
  type Rock,
  type RockChildrenConfig,
  type RockConfig,
  type RockEvent,
} from "@ruiapp/move-style";
import { genRockRenderer, renderRock, renderRockChildren } from "@ruiapp/react-renderer";
import RapidEntityListMeta from "./RapidEntityListMeta";
import { RapidEntityListProps, RapidEntityListRockConfig, RapidEntityListState } from "./rapid-entity-list-types";
import { filter, findIndex, forEach, isArray, isEmpty, map, merge, reject, set, trim, uniq } from "lodash";
import rapidAppDefinition from "../../rapidAppDefinition";
import { generateRockConfigOfError } from "../../rock-generators/generateRockConfigOfError";
import type { RapidEntity, RapidField } from "@ruiapp/rapid-common";
import type { EntityStore, EntityStoreConfig } from "../../stores/entity-store";
import RapidExtensionSetting from "../../RapidExtensionSetting";
import { RapidEntityListFilterCache } from "../rapid-entity-search-form/RapidEntitySearchForm";
import { parseRockExpressionFunc } from "../../utils/parse-utility";
import { getExtensionLocaleStringResource, getMetaPropertyLocaleName } from "../../helpers/i18nHelper";
import { getEntityPropertyByFieldNames } from "../../helpers/metaHelper";
import { RapidTableColumnConfig } from "../rapid-table-column/rapid-table-column-types";

export function configRapidEntityList(config: RapidEntityListRockConfig): RapidEntityListRockConfig {
  return config;
}

export function autoConfigTableColumnToRockConfig(
  context: RockInstanceContext,
  logger: RuiRockLogger,
  parentProps: any,
  column: RapidTableColumnConfig,
  mainEntity: RapidEntity,
) {
  const { framework, page } = context;
  if (column.$exps) {
    page.interpreteComponentProperties(null, column as any, {
      $self: column,
      $parent: parentProps,
    });
  }

  let cell: RockConfig | RockConfig[] | null = null;

  let columnTitle = column.title;

  let rpdField: RapidField | undefined;
  if (mainEntity) {
    const fieldName = column.fieldName || column.code || "";
    const fieldNameParts = fieldName.split(".");
    const result = getEntityPropertyByFieldNames(rapidAppDefinition.getAppDefinition(), mainEntity, fieldNameParts);
    rpdField = result.property;
    if (!rpdField) {
      logger.warn(parentProps, `Unknown field name '${fieldName}'`);
    } else {
      if (!columnTitle) {
        columnTitle = getMetaPropertyLocaleName(framework, result.entity, rpdField);
      }
    }
  }

  if (column.children) {
    return {
      $type: "rapidTableColumn",
      title: columnTitle,
      children: map(column.children, (childColumn) => autoConfigTableColumnToRockConfig(context, logger, parentProps, childColumn, mainEntity)),
    };
  }

  if (column.cell) {
    cell = column.cell;
  } else if (column.type === "link") {
    const url: string | undefined = column.rendererProps?.url;
    const text: string | undefined = column.rendererProps?.text;
    if (url) {
      cell = {
        $type: "anchor",
        href: url,
        children: {
          $type: "text",
          $exps: {
            text: text ? `$rui.execVarText('${text}', $slot.record)` : "$slot.value",
          },
        },
        $exps: {
          href: `$rui.execVarText('${url}', $slot.record)`,
          ...(column.rendererProps?.$exps || {}),
        },
      };
    }
  } else {
    let fieldType = column.fieldType || rpdField?.type || "text";
    let rendererType = column.rendererType || RapidExtensionSetting.getDefaultRendererTypeOfFieldType(fieldType);
    let defaultRendererProps: any = RapidExtensionSetting.getDefaultRendererProps(fieldType, rendererType);
    let fieldTypeRelatedRendererProps: any = {};
    if (rpdField) {
      if (fieldType === "option" || fieldType === "option[]") {
        fieldTypeRelatedRendererProps = {
          dictionaryCode: rpdField.dataDictionary,
        };
      } else if ((fieldType === "relation" || fieldType === "relation[]") && !column.rendererType) {
        if (rpdField.relation === "many") {
          rendererType = "rapidArrayRenderer";
        } else {
          rendererType = "rapidObjectRenderer";
        }

        const relationEntity = rapidAppDefinition.getEntityBySingularCode(rpdField.targetSingularCode);
        if (relationEntity?.displayPropertyCode) {
          fieldTypeRelatedRendererProps.format = `{{${relationEntity.displayPropertyCode}}}`;
        }
      }
    }

    cell = {
      $type: rendererType,
      ...defaultRendererProps,
      ...fieldTypeRelatedRendererProps,
      ...column.rendererProps,
      $exps: {
        value: "$slot.value",
        ...(column.rendererProps?.$exps || {}),
      },
    };
  }

  const tableColumnRock: RockConfig = {
    ...column,
    title: columnTitle,
    $type: "rapidTableColumn",
    cell,
  };
  return tableColumnRock;
}

function onResolveState(props, state) {
  return {
    selectedIds: [],
  };
}
function onInit(context, props) {
  if (props.dataSourceType === "dataSource") {
    return;
  }

  const entityCode = props.entityCode;
  if (!entityCode) {
    return;
  }

  const mainEntity = rapidAppDefinition.getEntityByCode(entityCode);
  if (!mainEntity) {
    return;
  }

  const storeScope = props.useStoreInPageScope ? context.page.scope : context.scope;
  const dataSourceCode = props.dataSourceCode || "list";

  if (!storeScope.stores[dataSourceCode]) {
    const { columns, pageSize } = props;
    const properties: string[] = uniq(
      props.queryProperties || [
        "id",
        ...map(
          filter(columns, (column) => !!column.code),
          (column) => column.code,
        ),
        ...(props.extraProperties || []),
      ],
    );
    const listDataStoreConfig: EntityStoreConfig = {
      type: "entityStore",
      name: dataSourceCode,
      entityModel: mainEntity,
      fixedFilters: props.fixedFilters,
      keepNonPropertyFields: props.keepNonPropertyFields,
      includingSoftDeleted: props.includingSoftDeleted,
      properties,
      relations: props.relations,
      orderBy: props.orderBy ||
        mainEntity.defaultOrderBy || [
          {
            field: "id",
          },
        ],
      pagination:
        pageSize > 0
          ? {
              limit: pageSize,
              offset: ((props.pageNum || 1) - 1) * pageSize,
            }
          : undefined,
    };

    // 启用高级查询参数缓存 & 获取并使用参数缓存
    if (props.enabledFilterCache && props.filterCacheName) {
      if (isArray(props.cacheFilters) && !isEmpty(props.cacheFilters)) {
        set(listDataStoreConfig, "filters", props.cacheFilters);
      }
    }

    storeScope.addStore(listDataStoreConfig);
  }
}

function onReceiveMessage(message, state, props, rockInstance) {
  if (message.name === "refreshView") {
    if (props.dataSourceType === "dataSource") {
      return;
    }

    const scope = props.useStoreInPageScope ? rockInstance._context.page.scope : rockInstance._scope;
    scope.stores[props.dataSourceCode]?.loadData();
  }
}

export function RapidEntityList(props: RapidEntityListProps) {
  const { $id, _context: context } = props as any as RockInstance;
  const { framework, page } = context;
  const logger = framework.getRockLogger(RapidEntityListMeta.$type, $id);
  const entityCode = props.entityCode;
  let mainEntity: RapidEntity | undefined;

  if (entityCode) {
    mainEntity = rapidAppDefinition.getEntityByCode(entityCode);
    if (!mainEntity) {
      const errorRockConfig = generateRockConfigOfError(new Error(`Entitiy with code '${entityCode}' not found.`));
      return renderRock({ context, rockConfig: errorRockConfig });
    }
  }

  const dataSourceCode = props.dataSourceCode || "list";
  const tableColumnRocks: RockConfig[] = [];

  if (props.showRowNumColumn) {
    const tableRowNumColumnRock: RockConfig = {
      $type: "rapidTableColumn",
      title: "#",
      code: "id",
      key: "_rowNum",
      width: "50px",
      align: "right",
      cell: {
        $type: "text",
        $exps: {
          text: "($slot.index + 1).toString()",
        },
      },
    };
    tableColumnRocks.push(tableRowNumColumnRock);
  }

  props.columns.forEach((column) => {
    const tableColumnRock = autoConfigTableColumnToRockConfig(context, logger, props, column, mainEntity);
    tableColumnRocks.push(tableColumnRock);
  });

  if (!props.hideActionsColumn) {
    forEach(props.actions, (recordActionConfig) => {
      set(recordActionConfig, "$exps.record", "$slot.record");
      set(recordActionConfig, "$exps.recordId", "$slot.record.id");
    });

    if (props.actions && props.actions.length) {
      const tableActionsColumnRock: RockConfig = {
        $type: "rapidTableColumn",
        title: getExtensionLocaleStringResource(framework, "operations"),
        code: "id",
        key: "_actions",
        width: props.actionsColumnWidth || "150px",
        fixed: "right",
        cell: props.actions,
      };
      tableColumnRocks.push(tableActionsColumnRock);
    }
  }

  let rowSelection = (props as any).rowSelection; // TODO: check if rowSelection is in props interface
  const selectionMode = props.selectionMode || "multiple";
  if (selectionMode !== "none") {
    rowSelection = {
      ...rowSelection,
      type: selectionMode === "multiple" ? "checkbox" : "radio",
      onChange: [
        {
          $action: "setVars",
          $exps: {
            [`vars.${$id}-selectedIds`]: "$event.args[0]",
            [`vars.${$id}-selectedRecords`]: "$event.args[1]",
          },
        },
        {
          $action: "handleEvent",
          eventName: "onSelectedIdsChange",
          handlers: props.onSelectedIdsChange,
          $exps: {
            args: "[{selectedIds: $event.args[0], selectedRecords: $event.args[1]}]",
          },
        },
      ],
    };
  }

  const dataSourceTotal = (props.dataSource || []).length;
  const storeScopeVarExp = props.useStoreInPageScope ? "$page.scope" : "$scope";
  const scopeVarExp = "$scope";
  let tableExps: Record<string, string> = {
    pagination:
      (props.pageSize || 0) > 0
        ? `{pageSize: ${props.pageSize}, current: ${storeScopeVarExp}.vars["${`stores-${dataSourceCode}-pageNum`}"], total: ${dataSourceTotal} }`
        : "false",
  };

  if (props.dataSourceType !== "dataSource") {
    tableExps = {
      dataSource: `${storeScopeVarExp}.stores.${dataSourceCode}?.data?.list`,
      pagination:
        (props.pageSize || 0) > 0
          ? `{pageSize: ${
              props.pageSize
            }, current: ${storeScopeVarExp}.vars["${`stores-${dataSourceCode}-pageNum`}"], total: ${storeScopeVarExp}.stores.${dataSourceCode}?.data?.total}`
          : "false",
    };
  }

  if (typeof (props as any).getRowSelectionCheckboxProps === "string" && trim((props as any).getRowSelectionCheckboxProps)) {
    rowSelection = merge({}, rowSelection, {
      getCheckboxProps: (record: any) => {
        const adapter = parseRockExpressionFunc((props as any).getRowSelectionCheckboxProps, { record }, context);
        return adapter();
      },
    });
  }

  const tableRockConfig: RockConfig = {
    $id: `${$id}-table`,
    $type: "rapidTable",
    $exps: {
      ...tableExps,
      ...(selectionMode !== "none"
        ? {
            "rowSelection.selectedRowKeys": `${scopeVarExp}.vars['${$id}-selectedIds']`,
          }
        : {}),
    },
    tableAutoHeight: props.tableAutoHeight,
    size: "small",
    rowKey: "id",
    rowSelection,
    columns: tableColumnRocks,
    virtual: props.virtual,
    dataSource: props.dataSource,
    expandedRow: props.expandedRow,
    showHeader: props.showHeader,
    ...props.tableProps,
    convertListToTree: props.convertListToTree,
    dataSourceAdapter: props.dataSourceAdapter,
    listIdField: props.listIdField,
    listParentField: props.listParentField,
    treeChildrenField: props.treeChildrenField,
    treeTopParentValue: props.treeTopParentValue,
    onRowClick: props.selectOnClickRow
      ? [
          {
            $action: "script",
            script: async (event: RockEvent) => {
              const { framework, page, scope } = event;
              const storeScope = props.useStoreInPageScope ? page.scope : scope;
              let nextSelectedIds: any[] = [];
              let nextSelectedRecords: any[] = [];
              const { record } = event.args[0];
              const recordId = record.id;
              if (selectionMode === "single") {
                nextSelectedIds.push(recordId);
                nextSelectedRecords.push(record);
              } else if (selectionMode === "multiple") {
                const currentSelectedIds = scope.vars[`${$id}-selectedIds`] || [];
                const currentSelectedRecords = scope.vars[`${$id}-selectedRecords`] || [];
                if (findIndex(currentSelectedIds, (item) => item === recordId) === -1) {
                  nextSelectedIds = [...currentSelectedIds, recordId];
                  nextSelectedRecords = [...currentSelectedRecords, record];
                } else {
                  nextSelectedIds = reject(currentSelectedIds, (item) => item === recordId);
                  nextSelectedRecords = reject(currentSelectedRecords, (item) => item.id === recordId);
                }
              }
              scope.setVars({
                [`${$id}-selectedIds`]: nextSelectedIds,
                [`${$id}-selectedRecords`]: nextSelectedRecords,
              });
              await fireEvent({
                eventName: "onSelectedIdsChange",
                framework,
                page,
                scope,
                sender: props,
                senderCategory: "component",
                eventHandlers: props.onSelectedIdsChange,
                eventArgs: [
                  {
                    selectedIds: nextSelectedIds,
                    selectedRecords: nextSelectedRecords,
                  },
                ],
              });
            },
          },
        ]
      : null,
    onChange: [
      {
        $action: "script",
        script: async (event: RockEvent) => {
          const [pagination] = event.args;
          const storeScope = props.useStoreInPageScope ? page.scope : event.scope;
          storeScope.setVars({
            [`stores-${dataSourceCode}-pageNum`]: pagination.current,
          });

          if (props.dataSourceType === "dataSource") {
            return;
          }

          // 启用高级查询参数缓存 & 设置参数缓存
          if (props.enabledFilterCache && props.filterCacheName) {
            RapidEntityListFilterCache.set(props.filterCacheName, { pageNum: pagination.current || 1 });
          }

          const store: EntityStore = storeScope.stores[dataSourceCode] as any;
          store.setPagination({
            limit: props.pageSize,
            offset: ((pagination.current || 1) - 1) * props.pageSize,
          });
          await store.loadData();
        },
      },
    ],
  };

  const rockChildrenConfig: RockChildrenConfig = [tableRockConfig];

  return renderRockChildren({ context, rockChildrenConfig });
}

export default {
  onResolveState,

  onInit,

  onReceiveMessage,

  Renderer: genRockRenderer(RapidEntityListMeta.$type, RapidEntityList, true),

  ...RapidEntityListMeta,
} as Rock<RapidEntityListRockConfig, RapidEntityListState>;
