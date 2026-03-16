import type { RockChildrenConfig, RockComponentProps, RockConfig, RockExpsConfig, RockI18nConfig, RockLocalesConfig } from "@ruiapp/move-style";
import type { RapidFieldType } from "@ruiapp/rapid-common";
import type { CSSProperties, ReactNode } from "react";
import type { RapidPropertyDisplayType } from "~/types/rapid-extension-types";

export const RAPID_DESCRIPTIONS_ITEM_ROCK_TYPE = "rapidDescriptionsItem" as const;

export type RapidDescriptionsItemProps = {
  type?: RapidPropertyDisplayType;

  valueFieldType?: RapidFieldType;

  valueFieldName?: string;

  multipleValues?: boolean;

  code: string;

  uniqueKey?: string;

  label?: string;

  labelStyle?: CSSProperties;

  contentStyle?: CSSProperties;

  column?: number;

  value?: any;

  placeholder?: string;

  defaultValue?: any;

  rendererType?: string;

  rendererProps?: Record<string, any>;

  hidden?: boolean;

  children?: ReactNode;
};

export type RapidDescriptionsItemRockConfig = RockConfig<
  Omit<RapidDescriptionsItemProps, "children"> & {
    children?: RockChildrenConfig;
  },
  typeof RAPID_DESCRIPTIONS_ITEM_ROCK_TYPE
>;

export type RapidDescriptionsItemConfig = RockComponentProps<RapidDescriptionsItemRockConfig>;
