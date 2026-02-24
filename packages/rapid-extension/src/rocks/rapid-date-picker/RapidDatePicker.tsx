import { Rock } from "@ruiapp/move-style";
import RapidDatePickerMeta from "./RapidDatePickerMeta";
import { genRockRenderer } from "@ruiapp/react-renderer";
import { RapidDatePickerProps, RapidDatePickerRockConfig } from "./rapid-date-picker-types";
import { DatePicker } from "antd";
import { isString } from "lodash";
import moment from "moment";

export function configRapidDatePicker(config: RapidDatePickerRockConfig): RapidDatePickerRockConfig {
  return config;
}

export function RapidDatePicker(props: RapidDatePickerProps) {
  let { value, onChange, picker } = props;

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

    let formattedValue: string;
    switch (picker) {
      case "year":
        formattedValue = date.format("YYYY");
        break;
      case "month":
        formattedValue = date.format("YYYY-MM");
        break;
      default:
        formattedValue = date.format("YYYY-MM-DD");
        break;
    }
    onChange(formattedValue);
  }

  return <DatePicker value={value as moment.Moment} onChange={handleChange} picker={picker} showTime={false} />;
}

export default {
  Renderer: genRockRenderer(RapidDatePickerMeta.$type, RapidDatePicker),

  ...RapidDatePickerMeta,
} as Rock<RapidDatePickerRockConfig>;
