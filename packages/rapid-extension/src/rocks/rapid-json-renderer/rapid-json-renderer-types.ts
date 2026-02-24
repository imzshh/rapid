import { SimpleRockConfig } from "@ruiapp/move-style";

export interface RapidJsonRendererProps {
  value: any;
  defaultText?: string;
}

export interface RapidJsonRendererRockConfig extends SimpleRockConfig, RapidJsonRendererProps {}
