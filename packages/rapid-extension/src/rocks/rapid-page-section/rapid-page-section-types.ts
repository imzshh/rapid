import type { ContainerRockConfig, RockConfig } from "@ruiapp/move-style";
import type { CSSProperties } from "react";

export const RAPID_PAGE_SECTION_ROCK_TYPE = "rapidPageSection" as const;

export interface RapidPageSectionProps {
  title?: string;
  style?: CSSProperties;
  actions?: RockConfig[];
  children?: RockConfig | RockConfig[];
}

export type RapidPageSectionRockConfig = ContainerRockConfig<RapidPageSectionProps, typeof RAPID_PAGE_SECTION_ROCK_TYPE>;
