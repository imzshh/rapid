import type { RockMeta } from "@ruiapp/move-style";

export default {
  $type: "sonicMainSecondaryLayout",

  slots: {
    main: {
      allowMultiComponents: true,
      required: true,
      lazyCreate: true,
    },

    secondary: {
      allowMultiComponents: true,
      required: true,
      lazyCreate: true,
    },
  },

  propertyPanels: [],
} as RockMeta;
