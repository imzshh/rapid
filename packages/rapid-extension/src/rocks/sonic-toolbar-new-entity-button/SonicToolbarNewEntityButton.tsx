import { MoveStyleUtils, type Rock, type RockConfig } from "@ruiapp/move-style";
import { renderRock } from "@ruiapp/react-renderer";
import RapidEntityListMeta from "./SonicToolbarNewEntityButtonMeta";
import type { SonicToolbarNewEntityButtonRockConfig } from "./sonic-toolbar-new-entity-button-types";
import { getExtensionLocaleStringResource } from "../../helpers/i18nHelper";

export default {
  onInit(context, props) {},

  onReceiveMessage(message, state, props) {},

  Renderer(context, props) {
    const { framework } = context;
    const rockConfig: RockConfig = {
      ...MoveStyleUtils.omitSystemRockConfigFields(props),
      $type: "rapidToolbarButton",
      text: props.text || getExtensionLocaleStringResource(framework, "new"),
      onAction: [
        {
          $action: "notifyEvent",
          eventName: "onNewEntityButtonClick",
        },
      ],
    };

    return renderRock({ context, rockConfig });
  },

  ...RapidEntityListMeta,
} as Rock<SonicToolbarNewEntityButtonRockConfig>;
