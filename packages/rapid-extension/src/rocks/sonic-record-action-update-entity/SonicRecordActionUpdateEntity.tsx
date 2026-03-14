import { Rock, RockInstance } from "@ruiapp/move-style";
import SonicRecordActionUpdateEntityMeta from "./SonicRecordActionUpdateEntityMeta";
import { genRockRenderer } from "@ruiapp/react-renderer";
import { SonicRecordActionUpdateEntityProps, SonicRecordActionUpdateEntityRockConfig } from "./sonic-record-action-update-entity-types";
import { RapidTableActionComponent } from "../rapid-table-action/RapidTableAction";

export function configSonicRecordActionUpdateEntity(config: SonicRecordActionUpdateEntityRockConfig): SonicRecordActionUpdateEntityRockConfig {
  return config;
}

export function SonicRecordActionUpdateEntity(props: SonicRecordActionUpdateEntityProps) {
  const { _context: context } = props as any as RockInstance;
  const { framework, page, scope } = context;

  const handleAction = async () => {
    await scope.notifyEvent({
      name: "onUpdateEntityButtonClick",
      sender: props,
      senderCategory: "component",
      args: [
        {
          recordId: props.recordId,
          confirmTitle: props.confirmTitle,
          confirmText: props.confirmText,
          entity: props.entity,
        },
      ],
      framework,
      page,
      scope,
    });
  };

  return <RapidTableActionComponent {...props} onAction={handleAction} />;
}

export default {
  Renderer: genRockRenderer(SonicRecordActionUpdateEntityMeta.$type, SonicRecordActionUpdateEntity, true),
  ...SonicRecordActionUpdateEntityMeta,
} as Rock<SonicRecordActionUpdateEntityRockConfig>;
