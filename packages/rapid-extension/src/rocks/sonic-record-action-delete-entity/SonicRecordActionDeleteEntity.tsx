import { Rock, RockInstance } from "@ruiapp/move-style";
import SonicRecordActionDeleteEntityMeta from "./SonicRecordActionDeleteEntityMeta";
import { genRockRenderer } from "@ruiapp/react-renderer";
import { SonicRecordActionDeleteEntityProps, SonicRecordActionDeleteEntityRockConfig } from "./sonic-record-action-delete-entity-types";
import { RapidTableActionComponent } from "../rapid-table-action/RapidTableAction";
import { getExtensionLocaleStringResource } from "../../helpers/i18nHelper";
import { omit } from "lodash";

export function configSonicRecordActionDeleteEntity(config: SonicRecordActionDeleteEntityRockConfig): SonicRecordActionDeleteEntityRockConfig {
  return config;
}

export function SonicRecordActionDeleteEntity(props: SonicRecordActionDeleteEntityProps) {
  const { _context: context } = props as any as RockInstance;
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

export default {
  Renderer: genRockRenderer(SonicRecordActionDeleteEntityMeta.$type, SonicRecordActionDeleteEntity, true),
  ...SonicRecordActionDeleteEntityMeta,
} as Rock<SonicRecordActionDeleteEntityRockConfig>;
