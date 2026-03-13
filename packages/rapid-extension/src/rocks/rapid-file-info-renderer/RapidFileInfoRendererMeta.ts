import { RockMeta } from "@ruiapp/move-style";
import { RAPID_FILE_INFO_RENDERER_ROCK_TYPE } from "./rapid-file-info-renderer-types";

export default {
  $type: RAPID_FILE_INFO_RENDERER_ROCK_TYPE,

  propertyPanels: [
    {
      $type: "componentPropPanel",
      setters: [
        {
          $type: "switchPropSetter",
          label: "showFileSize",
          propName: "showFileSize",
        },
      ],
    },
  ],
} as RockMeta<typeof RAPID_FILE_INFO_RENDERER_ROCK_TYPE>;
