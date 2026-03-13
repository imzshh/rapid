import { Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import RapidFileSizeRendererMeta from "./RapidFileSizeRendererMeta";
import { RapidFileSizeRendererProps, RapidFileSizeRendererRockConfig } from "./rapid-file-size-renderer-types";
import { wrapToRockComponent } from "@ruiapp/react-renderer";
import { isNull, isUndefined } from "lodash";
import { formatFileSize } from "../../utils/format-utility";

export function configRapidFileSizeRenderer(config: RockComponentProps<RapidFileSizeRendererRockConfig>): RapidFileSizeRendererRockConfig {
  config.$type = RapidFileSizeRendererMeta.$type;
  return config as RapidFileSizeRendererRockConfig;
}

export function RapidFileSizeRendererComponent(props: RockInstanceProps<RapidFileSizeRendererProps>) {
  const { value, decimalPlaces, defaultText } = props;
  if (isUndefined(value) || isNull(value)) {
    return defaultText || "";
  }

  return formatFileSize(value, decimalPlaces || 2);
}

export const RapidFileSizeRenderer = wrapToRockComponent(RapidFileSizeRendererMeta, RapidFileSizeRendererComponent);

export default {
  Renderer: RapidFileSizeRendererComponent,
  ...RapidFileSizeRendererMeta,
} as Rock<RapidFileSizeRendererRockConfig>;
