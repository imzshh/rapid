import { RockMeta } from "@ruiapp/move-style";
import { RAPID_DATE_TIME_RENDERER_ROCK_TYPE } from "./rapid-date-time-renderer-types";

export default {
  $type: RAPID_DATE_TIME_RENDERER_ROCK_TYPE,

  propertyPanels: [
    {
      $type: "componentPropPanel",
      setters: [
        {
          $type: "textPropSetter",
          label: "format",
          propName: "format",
        },
      ],
    },
  ],
} as RockMeta<typeof RAPID_DATE_TIME_RENDERER_ROCK_TYPE>;
