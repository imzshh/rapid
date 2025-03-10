import { MoveStyleUtils, Rock } from "@ruiapp/move-style";
import { Checkbox, Space } from "antd";
import { RapidCheckboxListFormInputRockConfig } from "./rapid-checkbox-list-form-input-types";
import RapidCheckboxListFormInputMeta from "./RapidCheckboxListFormInputMeta";
import { filter, get, isObject, map } from "lodash";
import type { CheckboxGroupProps, CheckboxOptionType } from "antd/lib/checkbox";
import { CSSProperties, useMemo } from "react";

import "./RapidCheckboxListFormInput.css";
import { cx } from "../../utils/classname-utility";

export default {
  $type: "rapidCheckboxListFormInput",

  Renderer(context, props: RapidCheckboxListFormInputRockConfig) {
    const { scope } = context;

    const { groupsDataSource, groupsDataSourceCode, listDataSource, listDataSourceCode, groupByFieldName, listTextFormat } = props;

    let groupList = groupsDataSource?.data?.list;
    if (groupsDataSourceCode) {
      groupList = scope.stores[groupsDataSourceCode]?.data?.list;
    }

    let itemList: any[] = listDataSource?.data?.list || [];
    if (listDataSourceCode) {
      itemList = scope.stores[listDataSourceCode]?.data?.list || [];
    }

    const listTextFieldName = props.listTextFieldName || "name";
    const listValueFieldName = props.listValueFieldName || "id";

    const groupTextFieldName = props.groupTextFieldName || "name";
    const groupValueFieldName = props.groupValueFieldName || "id";

    let selectedValue: string[];
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

    const antdProps: CheckboxGroupProps = {
      disabled: props.disabled,
      value: selectedValue,
      onChange: props.onChange,
      style: { width: "100%" },
    };

    const checkboxList = useMemo(() => {
      if (groupByFieldName) {
        return (groupList || []).map((group, index) => {
          const groupValue = get(group, groupValueFieldName) || index;
          const itemsInGroup = filter(itemList, (item) => get(item, groupByFieldName) === groupValue);

          return (
            <div key={groupValue} style={{ marginBottom: "15px", ...props.groupStyle }} className={props.groupClassName}>
              <h4 style={{ fontWeight: "bold", ...props.groupTitleStyle }} className={props.groupTitleClassName}>
                {get(group, groupTextFieldName, "")}
              </h4>
              <CheckboxList
                itemList={itemsInGroup}
                itemListStyle={props.itemListStyle}
                itemListClassName={props.itemListClassName}
                direction={props.direction}
                listTextFormat={listTextFormat}
                listTextFieldName={listTextFieldName}
                listValueFieldName={listValueFieldName}
              />
            </div>
          );
        });
      } else {
        return (
          <CheckboxList
            itemList={itemList}
            itemListStyle={props.itemListStyle}
            itemListClassName={props.itemListClassName}
            direction={props.direction}
            listTextFormat={listTextFormat}
            listTextFieldName={listTextFieldName}
            listValueFieldName={listValueFieldName}
          />
        );
      }
    }, [groupList, itemList, groupByFieldName]);

    return <Checkbox.Group {...antdProps}>{checkboxList}</Checkbox.Group>;
  },

  ...RapidCheckboxListFormInputMeta,
} as Rock;

interface CheckboxListProps {
  itemList: any[];
  itemListStyle: CSSProperties;
  direction: RapidCheckboxListFormInputRockConfig["direction"];
  itemListClassName?: string;
  listTextFormat?: string;
  listTextFieldName?: string;
  listValueFieldName?: string;
}

function CheckboxList(props: CheckboxListProps) {
  const { itemList } = props;
  const direction = props.direction || "horizontal";
  return (
    <div style={props.itemListStyle} className={props.itemListClassName}>
      {itemList.map((item, index) => {
        const option = getCheckboxOption({
          item,
          listTextFormat: props.listTextFormat,
          listTextFieldName: props.listTextFieldName,
          listValueFieldName: props.listValueFieldName,
        });
        return (
          <div className={direction === "horizontal" ? "rapid-checkbox-list-item-horizontal" : "rapid-checkbox-list-item-vertical"}>
            <Checkbox key={index} value={option.value}>
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
}

function getCheckboxOption(options: GetCheckboxOptionOptions): CheckboxOptionType {
  const { item, listTextFormat, listTextFieldName, listValueFieldName } = options;
  let label: string;
  if (listTextFormat) {
    label = MoveStyleUtils.fulfillVariablesInString(listTextFormat, item);
  } else {
    label = get(item, listTextFieldName);
  }
  const value = get(item, listValueFieldName);

  return {
    label,
    value,
  };
}
