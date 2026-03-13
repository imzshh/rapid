import type { RockConfig } from "@ruiapp/move-style";
import { CSSProperties } from "react";

export const RAPID_SECRET_TEXT_RENDERER_ROCK_TYPE = "rapidSecretTextRenderer" as const;

export interface RapidSecretTextRendererProps {
  value: string | null | undefined;
  canViewOrigin?: boolean;
  canCopy?: boolean;
  style?: CSSProperties;
  iconStyle?: CSSProperties;
  tooltipShowOrigin?: string;
  tooltipHideOrigin?: string;
  tooltipCopy?: string;
  messageCopySuccess?: string;
}

export type RapidSecretTextRendererRockConfig = RockConfig<RapidSecretTextRendererProps, typeof RAPID_SECRET_TEXT_RENDERER_ROCK_TYPE>;
