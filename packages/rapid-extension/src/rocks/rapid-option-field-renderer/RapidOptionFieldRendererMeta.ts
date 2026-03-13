import type { RockMeta } from "@ruiapp/move-style";
import { RAPID_OPTION_FIELD_RENDERER_ROCK_TYPE } from "./rapid-option-field-renderer-types";

export default {
  $type: RAPID_OPTION_FIELD_RENDERER_ROCK_TYPE,

  slots: {
    separator: {
      allowMultiComponents: false,
      required: false,
      toRenderProp: true,
    },
    item: {
      allowMultiComponents: false,
      required: false,
      toRenderProp: true,
      argumentsToProps: true,
      argumentNames: ["value", "index"],
    },
    itemContainer: {
      allowMultiComponents: false,
      required: false,
      toRenderProp: true,
      argumentsToProps: true,
      argumentNames: ["children", "value", "index"],
    },
    listContainer: {
      allowMultiComponents: false,
      required: false,
      toRenderProp: true,
      argumentsToProps: true,
      argumentNames: ["children"],
    },
  },

  propertyPanels: [],
} as RockMeta<typeof RAPID_OPTION_FIELD_RENDERER_ROCK_TYPE>;
