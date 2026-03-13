import type { RockConfig, RockEventHandlerConfig } from "@ruiapp/move-style";
import type { RapidRecordActionBase } from "../../types/rapid-action-types";

export const RAPID_TABLE_ACTION_ROCK_TYPE = "rapidTableAction" as const;

export interface RapidTableActionProps extends Omit<RapidRecordActionBase, "$type" | "onAction"> {
  disabledTooltipText?: string;
  disabled?: boolean;
  url?: string;

  onAction?: (args: { record: Record<string, any>; recordId: string }) => Promise<void> | void;
}

export type RapidTableActionRockConfig = RockConfig<
  Omit<RapidTableActionProps, "onAction"> & { onAction?: RockEventHandlerConfig },
  typeof RAPID_TABLE_ACTION_ROCK_TYPE
>;
