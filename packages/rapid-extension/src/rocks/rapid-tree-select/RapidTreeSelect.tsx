import { MoveStyleUtils, Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import { TreeSelect, TreeSelectProps } from "antd";
import { RapidTreeSelectProps, RapidTreeSelectRockConfig } from "./rapid-tree-select-types";
import { get, isObject, map } from "lodash";
import RapidTreeSelectMeta from "./RapidTreeSelectMeta";
import { useRockInstanceContext, wrapToRockComponent } from "@ruiapp/react-renderer";

export function configRapidTreeSelect(config: RockComponentProps<RapidTreeSelectRockConfig>): RapidTreeSelectRockConfig {
  config.$type = RapidTreeSelectMeta.$type;
  return config as RapidTreeSelectRockConfig;
}

export function RapidTreeSelectComponent(props: RockInstanceProps<RapidTreeSelectProps>) {
  const context = useRockInstanceContext();
  const { scope } = context;
  let dataList = props.listDataSource?.data?.list;
  if (!dataList && props.listDataSourceCode) {
    dataList = scope.stores[props.listDataSourceCode]?.data?.list;
  }

  const treeData = MoveStyleUtils.listToTree(dataList, {
    listIdField: props.listIdField,
    listParentField: props.listParentField,
    treeChildrenField: props.treeChildrenField,
    topParentValue: props.treeTopParentValue,
  } as any);

  let selectedValue: string | string[] | undefined;
  if (props.mode === "multiple") {
    if (props.value) {
      if (props.valueFieldName) {
        selectedValue = map(props.value, (item) => {
          if (isObject(item)) {
            return get(item, props.valueFieldName);
          }
          return item;
        });
      } else {
        selectedValue = props.value;
      }
    } else {
      selectedValue = [];
    }
  } else {
    if (props.valueFieldName) {
      if (isObject(props.value)) {
        selectedValue = get(props.value, props.valueFieldName);
      } else {
        selectedValue = props.value;
      }
    } else {
      selectedValue = props.value;
    }
  }

  const antdProps: TreeSelectProps<any> = {
    size: props.size,
    placeholder: props.placeholder,
    allowClear: props.allowClear,
    multiple: props.mode === "multiple",
    disabled: props.disabled,
    value: selectedValue,
    onChange: props.onChange,
    treeData,
    fieldNames: {
      label: props.treeNodeLabelFieldName || "name",
      value: props.treeNodeValueFieldName || "id",
      children: props.treeChildrenField || "children",
    },
    style: { width: "100%" },
  };

  return <TreeSelect {...antdProps}></TreeSelect>;
}

export const RapidTreeSelect = wrapToRockComponent(RapidTreeSelectMeta, RapidTreeSelectComponent);

export default {
  Renderer: RapidTreeSelectComponent,
  ...RapidTreeSelectMeta,
} as Rock<RapidTreeSelectRockConfig>;
