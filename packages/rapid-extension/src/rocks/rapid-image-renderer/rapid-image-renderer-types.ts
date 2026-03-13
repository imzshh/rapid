import { RockConfig } from "@ruiapp/move-style";
import { RapidFileInfo } from "../rapid-uploader-form-input/rapid-uploader-form-input-types";
import { CSSProperties } from "react";

export const RAPID_IMAGE_RENDERER_ROCK_TYPE = "rapidImageRenderer" as const;

export interface RapidImageRendererProps {
  value?: RapidFileInfo | RapidFileInfo[] | null;
  preview?: boolean;
  height?: number | string;
  width?: number | string;
  fallback?: string;
  alt?: string;
  style?: CSSProperties;
  className?: string;
}

export type RapidImageRendererRockConfig = RockConfig<RapidImageRendererProps, typeof RAPID_IMAGE_RENDERER_ROCK_TYPE>;
