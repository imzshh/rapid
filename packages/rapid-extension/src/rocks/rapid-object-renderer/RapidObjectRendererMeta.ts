import type { RockMeta } from "@ruiapp/move-style";
import { RAPID_OBJECT_RENDERER_ROCK_TYPE } from "./rapid-object-renderer-types";

export default {
  $type: RAPID_OBJECT_RENDERER_ROCK_TYPE,

  propertyPanels: [
    {
      $type: "componentPropPanel",
      setters: [
        {
          $type: "textPropSetter",
          label: "format",
          propName: "format",
        },
        {
          $type: "textPropSetter",
          label: "defaultText",
          propName: "defaultText",
        },
      ],
    },
  ],
} as RockMeta<typeof RAPID_OBJECT_RENDERER_ROCK_TYPE>;
