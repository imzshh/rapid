import { RockMeta } from "@ruiapp/move-style";
import { RAPID_LINK_RENDERER_ROCK_TYPE } from "./rapid-link-renderer-types";

export default {
  $type: RAPID_LINK_RENDERER_ROCK_TYPE,

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
          $type: "textPropSetter",
          label: "text",
          propName: "text",
        },
        {
          $type: "textPropSetter",
          label: "url",
          propName: "url",
        },
      ],
    },
  ],
} as RockMeta<typeof RAPID_LINK_RENDERER_ROCK_TYPE>;
