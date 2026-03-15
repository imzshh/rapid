import type { RockConfig } from "@ruiapp/move-style";
import { RapidRecordActionBase } from "~/types/rapid-action-types";

export const SONIC_RECORD_ACTION_DELETE_ENTITY_ROCK_TYPE = "sonicRecordActionDeleteEntity" as const;

export interface SonicRecordActionDeleteEntityProps extends Omit<RapidRecordActionBase, "actionEventName" | "$type"> {}

export type SonicRecordActionDeleteEntityRockConfig = RockConfig<SonicRecordActionDeleteEntityProps, typeof SONIC_RECORD_ACTION_DELETE_ENTITY_ROCK_TYPE>;
