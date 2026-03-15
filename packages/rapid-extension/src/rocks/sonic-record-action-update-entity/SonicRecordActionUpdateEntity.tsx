import { Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import SonicRecordActionUpdateEntityMeta from "./SonicRecordActionUpdateEntityMeta";
import { useRockInstanceContext, wrapToRockComponent } from "@ruiapp/react-renderer";
import { SonicRecordActionUpdateEntityProps, SonicRecordActionUpdateEntityRockConfig } from "./sonic-record-action-update-entity-types";
import { RapidTableActionComponent } from "../rapid-table-action/RapidTableAction";

export function configSonicRecordActionUpdateEntity(
  config: RockComponentProps<SonicRecordActionUpdateEntityRockConfig>,
): SonicRecordActionUpdateEntityRockConfig {
  config.$type = SonicRecordActionUpdateEntityMeta.$type;
  return config as SonicRecordActionUpdateEntityRockConfig;
}

export function SonicRecordActionUpdateEntityComponent(props: RockInstanceProps<SonicRecordActionUpdateEntityProps>) {
  const context = useRockInstanceContext();
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

export const SonicRecordActionUpdateEntity = wrapToRockComponent(SonicRecordActionUpdateEntityMeta, SonicRecordActionUpdateEntityComponent);

export default {
  Renderer: SonicRecordActionUpdateEntityComponent,
  ...SonicRecordActionUpdateEntityMeta,
} as Rock<SonicRecordActionUpdateEntityRockConfig>;
