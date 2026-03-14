import type { RockConfig, RockEventHandlerConfig } from "@ruiapp/move-style";

export const RAPID_TOOLBAR_LINK_ROCK_TYPE = "rapidToolbarLink" as const;

export interface RapidToolbarLinkProps {
  code?: string;
  icon?: string;
  text?: string;
  disabled?: boolean;
  tooltipTitle?: string;
  tooltipColor?: string;
  actionEventName?: string;
  confirmTitle?: string;
  confirmText?: string;
  recordId?: string;
  onAction?: () => Promise<void> | void;
  actionStyle?: "default" | "primary" | "dashed" | "text" | "link";
  danger?: boolean;
  ghost?: boolean;
  size?: "small" | "middle" | "large";
  url: string;
  target?: string;
}

export type RapidToolbarLinkRockConfig = RockConfig<
  Omit<RapidToolbarLinkProps, "onAction"> & {
    onAction?: RockEventHandlerConfig;
  },
  typeof RAPID_TOOLBAR_LINK_ROCK_TYPE
>;
