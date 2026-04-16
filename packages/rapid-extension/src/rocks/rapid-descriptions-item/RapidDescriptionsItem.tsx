import type { Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import { renderRockChildren, useRockInstanceContext, wrapToRockComponent, wrapToRockRenderer } from "@ruiapp/react-renderer";
import { Descriptions } from "antd";
import RapidDescriptionsItemMeta from "./RapidDescriptionsItemMeta";
import type { RapidDescriptionsItemProps, RapidDescriptionsItemRockConfig } from "./rapid-descriptions-item-types";

export function configRapidDescriptionsItem(config: RockComponentProps<RapidDescriptionsItemRockConfig>): RapidDescriptionsItemRockConfig {
  config.$type = RapidDescriptionsItemMeta.$type;
  return config as RapidDescriptionsItemRockConfig;
}

export function RapidDescriptionsItemComponent(props: RockInstanceProps<RapidDescriptionsItemProps>) {
  const { label, column, labelStyle, contentStyle, children } = props;

  return (
    <Descriptions.Item label={label} span={column} labelStyle={labelStyle} contentStyle={contentStyle}>
      {children}
    </Descriptions.Item>
  );
}

export const RapidDescriptionsItem = wrapToRockComponent(RapidDescriptionsItemMeta, RapidDescriptionsItemComponent);

export default {
  Renderer: wrapToRockRenderer(RapidDescriptionsItemMeta, RapidDescriptionsItemComponent, true),
  ...RapidDescriptionsItemMeta,
} as Rock<RapidDescriptionsItemRockConfig>;
