import type { RockConfig } from "@ruiapp/move-style";
import type { RapidFieldType } from "@ruiapp/rapid-common";
import type { CSSProperties, ReactNode } from "react";

export const RAPID_DESCRIPTIONS_RENDERER_ROCK_TYPE = "rapidDescriptionsRenderer" as const;

export interface RapidDescriptionsItemRenderConfig {
  /**
   * 属性Code/字段名
   */
  code: string;

  /**
   * 标签文字
   */
  label?: string;

  /**
   * 值的类型
   */
  valueFieldType?: RapidFieldType;

  /**
   * 展示值的渲染器类型
   */
  rendererType?: string;

  /**
   * 展示值的渲染器属性
   */
  rendererProps?: Record<string, any>;

  /**
   * 是否隐藏
   */
  hidden?: boolean;

  /**
   * label样式
   */
  labelStyle?: CSSProperties;

  /**
   * content样式
   */
  contentStyle?: CSSProperties;

  /**
   * 跨越的列数
   */
  column?: number;

  /**
   * 唯一标识
   */
  uniqueKey?: string;

  /**
   * 值字段名
   */
  valueFieldName?: string;

  /**
   * 类型
   */
  type?: string;

  /**
   * 多值
   */
  multipleValues?: boolean;

  /**
   * 值
   */
  value?: any;

  /**
   * 表单
   */
  form?: {
    getFieldValue: (name: string) => any;
  };

  /**
   * i18n配置
   */
  $i18n?: any;

  /**
   * 本地化配置
   */
  $locales?: any;

  /**
   * 隐藏
   */
  _hidden?: boolean;
}

export interface RapidDescriptionsRendererProps {
  value: Record<string, any> | null | undefined;

  defaultText?: string;

  /**
   * 描述列表的标题，显示在最顶部
   */
  title?: string;

  /**
   * 布局
   */
  layout?: "horizontal" | "vertical";

  /**
   * 大小
   */
  size?: "default" | "middle" | "small";

  /**
   * 是否展示边框
   */
  bordered?: boolean;

  /**
   * 是否显示冒号
   */
  colon?: boolean;

  /**
   * 栏数
   */
  column?: number;

  /**
   * label样式
   */
  labelStyle?: CSSProperties;

  /**
   * 描述列表项配置
   */
  items: RapidDescriptionsItemRenderConfig[];

  /**
   * 额外内容渲染
   */
  extra?: () => ReactNode;
}

export type RapidDescriptionsRendererRockConfig = RockConfig<
  Omit<RapidDescriptionsRendererProps, "extra"> & {
    extra?: RockConfig;
  },
  typeof RAPID_DESCRIPTIONS_RENDERER_ROCK_TYPE
>;
