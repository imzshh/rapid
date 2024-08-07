import type { SimpleRockConfig } from "@ruiapp/move-style";

export type RapidOptionFieldRendererConfig = {
  dictionaryCode: string;
  value?: any;
  arrayRendererProps?: any;
};

export interface RapidOptionFieldRendererRockConfig extends SimpleRockConfig, RapidOptionFieldRendererConfig {}
