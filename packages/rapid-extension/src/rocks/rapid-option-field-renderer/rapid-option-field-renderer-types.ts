import type { ContainerRockConfig, RockConfig } from "@ruiapp/move-style";
import type { ReactNode } from "react";

export const RAPID_OPTION_FIELD_RENDERER_ROCK_TYPE = "rapidOptionFieldRenderer" as const;

export interface RapidOptionFieldRendererProps {
  dictionaryCode: string;
  value?: any;
  item?: (value: any, index: number) => ReactNode;
  separator?: () => ReactNode;
  noSeparator?: boolean;
  listContainer?: (children: ReactNode[]) => ReactNode;
  itemContainer?: (children: ReactNode, value: any, index: number) => ReactNode;
}

export type RapidOptionFieldRendererRockConfig = RockConfig<
  Omit<RapidOptionFieldRendererProps, "item" | "separator" | "listContainer" | "itemContainer"> & {
    item?: RockConfig;
    separator?: RockConfig;
    listContainer?: ContainerRockConfig;
    itemContainer?: ContainerRockConfig;
  },
  typeof RAPID_OPTION_FIELD_RENDERER_ROCK_TYPE
>;
