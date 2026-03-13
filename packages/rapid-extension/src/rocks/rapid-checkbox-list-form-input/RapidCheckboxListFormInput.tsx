import { MoveStyleUtils, Rock, RockComponentProps, RockInstanceProps, fireEvent } from "@ruiapp/move-style";
import { Checkbox } from "antd";
import { RapidCheckboxListFormInputRockConfig } from "./rapid-checkbox-list-form-input-types";
import RapidCheckboxListFormInputMeta from "./RapidCheckboxListFormInputMeta";
import { filter, get, isObject, map } from "lodash";
import type { CheckboxGroupProps, CheckboxOptionType } from "antd/lib/checkbox";
import { CSSProperties, useMemo } from "react";
import { useRockInstanceContext, wrapToRockComponent } from "@ruiapp/react-renderer";

import "./RapidCheckboxListFormInput.css";

export function configRapidCheckboxListFormInput(config: RockComponentProps<RapidCheckboxListFormInputRockConfig>): RapidCheckboxListFormInputRockConfig {
  config.$type = RapidCheckboxListFormInputMeta.$type;
  return config as RapidCheckboxListFormInputRockConfig;
}

export function RapidCheckboxListFormInputComponent(props: RockInstanceProps<RapidCheckboxListFormInputRockConfig>) {
  const context = useRockInstanceContext();
  const { framework, page, scope } = context;
  const {
    groupByFieldName,
    listTextFormat,
    groupDataSourceCode,
    groupsDataSourceCode,
    groupItems: propGroupItems,
    groupDataSource,
    groupsDataSource,
    listDataSourceCode,
    listItems: propListItems,
    listDataSource,
    listTextFieldName: propListTextFieldName,
    listValueFieldName: propListValueFieldName,
    listDisabledFieldName: propListDisabledFieldName,
    groupTextFieldName: propGroupTextFieldName,
    groupValueFieldName: propGroupValueFieldName,
    valueFieldName,
    value,
    disabled,
    onChange,
    groupStyle,
    groupClassName,
    groupTitleStyle,
    groupTitleClassName,
    itemListStyle,
    itemListClassName,
    direction,
  } = props;

  let groupItems = [];
  if (groupDataSourceCode || groupsDataSourceCode) {
    groupItems = scope.stores[groupDataSourceCode || groupsDataSourceCode]?.data?.list;
  } else {
    groupItems = propGroupItems || groupDataSource?.data?.list || groupsDataSource?.data?.list;
  }

  let listItems = [];
  if (listDataSourceCode) {
    listItems = scope.stores[listDataSourceCode]?.data?.list;
  } else {
    listItems = propListItems || listDataSource?.data?.list;
  }

  const listTextFieldName = propListTextFieldName || "name";
  const listValueFieldName = propListValueFieldName || "id";
  const listDisabledFieldName = propListDisabledFieldName || "disabled";

  const groupTextFieldName = propGroupTextFieldName || "name";
  const groupValueFieldName = propGroupValueFieldName || "id";

  let selectedValue: string[];
  if (valueFieldName) {
    selectedValue = map(value, (item) => {
      if (isObject(item)) {
        return get(item, valueFieldName);
      }
      return item;
    });
  } else {
    selectedValue = value;
  }

  const antdProps: CheckboxGroupProps = {
    disabled: disabled,
    value: selectedValue,
    onChange: (checkedValues) => {
      fireEvent({
        eventName: "onChange",
        framework,
        page,
        scope,
        sender: props,
        eventHandlers: onChange,
        eventArgs: [checkedValues],
      });
    },
    style: { width: "100%" },
  };

  const checkboxList = useMemo(() => {
    if (groupByFieldName) {
      return map(groupItems, (group, index) => {
        const groupValue = get(group, groupValueFieldName) || index;
        const itemsInGroup = filter(listItems, (item) => get(item, groupByFieldName) === groupValue);

        return (
          <div key={groupValue} style={{ marginBottom: "15px", ...groupStyle }} className={groupClassName}>
            <h4 style={{ fontWeight: "bold", ...groupTitleStyle }} className={groupTitleClassName}>
              {get(group, groupTextFieldName, "")}
            </h4>
            <CheckboxList
              itemList={itemsInGroup}
              itemListStyle={itemListStyle}
              itemListClassName={itemListClassName}
              direction={direction}
              listTextFormat={listTextFormat}
              listTextFieldName={listTextFieldName}
              listValueFieldName={listValueFieldName}
              listDisabledFieldName={listDisabledFieldName}
            />
          </div>
        );
      });
    } else {
      return (
        <CheckboxList
          itemList={listItems}
          itemListStyle={itemListStyle}
          itemListClassName={itemListClassName}
          direction={direction}
          listTextFormat={listTextFormat}
          listTextFieldName={listTextFieldName}
          listValueFieldName={listValueFieldName}
          listDisabledFieldName={listDisabledFieldName}
        />
      );
    }
  }, [
    groupItems,
    listItems,
    groupByFieldName,
    groupValueFieldName,
    groupTextFieldName,
    listTextFormat,
    listTextFieldName,
    listValueFieldName,
    listDisabledFieldName,
    groupStyle,
    groupClassName,
    groupTitleStyle,
    groupTitleClassName,
    itemListStyle,
    itemListClassName,
    direction,
  ]);

  return <Checkbox.Group {...antdProps}>{checkboxList}</Checkbox.Group>;
}

export const RapidCheckboxListFormInput = wrapToRockComponent(RapidCheckboxListFormInputMeta, RapidCheckboxListFormInputComponent);

export default {
  Renderer: RapidCheckboxListFormInputComponent,
  ...RapidCheckboxListFormInputMeta,
} as Rock<RapidCheckboxListFormInputRockConfig>;

interface CheckboxListProps {
  itemList: any[];
  itemListStyle: CSSProperties;
  direction: RapidCheckboxListFormInputRockConfig["direction"];
  itemListClassName?: string;
  listTextFormat?: string;
  listTextFieldName?: string;
  listValueFieldName?: string;
  listDisabledFieldName?: string;
}

function CheckboxList(props: CheckboxListProps) {
  const { itemList } = props;
  const direction = props.direction || "horizontal";
  return (
    <div style={props.itemListStyle} className={props.itemListClassName}>
      {map(itemList, (item, index) => {
        const option = getCheckboxOption({
          item,
          listTextFormat: props.listTextFormat,
          listTextFieldName: props.listTextFieldName,
          listValueFieldName: props.listValueFieldName,
          listDisabledFieldName: props.listDisabledFieldName,
        });
        return (
          <div className={direction === "horizontal" ? "rapid-checkbox-list-item-horizontal" : "rapid-checkbox-list-item-vertical"}>
            <Checkbox key={index} value={option.value} disabled={option.disabled}>
              {option.label}
            </Checkbox>
          </div>
        );
      })}
    </div>
  );
}

interface GetCheckboxOptionOptions {
  item: any;
  listTextFormat?: string;
  listTextFieldName?: string;
  listValueFieldName?: string;
  listDisabledFieldName?: string;
}

function getCheckboxOption(options: GetCheckboxOptionOptions): CheckboxOptionType {
  const { item, listTextFormat, listTextFieldName, listValueFieldName, listDisabledFieldName } = options;
  let label: string;
  if (listTextFormat) {
    label = MoveStyleUtils.fulfillVariablesInString(listTextFormat, item);
  } else {
    label = get(item, listTextFieldName);
  }
  const value = get(item, listValueFieldName);
  const disabled = get(item, listDisabledFieldName);

  return {
    label,
    value,
    disabled,
  };
}
