import { RockMeta } from "@ruiapp/move-style";
import { RAPID_SELECT_ROCK_TYPE } from "./rapid-select-types";

export default {
  $type: RAPID_SELECT_ROCK_TYPE,

  slots: {},

  propertyPanels: [
    {
      $type: "componentPropPanel",
      setters: [
        {
          $type: "textPropSetter",
          label: "placeholder",
          propName: "placeholder",
        },

        {
          $type: "switchPropSetter",
          label: "allowClear",
          propName: "allowClear",
        },

        {
          $type: "switchPropSetter",
          label: "listSearchable",
          propName: "listSearchable",
        },

        {
          $type: "selectPropSetter",
          label: "size",
          propName: "size",
          options: [
            {
              label: "large",
              value: "large",
            },
            {
              label: "middle",
              value: "middle",
            },
            {
              label: "small",
              value: "small",
            },
          ],
        },
      ],
    },
  ],
} as RockMeta<typeof RAPID_SELECT_ROCK_TYPE>;
