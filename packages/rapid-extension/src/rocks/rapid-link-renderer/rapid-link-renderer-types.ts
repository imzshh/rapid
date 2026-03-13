import { RockConfig } from "@ruiapp/move-style";

export const RAPID_LINK_RENDERER_ROCK_TYPE = "rapidLinkRenderer" as const;

export interface RapidLinkRendererProps {
  value: Record<string, any> | null | undefined;
  defaultText?: string;
  text?: string;
  url?: string;
}

export type RapidLinkRendererRockConfig = RockConfig<RapidLinkRendererProps, typeof RAPID_LINK_RENDERER_ROCK_TYPE>;
