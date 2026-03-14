import { fireEvent, HttpRequestOptions, Rock, RockInstance } from "@ruiapp/move-style";
import RapidToolbarHttpRequestButtonMeta from "./RapidToolbarHttpRequestButtonMeta";
import { genRockRenderer } from "@ruiapp/react-renderer";
import { RapidToolbarHttpRequestButtonProps, RapidToolbarHttpRequestButtonRockConfig } from "./rapid-toolbar-http-request-button-types";
import { omit, pick } from "lodash";
import { getExtensionLocaleStringResource } from "../../helpers/i18nHelper";
import { RapidToolbarButtonComponent } from "../rapid-toolbar-button/RapidToolbarButton";

export function configRapidToolbarHttpRequestButton(config: RapidToolbarHttpRequestButtonRockConfig): RapidToolbarHttpRequestButtonRockConfig {
  return config;
}

export function RapidToolbarHttpRequestButton(props: RapidToolbarHttpRequestButtonProps) {
  const { _context: context } = props as any as RockInstance;
  const { framework, page, scope } = context;

  const httpRequestPropNames: (keyof HttpRequestOptions)[] = ["method", "url", "urlParams", "query", "data", "headers", "onError", "onSuccess"];
  const httpRequestProps = pick(props, httpRequestPropNames);
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

export default {
  Renderer: genRockRenderer(RapidToolbarHttpRequestButtonMeta.$type, RapidToolbarHttpRequestButton, true),
  ...RapidToolbarHttpRequestButtonMeta,
} as Rock<RapidToolbarHttpRequestButtonRockConfig>;
