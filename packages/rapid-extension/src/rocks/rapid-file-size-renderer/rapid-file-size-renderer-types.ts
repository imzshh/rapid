import { SimpleRockConfig } from "@ruiapp/move-style";

export interface RapidFileSizeRendererProps {
  value: number;
  defaultText?: string;
  /**
   * 小数点位数
   */
  decimalPlaces?: number;
}

export interface RapidFileSizeRendererRockConfig extends SimpleRockConfig, RapidFileSizeRendererProps {}
