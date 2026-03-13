import type { Rock } from "@ruiapp/move-style";
import { MoveStyleUtils } from "@ruiapp/move-style";
import RapidArrayRendererMeta from "./RapidArrayRendererMeta";
import { RAPID_ARRAY_RENDERER_ROCK_TYPE, RapidArrayRendererProps, RapidArrayRendererRockConfig } from "./rapid-array-renderer-types";
import { map } from "lodash";
import { wrapToRockComponent, wrapToRockRenderer } from "@ruiapp/react-renderer";
import { Divider } from "antd";
import { Fragment, ReactElement, ReactNode } from "react";

export function configRapidArrayRenderer(config: RapidArrayRendererRockConfig): RapidArrayRendererRockConfig {
  config.$type = RAPID_ARRAY_RENDERER_ROCK_TYPE;
  return config;
}

export function RapidArrayRendererComponent(props: RapidArrayRendererProps) {
  const { value, format, item, separator, noSeparator, listContainer, itemContainer, defaultText } = props;

  if (!value || value.length === 0) {
    return <>{defaultText || ""}</>;
  }

  if (item) {
    // 渲染列表项
    const items: ReactNode[] = [];

    for (let i = 0; i < value.length; i++) {
      const itemValue = value[i];

      // 渲染分隔符（非第一个元素）
      if (!noSeparator && i > 0) {
        if (separator) {
          items.push(<Fragment key={`sep-${i}`}>{separator()}</Fragment>);
        } else {
          items.push(<Divider key={`sep-${i}`} type="vertical" />);
        }
      }

      // 渲染项目
      let itemElement = item(itemValue, i);

      // 使用 itemContainer 包裹（如果提供）
      if (itemContainer) {
        itemElement = itemContainer(itemElement, itemValue, i);
      }

      items.push(<Fragment key={i}>{itemElement}</Fragment>);
    }

    // 使用 listContainer 包裹整个列表（如果提供）
    if (listContainer) {
      return <>{listContainer(items)}</>;
    }

    return <>{items}</>;
  } else if (format) {
    return (
      <>
        {map(value, (item) => {
          return MoveStyleUtils.fulfillVariablesInString(format, item);
        }).join(", ")}
      </>
    );
  }

  return null;
}

export const RapidArrayRenderer = wrapToRockComponent<RapidArrayRendererRockConfig>(RapidArrayRendererMeta, RapidArrayRendererComponent);

export default {
  Renderer: wrapToRockRenderer(RapidArrayRendererMeta, RapidArrayRendererComponent),
  ...RapidArrayRendererMeta,
} as Rock<RapidArrayRendererRockConfig>;
