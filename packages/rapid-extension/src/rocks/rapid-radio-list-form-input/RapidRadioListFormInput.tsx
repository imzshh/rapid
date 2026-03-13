import { MoveStyleUtils, Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import { Radio, Space } from "antd";
import { RapidRadioListFormInputProps, RapidRadioListFormInputRockConfig } from "./rapid-radio-list-form-input-types";
import RapidRadioListFormInputMeta from "./RapidRadioListFormInputMeta";
import { useRockInstanceContext, wrapToRockComponent } from "@ruiapp/react-renderer";
import { get, isObject, map } from "lodash";
import type { RadioGroupProps } from "antd/lib/radio";
import React, { useMemo } from "react";

export function configRapidRadioListFormInput(config: RockComponentProps<RapidRadioListFormInputRockConfig>): RapidRadioListFormInputRockConfig {
  config.$type = RapidRadioListFormInputMeta.$type;
  return config as RapidRadioListFormInputRockConfig;
}

export function RapidRadioListFormInputComponent(props: RockInstanceProps<RapidRadioListFormInputProps>) {
  const context = useRockInstanceContext();
  const { scope } = context;
  const { listTextFormat, direction = "horizontal" } = props;

  let listItems = [];
  if (props.listDataSourceCode) {
    listItems = scope.stores[props.listDataSourceCode]?.data?.list || [];
  } else {
    listItems = props.listItems || props.listDataSource?.data?.list || [];
  }

  const listTextFieldName = props.listTextFieldName || "name";
  const listValueFieldName = props.listValueFieldName || "id";

  function getRadioOption(item: any): { label: string; value: string } {
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

  let selectedValue: string | string[];
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

  const antdProps: RadioGroupProps = {
    disabled: props.disabled,
    value: selectedValue,
    onChange: props.onChange,
    style: { width: "100%" },
  };

  const radioList = useMemo(() => {
    return (
      <Space direction={direction}>
        {listItems.map((item, index) => {
          const option = getRadioOption(item);
          return (
            <Radio key={index} value={option.value}>
              {option.label}
            </Radio>
          );
        })}
      </Space>
    );
  }, [listItems, direction, listTextFormat, listTextFieldName, listValueFieldName]);

  return <Radio.Group {...antdProps}>{radioList}</Radio.Group>;
}

export const RapidRadioListFormInput = wrapToRockComponent(RapidRadioListFormInputMeta, RapidRadioListFormInputComponent);

export default {
  Renderer: RapidRadioListFormInputComponent,
  ...RapidRadioListFormInputMeta,
} as Rock<RapidRadioListFormInputRockConfig>;
