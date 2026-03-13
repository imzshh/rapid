import { Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import { renderRock, renderRockChildren, wrapToRockComponent, useRockInstanceContext, useRockInstance } from "@ruiapp/react-renderer";
import { RapidPageSectionProps, RapidPageSectionRockConfig } from "./rapid-page-section-types";
import RapidPageSectionMeta from "./RapidPageSectionMeta";
import React from "react";

import "./RapidPageSection.css";

export function configRapidPageSection(config: RockComponentProps<RapidPageSectionRockConfig>): RapidPageSectionRockConfig {
  config.$type = RapidPageSectionMeta.$type;
  return config as RapidPageSectionRockConfig;
}

export function RapidPageSectionComponent(props: RockInstanceProps<RapidPageSectionProps>) {
  const context = useRockInstanceContext();
  const { title, style, actions, children } = props;

  return (
    <div style={style} className="rapid-page-section">
      {title && (
        <div className="rapid-page-section-header">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 className="rapid-page-section-title">{title}</h2>
            {actions && actions.length > 0 && (
              <div className="rapid-page-section-actions">{actions.map((action: any, index: number) => renderRock({ context, rockConfig: action }))}</div>
            )}
          </div>
        </div>
      )}
      <div className="rapid-page-section-body">
        {renderRockChildren({
          context,
          rockChildrenConfig: children,
        })}
      </div>
    </div>
  );
}

export const RapidPageSection = wrapToRockComponent(RapidPageSectionMeta, RapidPageSectionComponent);

export default {
  Renderer: RapidPageSectionComponent,
  ...RapidPageSectionMeta,
} as Rock<RapidPageSectionRockConfig>;
