import type { RockConfig } from "@ruiapp/move-style";
import { RapidToolbarButtonProps } from "../rapid-toolbar-button/rapid-toolbar-button-types";

export const SONIC_RECORD_ACTION_UPDATE_ENTITY_ROCK_TYPE = "sonicRecordActionUpdateEntity" as const;

export interface SonicRecordActionUpdateEntityProps extends Omit<RapidToolbarButtonProps, "actionEventName"> {
  entity?: Record<string, any>;
}

export type SonicRecordActionUpdateEntityRockConfig = RockConfig<SonicRecordActionUpdateEntityProps, typeof SONIC_RECORD_ACTION_UPDATE_ENTITY_ROCK_TYPE>;
