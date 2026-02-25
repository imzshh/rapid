import { RockConfig, SimpleRockConfig } from "@ruiapp/move-style";

export interface RapidLinkRendererProps {
  value: Record<string, any> | null | undefined;

  defaultText?: string;

  text?: string | RockConfig;

  url?: string;
}

export interface RapidLinkRendererRockConfig extends SimpleRockConfig, RapidLinkRendererProps {}
