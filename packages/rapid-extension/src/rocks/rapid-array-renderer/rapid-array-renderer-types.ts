import type { ContainerRockConfig, RockConfig } from "@ruiapp/move-style";
import type { ReactNode } from "react";

export const RAPID_ARRAY_RENDERER_ROCK_TYPE = "rapidArrayRenderer" as const;

export interface RapidArrayRendererProps {
  value?: any[] | null;
  defaultText?: string;
  format?: string;
  item?: (value: any, index: number) => ReactNode;
  separator?: () => ReactNode;
  noSeparator?: boolean;
  listContainer?: (children: ReactNode[]) => ReactNode;
  itemContainer?: (children: ReactNode, value: any, index: number) => ReactNode;
}

export type RapidArrayRendererRockConfig = RockConfig<
  Omit<RapidArrayRendererProps, "item" | "separator" | "listContainer" | "itemContainer"> & {
    item?: RockConfig | RapidArrayRendererProps["item"];
    separator?: RockConfig | RapidArrayRendererProps["separator"];
    listContainer?: ContainerRockConfig | RapidArrayRendererProps["listContainer"];
    itemContainer?: ContainerRockConfig | RapidArrayRendererProps["itemContainer"];
  },
  typeof RAPID_ARRAY_RENDERER_ROCK_TYPE
>;
