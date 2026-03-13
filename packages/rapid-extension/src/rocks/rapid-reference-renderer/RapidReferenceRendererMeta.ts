import { RockMeta } from "@ruiapp/move-style";
import { RAPID_REFERENCE_RENDERER_ROCK_TYPE } from "./rapid-reference-renderer-types";

export default {
  $type: RAPID_REFERENCE_RENDERER_ROCK_TYPE,

  slots: {
    itemRenderer: {
      allowMultiComponents: false,
      required: false,
      toRenderProp: true,
      argumentsToProps: true,
      argumentNames: ["value"],
    },
  },

  propertyPanels: [
    {
      $type: "componentPropPanel",
      setters: [
        {
          $type: "textPropSetter",
          label: "valueFieldName",
          propName: "valueFieldName",
        },

        {
          $type: "textPropSetter",
          label: "textFieldName",
          propName: "textFieldName",
        },
      ],
    },
  ],
} as RockMeta<typeof RAPID_REFERENCE_RENDERER_ROCK_TYPE>;
