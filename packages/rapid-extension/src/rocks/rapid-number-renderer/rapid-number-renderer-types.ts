import type { RockConfig } from "@ruiapp/move-style";

export const RAPID_NUMBER_RENDERER_ROCK_TYPE = "rapidNumberRenderer" as const;
export interface RapidNumberRendererProps {
  value: string | number | null | undefined;
  defaultText?: string;

  /**
   * 使用千分位分隔符
   */
  usingThousandSeparator?: boolean;

  /**
   * 小数点位数
   */
  decimalPlaces?: number;

  /**
   * 舍入模式
   */
  roundingMode?: "halfExpand" | "floor" | "ceil";

  /**
   * 单位系数，默认为 1。
   */
  conversionCoefficient?: number;
}

export type RapidNumberRendererRockConfig = RockConfig<RapidNumberRendererProps, typeof RAPID_NUMBER_RENDERER_ROCK_TYPE>;
