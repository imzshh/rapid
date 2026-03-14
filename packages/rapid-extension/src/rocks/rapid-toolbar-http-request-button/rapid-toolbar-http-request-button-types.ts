import type { HttpRequestOptions, RockConfig, RockEventHandlerConfig } from "@ruiapp/move-style";
import type { RapidToolbarButtonProps } from "../rapid-toolbar-button/rapid-toolbar-button-types";

export const RAPID_TOOLBAR_HTTP_REQUEST_BUTTON_ROCK_TYPE = "rapidToolbarHttpRequestButton" as const;

export interface RapidToolbarHttpRequestButtonProps extends Omit<RapidToolbarButtonProps, "url">, Omit<HttpRequestOptions, "onSuccess" | "onError"> {
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

export type RapidToolbarHttpRequestButtonRockConfig = RockConfig<
  Omit<RapidToolbarHttpRequestButtonProps, "onSuccess" | "onError"> & {
    onSuccess?: RockEventHandlerConfig;
    onError?: RockEventHandlerConfig;
  },
  typeof RAPID_TOOLBAR_HTTP_REQUEST_BUTTON_ROCK_TYPE
>;
