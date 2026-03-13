import { RockMeta } from "@ruiapp/move-style";
import { RAPID_IMAGE_RENDERER_ROCK_TYPE } from "./rapid-image-renderer-types";

export default {
  $type: RAPID_IMAGE_RENDERER_ROCK_TYPE,

  propertyPanels: [
    {
      $type: "componentPropPanel",
      setters: [
        {
          $type: "switchPropSetter",
          label: "preview",
          propName: "preview",
          defaultValue: true,
        },
      ],
    },
  ],
} as RockMeta<typeof RAPID_IMAGE_RENDERER_ROCK_TYPE>;
