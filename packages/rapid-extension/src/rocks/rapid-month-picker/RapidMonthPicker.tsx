import { Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import RapidMonthPickerMeta from "./RapidMonthPickerMeta";
import { wrapToRockComponent } from "@ruiapp/react-renderer";
import { RapidMonthPickerProps, RapidMonthPickerRockConfig } from "./rapid-month-picker-types";
import { DatePicker } from "antd";
import { isString } from "lodash";
import moment from "moment";

export function configRapidMonthPicker(config: RockComponentProps<RapidMonthPickerRockConfig>): RapidMonthPickerRockConfig {
  config.$type = RapidMonthPickerMeta.$type;
  return config as RapidMonthPickerRockConfig;
}

export function RapidMonthPickerComponent(props: RockInstanceProps<RapidMonthPickerProps>) {
  let { value, onChange } = props;

  // Convert string value to moment object
  if (isString(value)) {
    value = moment(value);
  }

  function handleChange(date: moment.Moment | null, dateString: string) {
    if (!onChange) {
      return;
    }

    if (!date) {
      onChange(null);
      return;
    }

    const formattedValue = date.format("YYYY-MM");
    onChange(formattedValue);
  }

  return <DatePicker value={value as moment.Moment} onChange={handleChange} picker="month" />;
}

export const RapidMonthPicker = wrapToRockComponent(RapidMonthPickerMeta, RapidMonthPickerComponent);

export default {
  Renderer: RapidMonthPickerComponent,
  ...RapidMonthPickerMeta,
} as Rock<RapidMonthPickerRockConfig>;
