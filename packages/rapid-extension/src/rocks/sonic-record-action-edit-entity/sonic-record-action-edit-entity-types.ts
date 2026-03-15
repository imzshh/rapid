import type { RockConfig } from "@ruiapp/move-style";
import { RapidRecordActionBase } from "../../types/rapid-action-types";
import { RapidEntityFormProps } from "../rapid-entity-form/rapid-entity-form-types";

export const SONIC_RECORD_ACTION_EDIT_ENTITY_ROCK_TYPE = "sonicRecordActionEditEntity" as const;

export interface SonicRecordActionEditEntityProps extends Omit<RapidRecordActionBase, "$type" | "onAction"> {
  /**
   * 模态框的标题。
   */
  modalTitle?: string;

  entityCode?: string;

  dataSourceCode?: string;

  form?: Partial<RapidEntityFormProps>;

  successMessage?: string;

  errorMessage?: string;
}

export type SonicRecordActionEditEntityRockConfig = RockConfig<SonicRecordActionEditEntityProps, typeof SONIC_RECORD_ACTION_EDIT_ENTITY_ROCK_TYPE>;
