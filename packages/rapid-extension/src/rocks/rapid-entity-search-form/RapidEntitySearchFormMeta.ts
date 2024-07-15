import type { RockMeta } from "@ruiapp/move-style";
import RapidForm from "../rapid-form/RapidForm";

export default {
  $type: "rapidEntitySearchForm",

  slots: {
    ...RapidForm.slots,
  },

  propertyPanels: [...RapidForm.propertyPanels!],
} as RockMeta;
