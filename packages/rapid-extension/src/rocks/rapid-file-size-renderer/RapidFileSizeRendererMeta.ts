import { RockMeta } from "@ruiapp/move-style";
import { RAPID_FILE_SIZE_RENDERER_ROCK_TYPE } from "./rapid-file-size-renderer-types";

export default {
  $type: RAPID_FILE_SIZE_RENDERER_ROCK_TYPE,

  propertyPanels: [
    {
      $type: "componentPropPanel",
      setters: [
        {
          $type: "textPropSetter",
          label: "defaultText",
          propName: "defaultText",
        },

        {
          $type: "numberPropSetter",
          label: "decimalPlaces",
          propName: "decimalPlaces",
        },
      ],
    },
  ],
} as RockMeta<typeof RAPID_FILE_SIZE_RENDERER_ROCK_TYPE>;
