import type { RockMeta } from "@ruiapp/move-style";
import { SONIC_RECORD_ACTION_DELETE_ENTITY_ROCK_TYPE } from "./sonic-record-action-delete-entity-types";

export default {
  $type: SONIC_RECORD_ACTION_DELETE_ENTITY_ROCK_TYPE,

  slots: {},

  propertyPanels: [],
} as RockMeta<typeof SONIC_RECORD_ACTION_DELETE_ENTITY_ROCK_TYPE>;
