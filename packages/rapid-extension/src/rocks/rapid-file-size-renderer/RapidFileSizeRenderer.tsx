import { Rock } from "@ruiapp/move-style";
import RapidFileSizeRendererMeta from "./RapidFileSizeRendererMeta";
import { RapidFileSizeRendererProps, RapidFileSizeRendererRockConfig } from "./rapid-file-size-renderer-types";
import { isNull, isUndefined } from "lodash";
import { formatFileSize } from "../../utils/format-utility";

export function configRapidFileSizeRenderer(config: RapidFileSizeRendererRockConfig): RapidFileSizeRendererRockConfig {
  return config;
}

export function RapidFileSizeRenderer(props: RapidFileSizeRendererProps) {
  const { value, decimalPlaces, defaultText } = props;
  if (isUndefined(value) || isNull(value)) {
    return defaultText || "";
  }

  return formatFileSize(value, decimalPlaces || 2);
}

export default {
  Renderer(context, props: RapidFileSizeRendererRockConfig) {
    return RapidFileSizeRenderer(props);
  },
  ...RapidFileSizeRendererMeta,
} as Rock<RapidFileSizeRendererRockConfig>;
