import { MoveStyleUtils, RockChildrenConfig, RockEvent, RockPageEventSubscriptionConfig, type Rock, type RockConfig, type Framework } from "@ruiapp/move-style";
import { renderRock } from "@ruiapp/react-renderer";
import RapidEntityListMeta from "./SonicEntityListMeta";
import type { SonicEntityListRockConfig } from "./sonic-entity-list-types";
import { differenceBy, find, get, isArray, isEmpty, isNumber, keyBy, omit, pick, set } from "lodash";
import type { RapidEntityListProps, RapidEntityListRockConfig } from "../rapid-entity-list/rapid-entity-list-types";
import rapidAppDefinition from "../../rapidAppDefinition";
import { generateRockConfigOfError } from "../../rock-generators/generateRockConfigOfError";
import { RapidEntity } from "@ruiapp/rapid-common";
import { RapidDeleteRecordActionOptions, RapidUpdateRecordActionOptions } from "../../types/rapid-action-types";
import { EntityStore, RapidEntityFormRockConfig, RapidTableColumnConfig, RapidToolbarRockConfig } from "../../mod";
import { useState } from "react";
import moment from "moment";
import { RapidExtStorage } from "../../utils/storage-utility";
import { getColumnUniqueKey, ICacheRapidTableColumn } from "../rapid-entity-list-toolbox/RapidEntityListToolbox";
import { getRapidEntityListFilters, RapidEntityListFilterCache } from "../rapid-entity-search-form/RapidEntitySearchForm";
import { message, Modal } from "antd";
import { getRapidApi } from "../../rapidApi";
import { RapidEntityListToolboxColumnConfig } from "../rapid-entity-list-toolbox/RapidEntityListToolbox";
import { getExtensionLocaleStringResource, getMetaEntityLocaleName, getMetaPropertyLocaleName } from "../../helpers/i18nHelper";

const DEFAULT_PAGE_SIZE = 20;

function getToolboxColumns(framework: Framework, mainEntity: RapidEntity, tableColumns: RapidTableColumnConfig[]) {
  const toolboxColumns: any[] = [];

  for (const tableColumn of tableColumns) {
    if (tableColumn.children) {
      continue;
    }

    toolboxColumns.push(getToolboxColumnConfig(framework, mainEntity, tableColumn));
  }

  return toolboxColumns;
}

function getToolboxColumnConfig(framework: Framework, mainEntity: RapidEntity, column: RapidTableColumnConfig) {
  let columnTitle = column.title;

  const fieldName = column.fieldName || column.code;
  const fieldNameParts = fieldName.split(".");
  const rpdField = rapidAppDefinition.getEntityFieldByCode(mainEntity, fieldNameParts[0]);
  if (!columnTitle && rpdField) {
    columnTitle = getMetaPropertyLocaleName(framework, mainEntity, rpdField);
  }
  return {
    ...pick(column, ["key", "code", "hidden"]),
    title: columnTitle,
  };
}

