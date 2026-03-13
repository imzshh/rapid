import { Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import RapidTimePickerMeta from "./RapidTimePickerMeta";
import { wrapToRockComponent } from "@ruiapp/react-renderer";
import { RapidTimePickerProps, RapidTimePickerRockConfig } from "./rapid-time-picker-types";
import { TimePicker } from "antd";
import { isString } from "lodash";
import moment from "moment";

export function configRapidTimePicker(config: RockComponentProps<RapidTimePickerRockConfig>): RapidTimePickerRockConfig {
  config.$type = RapidTimePickerMeta.$type;
  return config as RapidTimePickerRockConfig;
}

export function RapidTimePickerComponent(props: RockInstanceProps<RapidTimePickerProps>) {
  let { value, onChange } = props;

  if (isString(value)) {
    value = moment(moment().format("YYYY-MM-DD") + " " + value);
  }

  function handleChange(time: moment.Moment | null) {
    if (!onChange) {
      return;
    }

    if (!time) {
      onChange(null);
      return;
    }

    const formattedValue = time.format("HH:mm:ss");
    onChange(formattedValue);
  }

  return <TimePicker value={value as moment.Moment} onChange={handleChange} />;
}

export const RapidTimePicker = wrapToRockComponent(RapidTimePickerMeta, RapidTimePickerComponent);

export default {
  Renderer: RapidTimePickerComponent,
  ...RapidTimePickerMeta,
} as Rock<RapidTimePickerRockConfig>;
