import { Rock, SimpleRockConfig } from "@ruiapp/move-style";
import RapidBoolRendererMeta from "./RapidBoolRendererMeta";
import { getExtensionLocaleStringResource } from "../../helpers/i18nHelper";

export interface RapidBoolRendererProps {
  value: boolean | null | undefined;
  strictEquals?: boolean;
  trueText?: string;
  falseText?: string;
  defaultText?: string;
}

export interface RapidBoolRendererRockConfig extends SimpleRockConfig, RapidBoolRendererProps {}

export function configRapidBoolRenderer(config: RapidBoolRendererRockConfig): RapidBoolRendererRockConfig {
  return config;
}

export default {
  $type: "rapidBoolRenderer",

  Renderer(context, props: RapidBoolRendererRockConfig) {
    const { framework } = context;
    const { value, strictEquals, trueText, falseText, defaultText } = props;
    if (strictEquals) {
      if (value === true) {
        return trueText || getExtensionLocaleStringResource(framework, "boolTrue");
      } else if (value === false) {
        return falseText || getExtensionLocaleStringResource(framework, "boolFalse");
      } else {
        return defaultText || "";
      }
    } else {
      if (value) {
        return trueText || getExtensionLocaleStringResource(framework, "boolTrue");
      } else {
        return falseText || getExtensionLocaleStringResource(framework, "boolFalse");
      }
    }
  },

  ...RapidBoolRendererMeta,
} as Rock;
