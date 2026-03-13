import type { RockConfig } from "@ruiapp/move-style";
import type { ReactNode } from "react";

export const RAPID_REFERENCE_RENDERER_ROCK_TYPE = "rapidReferenceRenderer" as const;

export interface RapidReferenceRendererProps {
  value?: any;
  list?: Record<string, any>[];
  valueFieldName: string;
  textFieldName: string;
  itemRenderer?: (value: any) => ReactNode;
}

export type RapidReferenceRendererRockConfig = RockConfig<
  Omit<RapidReferenceRendererProps, "itemRenderer"> & {
    itemRenderer?: RockConfig;
  },
  typeof RAPID_REFERENCE_RENDERER_ROCK_TYPE
>;
