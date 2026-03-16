import { RockMeta } from "@ruiapp/move-style";
import { RAPID_FORM_ITEM_ROCK_TYPE } from "./rapid-form-item-types";

export default {
  $type: RAPID_FORM_ITEM_ROCK_TYPE,

  propertyPanels: [
    {
      $type: "componentPropPanel",
      setters: [
        {
          $type: "textPropSetter",
          label: "code",
          propName: "code",
        },

        {
          $type: "textPropSetter",
          label: "label",
          propName: "label",
        },

        {
          $type: "numberPropSetter",
          label: "span",
          propName: "span",
          defaultValue: 1,
        },

        {
          $type: "switchPropSetter",
          label: "ellipsis",
          propName: "ellipsis",
        },
      ],
    },
  ],
} as RockMeta<typeof RAPID_FORM_ITEM_ROCK_TYPE>;
