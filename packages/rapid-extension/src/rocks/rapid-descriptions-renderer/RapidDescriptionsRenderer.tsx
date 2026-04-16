import { Rock, RockComponentProps, RockConfig, RockInstanceProps } from "@ruiapp/move-style";
import { renderRock, useRockInstance, useRockInstanceContext, wrapToRockComponent, wrapToRockRenderer } from "@ruiapp/react-renderer";
import { Descriptions } from "antd";
import type { DescriptionsProps } from "antd";
import RapidDescriptionsRendererMeta from "./RapidDescriptionsRendererMeta";
import { RapidDescriptionsRendererProps, RapidDescriptionsRendererRockConfig } from "./rapid-descriptions-renderer-types";
import { get } from "lodash";
import RapidExtensionSetting from "../../RapidExtensionSetting";

export function configRapidDescriptionsRenderer(config: RockComponentProps<RapidDescriptionsRendererRockConfig>): RapidDescriptionsRendererRockConfig {
  config.$type = RapidDescriptionsRendererMeta.$type;
  return config as RapidDescriptionsRendererRockConfig;
}

export function RapidDescriptionsRendererComponent(props: RockInstanceProps<RapidDescriptionsRendererProps>) {
  const context = useRockInstanceContext();
  const { $id } = useRockInstance(props, RapidDescriptionsRendererMeta.$type);
  const { value, title, layout, size, bordered, colon, column, labelStyle, items, extra } = props;

  const antdProps: DescriptionsProps = {
    title,
    layout,
    bordered,
    size,
    colon,
    column: column || 1,
    labelStyle,
    extra: extra ? extra() : undefined,
  };

  return (
    <Descriptions {...antdProps}>
      {items
        ?.filter((item) => !item.hidden && !item._hidden)
        .map((item, index) => {
          const rendererType = item.rendererType || RapidExtensionSetting.getDefaultRendererTypeOfFieldType(item.valueFieldType);
          const defaultRendererProps = RapidExtensionSetting.getDefaultRendererProps(item.valueFieldType, rendererType);

          const itemDisplayRockConfig: RockConfig = {
            $id: `${$id}-item-${index}-display`,
            $type: rendererType,
            ...defaultRendererProps,
            ...item.rendererProps,
            value: get(value, item.valueFieldName || item.code),
          };

          return (
            <Descriptions.Item key={index} label={item.label || item.code} span={item.column} labelStyle={item.labelStyle} contentStyle={item.contentStyle}>
              {renderRock({ context, rockConfig: itemDisplayRockConfig })}
            </Descriptions.Item>
          );
        })}
    </Descriptions>
  );
}

export const RapidDescriptionsRenderer = wrapToRockComponent(RapidDescriptionsRendererMeta, RapidDescriptionsRendererComponent);

export default {
  Renderer: wrapToRockRenderer(RapidDescriptionsRendererMeta, RapidDescriptionsRendererComponent, true),
  ...RapidDescriptionsRendererMeta,
} as Rock<RapidDescriptionsRendererRockConfig>;
