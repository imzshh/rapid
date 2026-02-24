import type { SimpleRockConfig } from "@ruiapp/move-style";

export interface RapidDateTimeRendererProps {
  value: any;
  format: string;
}

export interface RapidDateTimeRendererRockConfig extends SimpleRockConfig, RapidDateTimeRendererProps {}
