import { Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import RapidDateTimeRendererMeta from "./RapidDateTimeRendererMeta";
import { RapidDateTimeRendererProps, RapidDateTimeRendererRockConfig } from "./rapid-date-time-renderer-types";
import { wrapToRockComponent } from "@ruiapp/react-renderer";
import dayjs from "dayjs";

export function configRapidDateTimeRenderer(config: RockComponentProps<RapidDateTimeRendererRockConfig>): RapidDateTimeRendererRockConfig {
  config.$type = RapidDateTimeRendererMeta.$type;
  return config as RapidDateTimeRendererRockConfig;
}

export function RapidDateTimeRendererComponent(props: RockInstanceProps<RapidDateTimeRendererProps>) {
  const { value, format } = props;
  const dateTime = dayjs(value);
  if (!dateTime.isValid()) {
    return "-";
  }
  return dateTime.format(format || "YYYY-MM-DD HH:mm:ss");
}

export const RapidDateTimeRenderer = wrapToRockComponent(RapidDateTimeRendererMeta, RapidDateTimeRendererComponent);

export default {
  Renderer: RapidDateTimeRendererComponent,
  ...RapidDateTimeRendererMeta,
} as Rock<RapidDateTimeRendererRockConfig>;
