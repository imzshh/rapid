import { Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import SonicRecordActionDeleteEntityMeta from "./SonicRecordActionDeleteEntityMeta";
import { useRockInstanceContext, wrapToRockComponent } from "@ruiapp/react-renderer";
import { SonicRecordActionDeleteEntityProps, SonicRecordActionDeleteEntityRockConfig } from "./sonic-record-action-delete-entity-types";
import { RapidTableActionComponent } from "../rapid-table-action/RapidTableAction";
import { getExtensionLocaleStringResource } from "../../helpers/i18nHelper";
import { omit } from "lodash";

export function configSonicRecordActionDeleteEntity(
  config: RockComponentProps<SonicRecordActionDeleteEntityRockConfig>,
): SonicRecordActionDeleteEntityRockConfig {
  config.$type = SonicRecordActionDeleteEntityMeta.$type;
  return config as SonicRecordActionDeleteEntityRockConfig;
}

export function SonicRecordActionDeleteEntityComponent(props: RockInstanceProps<SonicRecordActionDeleteEntityProps>) {
  const context = useRockInstanceContext();
  const { framework, page, scope } = context;

  const handleAction = async () => {
    await scope.notifyEvent({
      name: "onDeleteEntityButtonClick",
      sender: props,
      senderCategory: "component",
      args: [
        {
          recordId: props.recordId,
          confirmTitle: props.confirmTitle,
          confirmText: props.confirmText,
        },
      ],
      framework,
      page,
      scope,
    });
  };

  const actionText = props.actionText || getExtensionLocaleStringResource(framework, "delete");
  const rapidTableActionProps = omit(props, ["confirmTitle", "confirmText"]);

  return <RapidTableActionComponent {...rapidTableActionProps} actionText={actionText} onAction={handleAction} />;
}

export const SonicRecordActionDeleteEntity = wrapToRockComponent(SonicRecordActionDeleteEntityMeta, SonicRecordActionDeleteEntityComponent);

export default {
  Renderer: SonicRecordActionDeleteEntityComponent,
  ...SonicRecordActionDeleteEntityMeta,
} as Rock<SonicRecordActionDeleteEntityRockConfig>;
