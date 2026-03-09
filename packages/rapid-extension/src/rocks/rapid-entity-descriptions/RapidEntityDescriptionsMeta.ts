import type { RockMeta } from "@ruiapp/move-style";
import RapidForm from "../rapid-form/RapidForm";
import { RAPID_ENTITY_DESCRIPTIONS_ROCK_TYPE } from "./rapid-entity-descriptions-types";

export default {
  $type: RAPID_ENTITY_DESCRIPTIONS_ROCK_TYPE,

  slots: {
    ...RapidForm.slots,
  },

  propertyPanels: [...RapidForm.propertyPanels!],
} as RockMeta;
