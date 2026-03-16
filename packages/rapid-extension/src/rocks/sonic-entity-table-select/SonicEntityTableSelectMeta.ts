import type { RockMeta } from "@ruiapp/move-style";
import { SONIC_ENTITY_TABLE_SELECT_ROCK_TYPE } from "./sonic-entity-table-select-types";

export default {
  $type: SONIC_ENTITY_TABLE_SELECT_ROCK_TYPE,

  props: {},

  slots: {},

  propertyPanels: [
    {
      $type: "componentPropPanel",
      setters: [
        {
          $type: "textPropSetter",
          label: "名称",
          propName: "$name",
        },
        {
          $type: "jsonPropsSetter",
          label: "列",
          propNames: ["columns"],
        },
      ],
    },
  ],
} as RockMeta<typeof SONIC_ENTITY_TABLE_SELECT_ROCK_TYPE>;