export default {
  onResolveState(props, state) {
    const [rerenderKey, setRerenderKey] = useState<string | number>("");

    return {
      rerenderKey,
      rerenderDom: () => {
        setRerenderKey(moment().unix());
      },
    };
  },
  onReceiveMessage(message, state, props) {
    if (message.name === "refreshView") {
      message.page.sendComponentMessage(`${props.$id}-rapidEntityList`, {
        name: "refreshView",
      });
    } else if (message.name === "submitNewForm") {
      message.page.sendComponentMessage(`${props.$id}-newForm`, {
        name: "submit",
      });
    } else if (message.name === "submitEditForm") {
      message.page.sendComponentMessage(`${props.$id}-editForm`, {
        name: "submit",
      });
    } else if (message.name === "resetNewForm") {
      message.page.sendComponentMessage(`${props.$id}-newForm`, {
        name: "resetFields",
      });
    } else if (message.name === "resetEditForm") {
      message.page.sendComponentMessage(`${props.$id}-editForm`, {
        name: "resetFields",
      });
    } else if (message.name === "rerenderDom") {
      state.rerenderDom();
    }
  },

  Renderer(context, props, state) {
    const { framework } = context;
    const entities = rapidAppDefinition.getEntities();
    const entityCode = props.entityCode;
    let entityName = props.entityName;
    const rapidApi = getRapidApi();
    let mainEntity: RapidEntity | undefined;
    if (entityCode) {
      mainEntity = find(entities, (item) => item.code === entityCode);
      if (!mainEntity) {
        return renderRock({ context, rockConfig: generateRockConfigOfError(new Error(`Entity '${entityCode}' not found.`)) });
      }

      if (!entityName) {
        entityName = getMetaEntityLocaleName(framework, mainEntity);
      }
    }

    const dataSourceCode = props.dataSourceCode || "list";
    const pageSize = get(props, "pageSize", DEFAULT_PAGE_SIZE);
    let entityListRockConfig: RapidEntityListRockConfig = {
      ...(omit(MoveStyleUtils.omitSystemRockConfigFields(props), ["newForm", "editForm", "style"]) as RapidEntityListProps),
      dataSourceCode,
      pageSize,
      $type: "rapidEntityList",
      $id: `${props.$id}-rapidEntityList`,
    };

    // 启用高级查询参数缓存 & 获取并使用参数缓存
    let searchFormData: Record<string, any> = {};
    let scopeInitVars: Record<string, any> = {};
    if (props.enabledFilterCache && props.filterCacheName) {
      const filterCacheData = RapidEntityListFilterCache.get(props.filterCacheName);
      searchFormData = get(filterCacheData, "formData") || {};

      const filters = getRapidEntityListFilters(props.searchForm?.items || [], searchFormData);
      if (isArray(filters) && !isEmpty(filters)) {
        set(entityListRockConfig, "cacheFilters", filters);
      }

      if (filterCacheData && isNumber(filterCacheData.pageNum)) {
        scopeInitVars[`stores-${dataSourceCode}-pageNum`] = filterCacheData.pageNum || 1;
        set(entityListRockConfig, "pageNum", filterCacheData.pageNum || 1);
      }
    }

    // 动态 开启/关闭 树展示
    if (get(props, "$exps.convertListToTree")) {
      set(entityListRockConfig, "$exps.convertListToTree", get(props, "$exps.convertListToTree"));
    }

    const toolboxEnabled = !(props.hideToolbox || props.toolbox?.disabled);
    let toolboxRockConfig: RockConfig | null = null;

    if (toolboxEnabled) {
      toolboxRockConfig = {
        $type: "rapidEntityListToolbox",
        $id: `${props.$id}_toolbox`,
        dataSourceCode,
        columns: getToolboxColumns(framework, mainEntity, props.columns),
        config: props.toolbox || {
          columnCacheKey: props.entityCode || props.entityName,
        },
        onRerender: [
          {
            $action: "script",
            script: () => {
              state.rerenderDom();
            },
          },
        ],
      };

      const originColumns = props.columns || [];
      const cacheColumns = RapidExtStorage.get<ICacheRapidTableColumn[]>(toolboxRockConfig.config.columnCacheKey);
      if (isArray(cacheColumns) && !isEmpty(cacheColumns)) {
        const diffOriginColumns = differenceBy(originColumns, cacheColumns, getColumnUniqueKey);
        const originByCodeMap = keyBy(originColumns, getColumnUniqueKey) as Record<string, RapidEntityListToolboxColumnConfig>;

        let sortedColumns: any[] = [];
        let showColumns: any[] = [];
        let hideColumnCodes: string[] = [];
        cacheColumns.forEach((col) => {
          const uniqueKey = getColumnUniqueKey(col as any);
          const originColumn = originByCodeMap[uniqueKey];
          if (originColumn) {
            sortedColumns.push(originColumn);
            if (!col.hidden) {
              showColumns.push(originColumn);
            } else {
              hideColumnCodes.push(col.code);
            }
          }
        });

        entityListRockConfig.extraProperties = [...(entityListRockConfig.extraProperties || []), ...hideColumnCodes];
        entityListRockConfig.columns = [...showColumns, ...diffOriginColumns];

        let toolboxColumns = [...sortedColumns, ...diffOriginColumns].map((column) => getToolboxColumnConfig(framework, mainEntity, column));
        toolboxRockConfig.columns = toolboxColumns;
      }
    }

    let toolbarExtraActions: RockConfig[] = props.extraActions || [];
    if (props.searchForm) {
      toolbarExtraActions = [
        ...toolbarExtraActions,
        {
          $id: `${props.$id}-advancedSearchButton`,
          $type: "anchor",
          children: [
            {
              $type: "text",
              text: getExtensionLocaleStringResource(framework, "advancedSearch"),
            },
            {
              $type: "antdIcon",
              name: "DownOutlined",
              $exps: {
                name: `$scope.vars["searchBoxVisible"] ? "UpOutlined" : "DownOutlined"`,
              },
            },
          ],
          onClick: [
            {
              $action: "script",
              script: (event: RockEvent) => {
                event.scope.setVars({
                  searchBoxVisible: !event.scope.vars["searchBoxVisible"],
                });
              },
            },
          ],
        },
      ];
    }

    const toolbarRockConfig: RapidToolbarRockConfig = {
      $id: `${props.$id}-toolbar`,
      $type: "rapidToolbar",
      items: props.listActions,
      extras: toolbarExtraActions,
      rightExtras: toolboxEnabled ? [toolboxRockConfig] : [],
    };

    const searchFormRockConfig: RockConfig | null = props.searchForm
      ? {
          $id: `${props.$id}-searchForm`,
          $type: "rapidEntitySearchForm",
          entityCode: entityCode,
          defaultFormFields: searchFormData,
          items: props.searchForm.items,
          formDataAdapter: props.searchForm.formDataAdapter,
          onValuesChange: props.searchForm.onValuesChange,
          actionsAlign: "right",
          onSearch: [
            {
              $action: "script",
              script: async (event: RockEvent) => {
                const storeScope = props.useStoreInPageScope ? event.page.scope : event.scope;
                const store: EntityStore = storeScope.getStore(dataSourceCode);
                // 设置搜索变量
                storeScope.setVars({
                  [`stores-${dataSourceCode}-pageNum`]: 1,
                });

                // 启用高级查询参数缓存 & 设置参数缓存
                if (props.enabledFilterCache && props.filterCacheName) {
                  RapidEntityListFilterCache.set(props.filterCacheName, { formData: event.args[0].formData, pageNum: 1 });
                }

                store.updateConfig({
                  filters: event.args[0].filters,
                  pagination:
                    pageSize > 0
                      ? {
                          limit: pageSize,
                          offset: 0,
                        }
                      : undefined,
                });
                // 重新加载数据
                store.loadData();
              },
            },
          ],
        }
      : null;

    const onNewFormSubmitSuccess = props.newForm?.onSubmitSuccess || props.newForm?.onSaveSuccess;
    const onNewFormSubmitError = props.newForm?.onSubmitError || props.newForm?.onSaveError;
    const newModalRockConfig: RockConfig | null = props.newForm
      ? {
          $type: "antdModal",
          $id: `${props.$id}-newModal`,
          title:
            props.newModalTitle ||
            getExtensionLocaleStringResource(framework, "newModalTitle", {
              entityName,
            }),
          okText: getExtensionLocaleStringResource(framework, "ok"),
          cancelText: getExtensionLocaleStringResource(framework, "cancel"),
          maskClosable: false,
          $exps: {
            open: "!!$scope.vars['modal-newEntity-open']",
            confirmLoading: "!!$scope.vars['modal-saving']",
          },
          children: [
            {
              $type: "rapidEntityForm",
              $id: `${props.$id}-newForm`,
              mode: "new",
              ...(props.newForm as RapidEntityFormRockConfig),
              entityCode,
              beforeSubmit: [
                {
                  $action: "setVars",
                  vars: {
                    "modal-saving": true,
                  },
                },
              ],
              onSubmitSuccess: [
                {
                  $action: "setVars",
                  vars: {
                    "modal-newEntity-open": false,
                    "modal-saving": false,
                  },
                },
                ...(onNewFormSubmitSuccess ? (Array.isArray(onNewFormSubmitSuccess) ? onNewFormSubmitSuccess : [onNewFormSubmitSuccess]) : []),
                ...[
                  {
                    $action: "loadStoreData",
                    storeName: dataSourceCode,
                  },
                ],
              ],
              onSubmitError: [
                {
                  $action: "setVars",
                  vars: {
                    "modal-saving": false,
                  },
                },
                ...(onNewFormSubmitError ? (Array.isArray(onNewFormSubmitError) ? onNewFormSubmitError : [onNewFormSubmitError]) : []),
              ],
            } satisfies RapidEntityFormRockConfig,
          ],
          onOk: [
            {
              $action: "sendComponentMessage",
              componentId: props.$id,
              message: {
                name: "submitNewForm",
              },
            },
          ],
          onCancel: [
            {
              $action: "setVars",
              vars: {
                "modal-newEntity-open": false,
              },
            },
          ],
        }
      : null;

    const onEditFormSubmitSuccess = props.editForm?.onSubmitSuccess || props.editForm?.onSaveSuccess;
    const onEditFormSubmitError = props.editForm?.onSubmitError || props.editForm?.onSaveError;
    const editModalRockConfig: RockConfig | null = props.editForm
      ? {
          $type: "antdModal",
          $id: `${props.$id}-editModal`,
          title:
            props.editModalTitle ||
            getExtensionLocaleStringResource(framework, "editModalTitle", {
              entityName,
            }),
          okText: getExtensionLocaleStringResource(framework, "ok"),
          cancelText: getExtensionLocaleStringResource(framework, "cancel"),
          maskClosable: false,
          $exps: {
            open: "!!$scope.vars['modal-editEntity-open']",
            confirmLoading: "!!$scope.vars['modal-saving']",
          },
          children: [
            {
              $type: "rapidEntityForm",
              $id: `${props.$id}-editForm`,
              mode: "edit",
              ...(props.editForm as RapidEntityFormRockConfig),
              entityCode,
              $exps: {
                entityId: "$scope.vars.activeEntityId",
              },
              beforeSubmit: [
                {
                  $action: "setVars",
                  vars: {
                    "modal-saving": true,
                  },
                },
              ],
              onSubmitSuccess: [
                {
                  $action: "setVars",
                  vars: {
                    "modal-editEntity-open": false,
                    "modal-saving": false,
                  },
                },
                ...(onEditFormSubmitSuccess ? (Array.isArray(onEditFormSubmitSuccess) ? onEditFormSubmitSuccess : [onEditFormSubmitSuccess]) : []),
                ...[
                  {
                    $action: "loadStoreData",
                    storeName: dataSourceCode,
                  },
                ],
              ],
              onSubmitError: [
                {
                  $action: "setVars",
                  vars: {
                    "modal-saving": false,
                  },
                },
                ...(onEditFormSubmitError ? (Array.isArray(onEditFormSubmitError) ? onEditFormSubmitError : [onEditFormSubmitError]) : []),
              ],
            } satisfies RapidEntityFormRockConfig,
          ],
          onOk: [
            {
              $action: "sendComponentMessage",
              componentId: props.$id,
              message: {
                name: "submitEditForm",
              },
            },
          ],
          onCancel: [
            {
              $action: "setVars",
              vars: {
                "modal-editEntity-open": false,
              },
            },
          ],
        }
      : null;

    const childrenConfig: RockChildrenConfig = [];
    childrenConfig.push(toolbarRockConfig);

    if (searchFormRockConfig) {
      childrenConfig.push({
        $id: `${props.$id}-searchBox`,
        $type: "box",
        style: {
          backgroundColor: "#f2f2f2",
          borderRadius: "5px",
          padding: "24px",
          paddingBottom: "0",
          marginBottom: "12px",
        },
        children: searchFormRockConfig,
        $exps: {
          "style.display": `$scope.vars["searchBoxVisible"] ? "block" : "none"`,
        },
      });
    }

    childrenConfig.push(entityListRockConfig);
    if (newModalRockConfig) {
      childrenConfig.push(newModalRockConfig);
    }
    if (editModalRockConfig) {
      childrenConfig.push(editModalRockConfig);
    }
    const footerRockConfig = props.footer;
    if (footerRockConfig) {
      if (isArray(footerRockConfig)) {
        childrenConfig.push(...footerRockConfig);
      } else {
        childrenConfig.push(footerRockConfig);
      }
    }

    const rockConfig: RockConfig = {
      $id: `${props.$id}-scope`,
      $type: "scope",
      initialVars: scopeInitVars,
      stores: props.stores,
      children: [
        {
          $type: "box",
          $id: `${props.$id}-box`,
          className: "sonic-entity-list",
          children: childrenConfig,
          style: props.style,
        },
      ],
      eventSubscriptions: [
        {
          eventName: "onRefreshButtonClick",
          handlers: [
            {
              $action: "loadStoreData",
              storeName: dataSourceCode,
            },
          ],
        },
        {
          eventName: "onNewEntityButtonClick",
          handlers: [
            {
              $action: "setVars",
              vars: {
                "modal-newEntity-open": true,
              },
            },
            {
              $action: "sendComponentMessage",
              componentId: props.$id,
              message: {
                name: "resetNewForm",
              },
            },
          ],
        },
        {
          eventName: "onEditEntityButtonClick",
          handlers: [
            {
              $action: "setVars",
              vars: {
                "modal-editEntity-open": true,
              },
              $exps: {
                "vars.activeEntityId": "$event.args[0].recordId",
              },
            },
            {
              $action: "loadStoreData",
              storeName: "detail",
            },
            {
              $action: "wait",
              time: 0,
            },
            {
              $action: "sendComponentMessage",
              componentId: props.$id,
              message: {
                name: "resetEditForm",
              },
            },
          ],
        },
        {
          eventName: "onUpdateEntityButtonClick",
          handlers: [
            {
              $action: "script",
              script: async (event) => {
                const storeScope = props.useStoreInPageScope ? event.page.scope : event.scope;
                const recordAction: RapidUpdateRecordActionOptions = event.args[0];
                let { confirmTitle, confirmText, recordId, entity } = recordAction;
                if (confirmText) {
                  Modal.confirm({
                    title: confirmTitle,
                    content: confirmText,
                    okText: getExtensionLocaleStringResource(framework, "ok"),
                    cancelText: getExtensionLocaleStringResource(framework, "cancel"),
                    onOk: () => {
                      (async () => {
                        try {
                          await rapidApi.patch(`${mainEntity.namespace}/${mainEntity.pluralCode}/${recordId}`, entity);
                          storeScope.loadStoreData(dataSourceCode, null);
                        } catch (err: any) {
                          message.error(getExtensionLocaleStringResource(framework, "updateError", { message: err.message }));
                        }
                      })();
                    },
                  });
                } else {
                  try {
                    await rapidApi.patch(`${mainEntity.namespace}/${mainEntity.pluralCode}/${recordId}`, entity);
                    storeScope.loadStoreData(dataSourceCode, null);
                  } catch (err: any) {
                    message.error(getExtensionLocaleStringResource(framework, "updateError", { message: err.message }));
                  }
                }
              },
            },
          ],
        },
        {
          eventName: "onDeleteEntityButtonClick",
          handlers: [
            {
              $action: "script",
              script: async (event) => {
                const storeScope = props.useStoreInPageScope ? event.page.scope : event.scope;
                const recordAction: RapidDeleteRecordActionOptions = event.args[0];
                let { confirmTitle, confirmText, recordId } = recordAction;
                if (!confirmText) {
                  const entityName = props.entityName || getMetaEntityLocaleName(framework, mainEntity);
                  confirmText = getExtensionLocaleStringResource(framework, "deleteConfirmText", {
                    entityName,
                  });
                }

                Modal.confirm({
                  title: confirmTitle,
                  content: confirmText,
                  okText: getExtensionLocaleStringResource(framework, "ok"),
                  cancelText: getExtensionLocaleStringResource(framework, "cancel"),
                  onOk: () => {
                    (async () => {
                      try {
                        await rapidApi.delete(`${mainEntity.namespace}/${mainEntity.pluralCode}/${recordId}`);
                        message.info(getExtensionLocaleStringResource(framework, "deleteSuccess"));
                        storeScope.loadStoreData(dataSourceCode, null);
                      } catch (err: any) {
                        message.error(getExtensionLocaleStringResource(framework, "deleteError", { message: err.message }));
                      }
                    })();
                  },
                });
              },
            },
          ],
        },
        {
          eventName: "onRecordAction",
          handlers: [
            {
              $action: "script",
              script: async (event) => {
                const recordAction = event.args[0];
                const { actionName, recordId, record } = recordAction;
                const actionSubscription = find(props.actionSubscriptions, { actionName });
                if (actionSubscription) {
                  await event.page.handleEvent({
                    context,
                    parentEvent: event,
                    handlers: actionSubscription.handlers,
                    args: [{ recordId, record }],
                    sender: event.sender,
                  });
                }
              },
            },
          ],
        },
      ] satisfies RockPageEventSubscriptionConfig[],
    };

    return renderRock({ context, rockConfig });
  },

  ...RapidEntityListMeta,
} as Rock<SonicEntityListRockConfig>;
