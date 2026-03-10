import { EventEmitter, MoveStyleUtils, type Rock, type RockInstance, type RockInstanceContext } from "@ruiapp/move-style";
import RapidTableSelectMeta from "./RapidTableSelectMeta";
import { RapidTableSelectProps, RapidTableSelectRequestConfig, RapidTableSelectRockConfig } from "./rapid-table-select-types";
import { convertToEventHandlers, genRockRenderer, renderRock } from "@ruiapp/react-renderer";
import { Table, Select, Input, Empty, Spin } from "antd";
import { debounce, filter, forEach, get, isArray, isObject, isPlainObject, isString, last, map, omit, pick, set, split } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMergeState } from "../../hooks/use-merge-state";
import { getRapidApi } from "../../rapidApi";
import { FindEntityOptions } from "../../rapid-types";
import { parseConfigToFilters } from "../../functions/searchParamsToFilters";
import dayjs from "dayjs";
import "./rapid-table-select-style.css";
import { getExtensionLocaleStringResource } from "../../helpers/i18nHelper";
import { calculateColumnsTotalWidth, convertRapidTableColumnToAntdTableColumn } from "../rapid-table/RapidTable";

const bus = new EventEmitter();

const DEFAULT_COLUMNS: RapidTableSelectRockConfig["columns"] = [{ code: "name", width: 120 }];

interface ICurrentState {
  offset: number;
  keyword?: string;
  selectedRecordMap: Record<string, any>;
  visible?: boolean;
  reloadKey?: string | number;
}

export function configRapidTableSelect(config: RapidTableSelectRockConfig): RapidTableSelectRockConfig {
  return config;
}

