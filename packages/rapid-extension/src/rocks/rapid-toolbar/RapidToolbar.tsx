import type { Rock, RockComponentProps, RockConfig, RockInstanceProps } from "@ruiapp/move-style";
import RapidToolbarMeta from "./RapidToolbarMeta";
import type { RapidToolbarProps, RapidToolbarRockConfig } from "./rapid-toolbar-types";
import { renderRock, useRockInstanceContext, wrapToRockComponent } from "@ruiapp/react-renderer";

import "./style.css";

export function configRapidToolbar(config: RockComponentProps<RapidToolbarRockConfig>): RapidToolbarRockConfig {
  config.$type = RapidToolbarMeta.$type;
  return config as RapidToolbarRockConfig;
}

export function RapidToolbarComponent(props: RockInstanceProps<RapidToolbarProps>) {
  const context = useRockInstanceContext();
  const { extraClassName, items, extras, rightExtras } = props;

  if (!items?.length && !extras?.length && !rightExtras?.length) {
    return <></>;
  }

  const className = extraClassName ? "rui-toolbar " + extraClassName : "rui-toolbar";
  const rockConfig: RockConfig = {
    $id: props.$id,
    $type: "box",
    className,
    children: [
      {
        $id: `${props.$id}-items`,
        $type: "htmlElement",
        htmlTag: "div",
        attributes: {
          className: "rui-toolbar-items",
        },
        children: items,
      },
      {
        $id: `${props.$id}-extras`,
        $type: "htmlElement",
        htmlTag: "div",
        attributes: {
          className: "rui-toolbar-extras",
        },
        children: [
          {
            $id: `${props.$id}-form`,
            $type: "antdForm",
            initialValues: {},
            children: [
              {
                $type: "antdSpace",
                $id: `${props.$id}-extras-space`,
                children: extras,
              },
            ],
          },
          ...(rightExtras || []),
        ],
      },
    ],
  };
  return renderRock({ context, rockConfig });
}

export const RapidToolbar = wrapToRockComponent(RapidToolbarMeta, RapidToolbarComponent);

export default {
  Renderer: RapidToolbarComponent,
  ...RapidToolbarMeta,
} as Rock<RapidToolbarRockConfig>;
