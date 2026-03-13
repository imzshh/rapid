import { RockMeta } from "@ruiapp/move-style";
import { RAPID_TEXT_RENDERER_ROCK_TYPE } from "./rapid-text-renderer-types";

export default {
  $type: RAPID_TEXT_RENDERER_ROCK_TYPE,

  propertyPanels: [
    {
      $type: "componentPropPanel",
      setters: [
        {
          $type: "textPropSetter",
          label: "defaultText",
          propName: "defaultText",
        },
      ],
    },
  ],
} as RockMeta<typeof RAPID_TEXT_RENDERER_ROCK_TYPE>;
