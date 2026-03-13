import { RockMeta } from "@ruiapp/move-style";
import { RAPID_JSON_RENDERER_ROCK_TYPE } from "./rapid-json-renderer-types";

export default {
  $type: RAPID_JSON_RENDERER_ROCK_TYPE,

  propertyPanels: [
    {
      $type: "componentPropPanel",
      setters: [
        {
          $type: "jsonPropSetter",
          label: "value",
          propName: "value",
        },

        {
          $type: "textPropSetter",
          label: "defaultText",
          propName: "defaultText",
        },
      ],
    },
  ],
} as RockMeta<typeof RAPID_JSON_RENDERER_ROCK_TYPE>;