export function RapidTableSelect(props: RapidTableSelectProps) {
  const { $id, _context: context } = props as any as RockInstance;
  const { framework } = context;
  const logger = framework.getRockLogger(RapidTableSelectMeta.$type, $id);
  const {
    listValueFieldName = "id",
    listTextFieldName = "name",
    dropdownMatchSelectWidth = 360,
    listTextFormat,
    pageSize = 20,
    columns = DEFAULT_COLUMNS,
    listFilterFields = ["name"],
    allowClear,
    placeholder,
    disabled,
    tableHeight = 400,
  } = props;

  const isMultiple = props.mode === "multiple";

  const refreshDataRef = useRef<Function>(null);
  const [currentState, setCurrentState] = useMergeState<ICurrentState>({ offset: 0, selectedRecordMap: {} });
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const debouncedCallBack = useCallback(
    debounce((m) => setDebouncedKeyword(m), 600),
    [],
  );

  const apiIns = useRequest(props.requestConfig, context);
  const { loadSelectedRecords, loading } = useSelectedRecords(props, (records) => {
    forEach(records, (record) => {
      const recordValue = get(record, listValueFieldName);
      setCurrentState((draft) => {
        return { ...draft, selectedRecordMap: { ...draft.selectedRecordMap, [recordValue]: record } };
      });
    });
  });

  const loadData = () => {
    const params: any = {
      filters: [],
      pagination: {
        limit: pageSize,
        offset: currentState.offset,
      },
    };

    if (currentState.keyword && listFilterFields?.length) {
      const filters = listFilterFields.map((field) => {
        if (isString(field)) {
          const filterCodes = split(field, ".");
          return parseSelectedRecordFilters(filterCodes, "contains", currentState.keyword)[0];
        } else if (isObject(field)) {
          return parseConfigToFilters([field], currentState.keyword)[0];
        }
      });
      params.filters =
        filters.length > 1
          ? [
              {
                operator: "or",
                filters,
              },
            ]
          : filters;
    }

    apiIns.request(params);
  };

  refreshDataRef.current = loadData;
  useEffect(() => {
    const handler = () => {
      refreshDataRef.current?.();
    };

    bus.on(`${$id}-refresh`, handler);

    return () => {
      bus.off(`${$id}-refresh`, handler);
    };
  }, [$id]);

  useEffect(() => {
    const reloadHandler = () => {
      setCurrentState({ offset: 0, reloadKey: dayjs().unix() });
    };

    bus.on(`${$id}-reload`, reloadHandler);

    return () => {
      bus.off(`${$id}-reload`, reloadHandler);
    };
  }, [$id, setCurrentState]);

  useEffect(() => {
    loadData();
  }, [props.requestConfig?.url, currentState.offset, currentState.reloadKey, debouncedKeyword]);

  const getLabel = (record: Record<string, any>) => {
    if (props.labelRendererType) {
      return renderRock({
        context,
        rockConfig: {
          $type: props.labelRendererType,
          ...props.labelRendererProps,
          value: record,
        },
      });
    }

    if (!listTextFormat) {
      return get(record, listTextFieldName);
    }

    return MoveStyleUtils.fulfillVariablesInString(listTextFormat, record);
  };

  const selectedKeys = useMemo(() => {
    let val: any | any[] = props.value != null ? props.value : [];
    if (!isArray(val)) {
      val = val || val === 0 ? [val] : [];
    }

    return val.map((item) => {
      if (isPlainObject(item)) {
        const lastCode = last(split(listValueFieldName, "."));

        return get(item, listValueFieldName) || get(item, lastCode);
      }

      return item;
    });
  }, [props.value]);

  useEffect(() => {
    const keys = (selectedKeys || []).filter((key) => !currentState.selectedRecordMap[key]);
    if (keys.length) {
      loadSelectedRecords(keys);
    }
  }, [selectedKeys, currentState.selectedRecordMap]);

  const selectOptions = useMemo(() => {
    return Object.keys(currentState.selectedRecordMap)
      .map((k) => {
        const record = currentState.selectedRecordMap[k];
        return record ? { label: getLabel(record), value: get(record, listValueFieldName) } : null;
      })
      .filter((record) => record != null);
  }, [currentState.selectedRecordMap]);

  const eventHandlers = convertToEventHandlers({ context, rockConfig: props as any }) as any;

  const tableColumns = map(columns, (column) =>
    convertRapidTableColumnToAntdTableColumn(logger, framework, context, {
      $type: "rapidTableColumn",
      ...column,
    }),
  );
  const columnsTotalWidth = calculateColumnsTotalWidth(columns);

  const current = isMultiple ? selectedKeys : selectedKeys[0];

  const onSelectRows = (records: any[]) => {
    let keys = selectedKeys || [];
    let s = { ...currentState, selectedRecordMap: { ...currentState.selectedRecordMap } };

    forEach(records, (record) => {
      const recordValue = get(record, listValueFieldName);

      const isExisted = keys.some((k) => k === recordValue);

      if (isExisted) {
        keys = keys.filter((k) => k !== recordValue);
      } else {
        keys = [recordValue, ...keys];
      }

      s.selectedRecordMap[recordValue] = record;
      if (isExisted) {
        s.selectedRecordMap = omit(s.selectedRecordMap, recordValue);
      }
    });

    if (!isMultiple) {
      s.visible = false;
    }

    setCurrentState(s);

    eventHandlers.onChange?.(isMultiple ? keys : keys[0]);

    const selectedRecords = keys.map((k) => s.selectedRecordMap[k]);
    const validRecords = filter(records, (record) => s.selectedRecordMap[get(record, listValueFieldName)] != null);

    eventHandlers.onSelectedRecord?.(isMultiple ? validRecords : validRecords[0], selectedRecords, s);
  };

  return (
    <Select
      allowClear={allowClear}
      disabled={disabled}
      bordered={props.bordered}
      loading={apiIns.loading || loading}
      placeholder={placeholder || getExtensionLocaleStringResource(framework, "pleaseSelect")}
      value={current}
      mode={isMultiple ? "multiple" : undefined}
      open={currentState.visible}
      onChange={(v) => {
        const arrs = isArray(v) ? v : v != null ? [v] : [];
        const selectedRecords = arrs?.map((k) => currentState.selectedRecordMap[k]);
        eventHandlers.onChange?.(v);
        eventHandlers.onSelectedRecord?.(null, selectedRecords, pick(currentState.selectedRecordMap, arrs));
      }}
      onDropdownVisibleChange={(v) => {
        setCurrentState({ visible: v });
      }}
      options={selectOptions}
      dropdownStyle={{ padding: 0 }}
      dropdownMatchSelectWidth={dropdownMatchSelectWidth}
      dropdownRender={(menu) => {
        return (
          <div>
            {listFilterFields?.length ? (
              <div className="pm-table-selector--toolbar">
                <Input
                  allowClear
                  placeholder={props.searchPlaceholder || getExtensionLocaleStringResource(framework, "search")}
                  value={currentState.keyword}
                  onChange={(e) => {
                    const v = e.target.value;
                    setCurrentState({ keyword: v, offset: 0 });
                    debouncedCallBack(v);
                  }}
                />
              </div>
            ) : null}
            <Spin spinning={apiIns.loading || loading || false}>
              {!apiIns.records?.length ? (
                <Empty style={{ margin: "24px 0" }} />
              ) : (
                <Table
                  size="small"
                  rowKey={(record) => get(record, listValueFieldName)}
                  scroll={{ x: columnsTotalWidth, y: tableHeight }}
                  columns={tableColumns}
                  dataSource={apiIns.records || []}
                  rowClassName="pm-table-row"
                  rowSelection={{
                    fixed: true,
                    type: isMultiple ? "checkbox" : "radio",
                    selectedRowKeys: selectedKeys,
                    onSelectAll(selected, selectedRows, changeRows) {
                      onSelectRows(changeRows || []);
                    },
                    onSelect(record) {
                      onSelectRows([record]);
                    },
                  }}
                  onRow={(record) => {
                    return {
                      onClick: () => {
                        onSelectRows([record]);
                      },
                    };
                  }}
                  pagination={{
                    size: "small",
                    current: currentState.offset / pageSize + 1,
                    pageSize,
                    total: apiIns.total || 0,
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                    onChange(page) {
                      setCurrentState({ offset: (page - 1) * pageSize });
                    },
                  }}
                />
              )}
            </Spin>
          </div>
        );
      }}
    />
  );
}

