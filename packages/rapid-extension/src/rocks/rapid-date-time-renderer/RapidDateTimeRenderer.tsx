import { Rock } from "@ruiapp/move-style";
import RapidDateTimeRendererMeta from "./RapidDateTimeRendererMeta";
import { RapidDateTimeRendererProps, RapidDateTimeRendererRockConfig } from "./rapid-date-time-renderer-types";
import dayjs from "dayjs";

export function configRapidDateTimeRenderer(config: RapidDateTimeRendererRockConfig): RapidDateTimeRendererRockConfig {
  return config;
}

export function RapidDateTimeRenderer(props: RapidDateTimeRendererProps) {
  const { value, format } = props;
  const dateTime = dayjs(value);
  if (!dateTime.isValid()) {
    return "-";
  }
  return dateTime.format(format || "YYYY-MM-DD HH:mm:ss");
}

export default {
  $type: "rapidDateTimeRenderer",
  Renderer(context, props: RapidDateTimeRendererRockConfig) {
    return RapidDateTimeRenderer(props);
  },
  ...RapidDateTimeRendererMeta,
} as Rock<RapidDateTimeRendererRockConfig>;
