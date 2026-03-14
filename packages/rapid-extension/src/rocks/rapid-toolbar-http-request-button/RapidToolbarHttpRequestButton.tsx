import {
  fireEvent,
  type HttpRequestOptions,
  type Rock,
  type RockComponentProps,
  type RockEventHandlerConfig,
  type RockInstanceProps,
} from "@ruiapp/move-style";
import RapidToolbarHttpRequestButtonMeta from "./RapidToolbarHttpRequestButtonMeta";
import { useRockInstanceContext, wrapToRockComponent } from "@ruiapp/react-renderer";
import type { RapidToolbarHttpRequestButtonProps, RapidToolbarHttpRequestButtonRockConfig } from "./rapid-toolbar-http-request-button-types";
import { omit, pick } from "lodash";
import { getExtensionLocaleStringResource } from "../../helpers/i18nHelper";
import { RapidToolbarButtonComponent } from "../rapid-toolbar-button/RapidToolbarButton";

export function configRapidToolbarHttpRequestButton(
  config: RockComponentProps<RapidToolbarHttpRequestButtonRockConfig>,
): RapidToolbarHttpRequestButtonRockConfig {
  config.$type = RapidToolbarHttpRequestButtonMeta.$type;
  return config as RapidToolbarHttpRequestButtonRockConfig;
}

export function RapidToolbarHttpRequestButtonComponent(props: RockInstanceProps<RapidToolbarHttpRequestButtonProps>) {
  const context = useRockInstanceContext();
  const { framework, page, scope } = context;

  const httpRequestPropNames: (keyof HttpRequestOptions)[] = ["method", "url", "urlParams", "query", "data", "headers", "onError", "onSuccess"];
  const httpRequestProps = pick(props, httpRequestPropNames) as Pick<HttpRequestOptions, (typeof httpRequestPropNames)[number]> & {
    onSuccess?: RockEventHandlerConfig;
    onError?: RockEventHandlerConfig;
  };
  const buttonProps = omit(props, httpRequestPropNames);

  if (!httpRequestProps.onSuccess) {
    httpRequestProps.onSuccess = [
      {
        $action: "antdToast",
        type: "info",
        content: getExtensionLocaleStringResource(framework, "operateSuccess"),
      },
    ];
  }
  if (!httpRequestProps.onError) {
    httpRequestProps.onError = [
      {
        $action: "antdToast",
        type: "error",
        $exps: {
          content: `'${getExtensionLocaleStringResource(framework, "operateError")} ' + $event.args[0].message`,
        },
      },
    ];
  }

  const handleAction = async () => {
    await fireEvent({
      eventName: "onAction",
      framework,
      page,
      scope,
      sender: props,
      senderCategory: "component",
      eventHandlers: [
        {
          $action: "sendHttpRequest",
          ...httpRequestProps,
        },
      ],
      eventArgs: [],
    });
  };

  return <RapidToolbarButtonComponent {...buttonProps} onAction={handleAction} />;
}

export const RapidToolbarHttpRequestButton = wrapToRockComponent(RapidToolbarHttpRequestButtonMeta, RapidToolbarHttpRequestButtonComponent);

export default {
  Renderer: RapidToolbarHttpRequestButtonComponent,
  ...RapidToolbarHttpRequestButtonMeta,
} as Rock<RapidToolbarHttpRequestButtonRockConfig>;
