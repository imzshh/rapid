import { MoveStyleUtils, RockComponentProps, RockEventHandlerNotifyEvent, RockInstanceContext, RockInstanceProps, type Rock } from "@ruiapp/move-style";
import { renderRock, useRockInstanceContext, wrapToRockComponent } from "@ruiapp/react-renderer";
import SonicRecordActionEditEntityMeta from "./SonicRecordActionEditEntityMeta";
import type { SonicRecordActionEditEntityProps, SonicRecordActionEditEntityRockConfig } from "./sonic-record-action-edit-entity-types";
import { getExtensionLocaleStringResource } from "../../helpers/i18nHelper";
import { RapidTableActionRockConfig } from "../rapid-table-action/rapid-table-action-types";
import { RapidEntityFormRockConfig } from "../rapid-entity-form/rapid-entity-form-types";
import { RapidFormModalRecordActionRockConfig } from "../rapid-form-modal-record-action/rapid-form-modal-record-action-types";

export function configSonicRecordActionEditEntity(config: RockComponentProps<SonicRecordActionEditEntityRockConfig>): SonicRecordActionEditEntityRockConfig {
  config.$type = SonicRecordActionEditEntityMeta.$type;
  return config as SonicRecordActionEditEntityRockConfig;
}

export function SonicRecordActionEditEntityComponent(props: RockInstanceProps<SonicRecordActionEditEntityProps>) {
  const context = useRockInstanceContext();
  const { form } = props;

  if (form) {
    return renderActionWithSpecifiedForm(context, props);
  } else {
    return renderActionWithDefaultForm(context, props);
  }
}

function renderActionWithDefaultForm(context: RockInstanceContext, props: RockInstanceProps<SonicRecordActionEditEntityProps>) {
  const { framework } = context;
  const slotIndex = props.$slot.index || "0";

  const rockConfig: RapidTableActionRockConfig = {
    ...(MoveStyleUtils.omitSystemRockConfigFields(props as unknown as SonicRecordActionEditEntityRockConfig) as SonicRecordActionEditEntityProps),
    $id: `${props.$id}-link-${slotIndex}`,
    $type: "rapidTableAction",
    actionText: props.actionText || getExtensionLocaleStringResource(framework, "edit"),
    onAction: [
      {
        $action: "notifyEvent",
        eventName: "onEditEntityButtonClick",
        $exps: {
          args: "$event.args",
        },
      } satisfies RockEventHandlerNotifyEvent,
    ],
  };

  return renderRock({ context, rockConfig });
}

function renderActionWithSpecifiedForm(context: RockInstanceContext, props: RockInstanceProps<SonicRecordActionEditEntityProps>) {
  const slotIndex = props.$slot.index || "0";
  const entityId = props.$slot.record.id;
  const scopeId = context.scope.config.$id;
  const { entityCode, form, dataSourceCode } = props;

  const onSubmitSuccess = form?.onSubmitSuccess || form?.onSaveSuccess;
  const onSubmitError = form?.onSubmitError || form?.onSaveError;
  const rockConfig: RapidFormModalRecordActionRockConfig = {
    ...(MoveStyleUtils.omitSystemRockConfigFields(props as unknown as SonicRecordActionEditEntityRockConfig) as SonicRecordActionEditEntityProps),
    $id: `${props.$id}-action`,
    $type: "rapidFormModalRecordAction",
    form: {
      $type: "rapidEntityForm",
      ...(form as RapidEntityFormRockConfig),
      entityCode,
      mode: "edit",
      entityId,
      beforeSubmit: [
        {
          $action: "setVars",
          vars: {
            "modal-saving": true,
          },
        },
      ],

      onSubmitSuccess: [
        {
          $action: "setVars",
          vars: {
            "modal-saving": false,
            "modal-open": false,
          },
        },
        ...(onSubmitSuccess ? (Array.isArray(onSubmitSuccess) ? onSubmitSuccess : [onSubmitSuccess]) : []),
        ...[
          {
            $action: "loadStoreData",
            scopeId,
            storeName: dataSourceCode,
          },
        ],
      ],
      onSubmitError: [
        {
          $action: "setVars",
          vars: {
            "modal-saving": false,
          },
        },
        ...(onSubmitError ? (Array.isArray(onSubmitError) ? onSubmitError : [onSubmitError]) : []),
      ],
    } satisfies RapidEntityFormRockConfig,
    onModalOpen: [
      {
        $action: "loadStoreData",
        scope: `${props.$id}-action-${slotIndex}`,
        storeName: "detail",
      },
    ],
  };

  return renderRock({ context, rockConfig });
}

export const SonicRecordActionEditEntity = wrapToRockComponent(SonicRecordActionEditEntityMeta, SonicRecordActionEditEntityComponent);

export default {
  Renderer: SonicRecordActionEditEntityComponent,
  ...SonicRecordActionEditEntityMeta,
} as Rock<SonicRecordActionEditEntityRockConfig>;
