import type { RockConfig } from "@ruiapp/move-style";

export const RAPID_FILE_SIZE_RENDERER_ROCK_TYPE = "rapidFileSizeRenderer" as const;

export interface RapidFileSizeRendererProps {
  value: number;
  defaultText?: string;
  /**
   * 小数点位数
   */
  decimalPlaces?: number;
}

export type RapidFileSizeRendererRockConfig = RockConfig<RapidFileSizeRendererProps, typeof RAPID_FILE_SIZE_RENDERER_ROCK_TYPE>;
