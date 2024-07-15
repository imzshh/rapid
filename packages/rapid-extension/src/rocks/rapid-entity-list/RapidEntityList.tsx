import { handleComponentEvent, type Rock, type RockChildrenConfig, type RockConfig, type RockEvent } from "@ruiapp/move-style";
import { renderRock, renderRockChildren } from "@ruiapp/react-renderer";
import RapidEntityListMeta from "./RapidEntityListMeta";
import type { RapidEntityListRockConfig, RapidEntityListState } from "./rapid-entity-list-types";
import { filter, findIndex, forEach, map, reject, set, uniq } from "lodash";
import rapidAppDefinition from "../../rapidAppDefinition";
import { generateRockConfigOfError } from "../../rock-generators/generateRockConfigOfError";
import type { RapidToolbarRockConfig } from "../rapid-toolbar/rapid-toolbar-types";
import type { RapidEntity, RapidField } from "../../types/rapid-entity-types";
import type { EntityStore, EntityStoreConfig } from "../../stores/entity-store";
import RapidExtensionSetting from "../../RapidExtensionSetting";

export default {
  onResolveState(props, state) {
    return {
      selectedIds: [],
    };
  },

  onInit(context, props) {
    const entityCode = props.entityCode;
    if (!entityCode) {
      return;
    }

    const mainEntity = rapidAppDefinition.getEntityByCode(entityCode);
    if (!mainEntity) {
      return;
    }

    const dataSourceCode = props.dataSourceCode || "list";
    if (!context.scope.stores[dataSourceCode]) {
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
        properties,
        relations: props.relations,
        orderBy: props.orderBy || [
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
        $exps:
          pageSize > 0
            ? {
                "pagination.limit": `${pageSize}`,
                "pagination.offset": `(($scope.vars['stores-${dataSourceCode}-pageNum'] || 1) - 1) * ${pageSize}`,
              }
            : undefined,
      };
      context.scope.addStore(listDataStoreConfig);
    }
  },

  onReceiveMessage(message, state, props) {
    if (message.name === "refreshView") {
      state.scope.stores[props.dataSourceCode]?.loadData();
    }
  },

  Renderer(context, props, state) {
    const { logger, page } = context;
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

    props.columns.forEach((column) => {
      let cell: RockConfig | RockConfig[] | null = null;

      let rpdField: RapidField | undefined;
      if (mainEntity) {
        const fieldName = column.fieldName || column.code;
        const fieldNameParts = fieldName.split(".");
        rpdField = rapidAppDefinition.getEntityFieldByCode(mainEntity, fieldNameParts[0]);

        if (!column.title && rpdField) {
          column.title = rpdField.name;
        }

        if (fieldNameParts.length > 1 && rpdField) {
          const rpdRelationEntity = rapidAppDefinition.getEntityBySingularCode(rpdField.targetSingularCode);
          if (rpdRelationEntity) {
            rpdField = rapidAppDefinition.getEntityFieldByCode(rpdRelationEntity, fieldNameParts[1]);
          }
        }

        if (!rpdField) {
          logger.warn(props, `Unknown field code '${column.code}'`);
        }
      }

      if (column.$exps) {
        page.interpreteComponentProperties(null, column as any, {
          $self: column,
          $parent: props,
        });
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
      } else if (column.type === "auto") {
        let fieldType = column.fieldType || rpdField?.type || "text";
        let rendererType = column.rendererType || RapidExtensionSetting.getDefaultRendererTypeOfFieldType(fieldType);
        let defaultRendererProps: any = RapidExtensionSetting.getDefaultRendererProps(fieldType, rendererType);
        let fieldTypeRelatedRendererProps: any = {};
        if (rpdField) {
          if (fieldType === "option") {
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
        $type: "rapidTableColumn",
        cell,
      };
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
          title: "操作",
          code: "id",
          key: "_actions",
          width: props.actionsColumnWidth || "150px",
          fixed: "right",
          cell: props.actions,
        };
        tableColumnRocks.push(tableActionsColumnRock);
      }
    }

    let rowSelection = null;
    const selectionMode = props.selectionMode || "multiple";
    if (selectionMode !== "none") {
      rowSelection = {
        type: selectionMode === "multiple" ? "checkbox" : "radio",
        onChange: [
          {
            $action: "setVars",
            $exps: {
              [`vars.${props.$id}-selectedIds`]: "$event.args[0]",
              [`vars.${props.$id}-selectedRecords`]: "$event.args[1]",
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

    const tableRockConfig: RockConfig = {
      $id: `${props.$id}-table`,
      $type: "rapidTable",
      $exps: {
        dataSource: `$scope.stores.${dataSourceCode}.data?.list`,
        pagination:
          props.pageSize > 0
            ? `{pageSize: ${props.pageSize}, current: $scope.vars["${`stores-${dataSourceCode}-pageNum`}"], total: $scope.stores.${dataSourceCode}.data?.total}`
            : "false",
        ...(selectionMode !== "none"
          ? {
              "rowSelection.selectedRowKeys": `$scope.vars['${props.$id}-selectedIds']`,
            }
          : {}),
      },
      size: "small",
      rowKey: "id",
      rowSelection,
      columns: tableColumnRocks,
      showHeader: props.showHeader,
      ...props.tableProps,
      convertListToTree: props.convertListToTree,
      listIdField: props.listIdField,
      listParentField: props.listParentField,
      treeChildrenField: props.treeChildrenField,
      onRowClick: props.selectOnClickRow
        ? [
            {
              $action: "script",
              script: async (event: RockEvent) => {
                const { framework, page, scope } = event;
                let nextSelectedIds = [];
                let nextSelectedRecords = [];
                const { record } = event.args[0];
                const recordId = record.id;
                if (selectionMode === "single") {
                  nextSelectedIds.push(recordId);
                  nextSelectedRecords.push(record);
                } else if (selectionMode === "multiple") {
                  const currentSelectedIds = scope.vars[`${props.$id}-selectedIds`] || [];
                  const currentSelectedRecords = scope.vars[`${props.$id}-selectedRecords`] || [];
                  if (findIndex(currentSelectedIds, (item) => item === recordId) === -1) {
                    nextSelectedIds = [...currentSelectedIds, recordId];
                    nextSelectedRecords = [...currentSelectedRecords, record];
                  } else {
                    nextSelectedIds = reject(currentSelectedIds, (item) => item === recordId);
                    nextSelectedRecords = reject(currentSelectedRecords, (item) => item.id === recordId);
                  }
                }
                scope.setVars({
                  [`${props.$id}-selectedIds`]: nextSelectedIds,
                  [`${props.$id}-selectedRecords`]: nextSelectedRecords,
                });
                handleComponentEvent("onSelectedIdsChange", framework, page as any, scope, props, props.onSelectedIdsChange, [
                  {
                    selectedIds: nextSelectedIds,
                    selectedRecords: nextSelectedRecords,
                  },
                ]);
              },
            },
          ]
        : null,
      onChange: [
        {
          $action: "script",
          script: async (event: RockEvent) => {
            const [pagination] = event.args;
            const store: EntityStore = event.scope.stores[dataSourceCode] as any;
            // store.setPagination({
            //   limit: props.pageSize,
            //   offset: ((pagination.current || 1) - 1) * props.pageSize
            // });
            event.scope.setVars({
              [`stores-${dataSourceCode}-pageNum`]: pagination.current,
            });
            await store.loadData();
          },
        },
      ],
    };

    const rockChildrenConfig: RockChildrenConfig = [tableRockConfig];

    return renderRockChildren({ context, rockChildrenConfig });
  },

  ...RapidEntityListMeta,
} as Rock<RapidEntityListRockConfig, RapidEntityListState>;
