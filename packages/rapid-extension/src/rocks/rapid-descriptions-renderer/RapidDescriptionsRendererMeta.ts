import { RockMeta } from "@ruiapp/move-style";
import { RAPID_DESCRIPTIONS_RENDERER_ROCK_TYPE } from "./rapid-descriptions-renderer-types";

export default {
  $type: RAPID_DESCRIPTIONS_RENDERER_ROCK_TYPE,

  slots: {
    extra: {
      allowMultiComponents: true,
      required: false,
      toRenderProp: true,
    },
  },

  propertyPanels: [
    {
      $type: "componentPropPanel",
      setters: [
        {
          $type: "textPropSetter",
          label: "title",
          propName: "title",
        },

        {
          $type: "selectPropSetter",
          label: "layout",
          propName: "layout",
          options: [
            {
              label: "horizontal",
              value: "horizontal",
            },
            {
              label: "vertical",
              value: "vertical",
            },
          ],
        },

        {
          $type: "switchPropSetter",
          label: "bordered",
          propName: "bordered",
        },

        {
          $type: "selectPropSetter",
          label: "size",
          propName: "size",
          options: [
            {
              label: "default",
              value: "default",
            },
            {
              label: "middle",
              value: "middle",
            },
            {
              label: "small",
              value: "small",
            },
          ],
        },

        {
          $type: "switchPropSetter",
          label: "colon",
          propName: "colon",
        },
      ],
    },
  ],
} as RockMeta<typeof RAPID_DESCRIPTIONS_RENDERER_ROCK_TYPE>;
