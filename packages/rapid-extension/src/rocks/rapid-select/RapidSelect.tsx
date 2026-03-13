import { MoveStyleUtils, Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import { Select, SelectProps } from "antd";
import { RapidSelectProps, RapidSelectRockConfig } from "./rapid-select-types";
import RapidSelectMeta from "./RapidSelectMeta";
import { filter, get, isArray, isObject, map } from "lodash";
import { objectMatch } from "../../utils/object-utility";
import { useRockInstanceContext, wrapToRockComponent } from "@ruiapp/react-renderer";

export function configRapidSelect(config: RockComponentProps<RapidSelectRockConfig>): RapidSelectRockConfig {
  config.$type = RapidSelectMeta.$type;
  return config as RapidSelectRockConfig;
}

export function RapidSelectComponent(props: RockInstanceProps<RapidSelectProps>) {
  const context = useRockInstanceContext();
  const scope = context?.scope;

  let listItems: Record<string, any>[] = [];
  if (props.listDataSourceCode) {
    listItems = scope?.stores[props.listDataSourceCode]?.data?.list;
  } else {
    listItems = props.listItems || props.listDataSource?.data?.list;
  }

  const listTextFieldName = props.listTextFieldName || "name";
  const listValueFieldName = props.listValueFieldName || "id";

  let options: SelectProps["options"] = map(listItems, (listItem) => {
    let label: string;
    if (props.listTextFormat) {
      label = MoveStyleUtils.fulfillVariablesInString(props.listTextFormat, listItem);
    } else {
      label = get(listItem, listTextFieldName);
    }
    const value = get(listItem, listValueFieldName);

    return {
      label,
      value,
    };
  });

  if (isArray(props.listRejectItemValues) && props.listRejectItemValues.length) {
    options = filter(options, (item) => !props.listRejectItemValues!.includes(item.value as string | number));
  }

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

  let showSearch = false;
  let filterOption;
  if (props.listSearchable || (props.listFilterFields && props.listFilterFields.length)) {
    let listFilterFields = props.listFilterFields || [];
    if (!listFilterFields.length) {
      listFilterFields = [listTextFieldName];
    }

    showSearch = true;
    filterOption = (inputValue: string, option: any) => {
      return objectMatch(option, inputValue, listFilterFields);
    };
  }

  const antdProps: SelectProps<any> = {
    size: props.size,
    placeholder: props.placeholder,
    allowClear: props.allowClear,
    mode: props.mode,
    disabled: props.disabled,
    showSearch,
    filterOption,
    value: selectedValue,
    onChange: props.onChange,
    options,
    style: { width: "100%" },
  };

  return <Select {...antdProps}></Select>;
}

export const RapidSelect = wrapToRockComponent(RapidSelectMeta, RapidSelectComponent);

export default {
  Renderer: RapidSelectComponent,
  ...RapidSelectMeta,
} as Rock<RapidSelectRockConfig>;