export default {
  onReceiveMessage(message, state, props) {
    if (message.name === "refreshData") {
      bus.emit(`${props.$id}-refresh`, message.payload);
    } else if (message.name === "reload") {
      bus.emit(`${props.$id}-reload`);
    }
  },
  Renderer: genRockRenderer(RapidTableSelectMeta.$type, RapidTableSelect, true),

  ...RapidTableSelectMeta,
} as Rock<RapidTableSelectRockConfig>;

interface IRequestState {
  loading?: boolean;
  records?: any[];
  page?: number;
  total?: number;
}

function useRequest(config: RapidTableSelectRequestConfig, context: RockInstanceContext) {
  const [state, setState] = useMergeState<IRequestState>({});
  const rapidApi = getRapidApi();
  const request = async (params: any) => {
    if (!config?.url) {
      return;
    }

    if (state.loading) {
      return;
    }

    let configParams = config.params || {};
    const expressions = configParams.$exps;
    if (expressions) {
      for (const propName in expressions) {
        const interpretedValue = context.page.interpreteExpression(expressions[propName], {
          $scope: context.scope,
          $page: context.page,
        });

        set(configParams, propName, interpretedValue);
      }
    }

    setState({ loading: true });
    rapidApi[config.method || "post"](`${config.baseUrl || ""}${config.url || ""}`, {
      ...omit(configParams || {}, "fixedFilters"),
      ...params,
      filters: [...(configParams?.fixedFilters || []), ...params.filters],
    })
      .then((res) => {
        let records = res.data?.list || [];
        let total = res.data?.total || 0;
        if (res.status < 200 || res.status >= 300) {
          setState({ loading: false });
        } else {
          setState({ loading: false, records, total });
        }
      })
      .catch((e) => {
        setState({ loading: false });
      });
  };

  return { request, ...state };
}

function useSelectedRecords(props: RapidTableSelectProps, onSuccess: (records: any[]) => void) {
  const { requestConfig: config, listValueFieldName = "id" } = props;
  const rapidApi = getRapidApi();
  const [loading, setLoading] = useState<boolean>(false);

  const loadSelectedRecords = async (keys: string[]) => {
    if (!keys?.length) {
      return;
    }

    setLoading(true);

    const filterCodes = split(listValueFieldName, ".");

    rapidApi[config.method || "post"](`${config.baseUrl || ""}${config.url || ""}`, {
      ...pick(config.params || {}, "properties"),
      pagination: {
        limit: 100,
        offset: 0,
      },
      filters: parseSelectedRecordFilters(filterCodes, "in", keys),
    })
      .then((res) => {
        let records = res.data?.list || [];
        if (res.status >= 200 && res.status < 300) {
          onSuccess(records);
          setLoading(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { loading, loadSelectedRecords };
}

function parseSelectedRecordFilters(codes: string[], operator: FindEntityOptions["filters"][0]["operator"], value: any): FindEntityOptions["filters"] {
  const [currentCode, ...restCodes] = codes || [];
  if (restCodes.length) {
    const nextFilters = parseSelectedRecordFilters(restCodes, operator, value);
    return [
      {
        field: currentCode,
        operator: "exists",
        filters: nextFilters || [],
      },
    ];
  } else if (currentCode) {
    const filterItem: any = { field: currentCode, operator: operator as any, value: value };

    if (isString(value) || (isArray(value) && isString(value[0]))) {
      filterItem.itemType = "text";
    }

    return [filterItem];
  } else {
    return [];
  }
}
