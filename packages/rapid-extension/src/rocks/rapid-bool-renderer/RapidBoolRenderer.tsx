import { Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import RapidBoolRendererMeta from "./RapidBoolRendererMeta";
import { RapidBoolRendererRockConfig } from "./rapid-bool-renderer-types";
import { getExtensionLocaleStringResource } from "../../helpers/i18nHelper";
import { useRockInstanceContext, wrapToRockComponent } from "@ruiapp/react-renderer";

export function configRapidBoolRenderer(config: RockComponentProps<RapidBoolRendererRockConfig>): RapidBoolRendererRockConfig {
  config.$type = RapidBoolRendererMeta.$type;
  return config as RapidBoolRendererRockConfig;
}

export function RapidBoolRendererComponent(props: RockInstanceProps<RapidBoolRendererRockConfig>) {
  const context = useRockInstanceContext();
  const { framework } = context;
  const { value, strictEquals, trueText, falseText, defaultText } = props;

  let text = "";
  if (strictEquals) {
    if (value === true) {
      text = trueText || getExtensionLocaleStringResource(framework, "boolTrue");
    } else if (value === false) {
      text = falseText || getExtensionLocaleStringResource(framework, "boolFalse");
    } else {
      text = defaultText || "";
    }
  } else {
    if (value) {
      text = trueText || getExtensionLocaleStringResource(framework, "boolTrue");
    } else {
      text = falseText || getExtensionLocaleStringResource(framework, "boolFalse");
    }
  }

  return text;
}

export const RapidBoolRenderer = wrapToRockComponent(RapidBoolRendererMeta, RapidBoolRendererComponent);

export default {
  Renderer: RapidBoolRendererComponent,
  ...RapidBoolRendererMeta,
} as Rock<RapidBoolRendererRockConfig>;
