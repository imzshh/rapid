import type { RockMeta } from "@ruiapp/move-style";
import { RAPID_ARRAY_RENDERER_ROCK_TYPE } from "./rapid-array-renderer-types";

export default {
  $type: RAPID_ARRAY_RENDERER_ROCK_TYPE,

  slots: {
    separator: {
      allowMultiComponents: false,
      required: false,
      toRenderProp: true,
    },
    listContainer: {
      allowMultiComponents: false,
      required: false,
      toRenderProp: true,
      argumentsToProps: true,
      argumentNames: ["children"],
    },
    itemContainer: {
      allowMultiComponents: false,
      required: false,
      toRenderProp: true,
      argumentsToProps: true,
      argumentNames: ["children", "value", "index"],
    },
    item: {
      allowMultiComponents: false,
      required: false,
      toRenderProp: true,
      argumentsToProps: true,
      argumentNames: ["value", "index"],
    },
  },

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
} as RockMeta<typeof RAPID_ARRAY_RENDERER_ROCK_TYPE>;
