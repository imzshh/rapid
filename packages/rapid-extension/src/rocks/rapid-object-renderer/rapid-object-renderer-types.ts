import type { RockConfig } from "@ruiapp/move-style";

export const RAPID_OBJECT_RENDERER_ROCK_TYPE = "rapidObjectRenderer" as const;

export interface RapidPropertyRenderConfig {
  /**
   * 属性Code/字段名
   */
  code: string;

  /**
   * 标签文字
   */
  label?: string;

  /**
   * 展示值的渲染器类型
   */
  rendererType?: string;

  /**
   * 展示值的渲染器属性
   */
  rendererProps?: Record<string, any>;
}

export interface RapidObjectRendererProps {
  value?: Record<string, any> | null;
  defaultText?: string;
  format?: string;
  items?: RapidPropertyRenderConfig[];
}

export type RapidObjectRendererRockConfig = RockConfig<RapidObjectRendererProps, typeof RAPID_OBJECT_RENDERER_ROCK_TYPE>;
