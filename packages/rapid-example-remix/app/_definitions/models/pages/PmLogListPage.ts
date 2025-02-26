import { cloneDeep } from "lodash";
import type { RapidPage, RapidEntityFormConfig, SonicEntityListRockConfig } from "@ruiapp/rapid-extension";

const formConfig: Partial<RapidEntityFormConfig> = {
  items: [
    {
      type: "auto",
      code: "project",
    },
    {
      type: "auto",
      code: "logDate",
    },
    {
      type: "textarea",
      code: "content",
    },
    {
      type: "auto",
      code: "pictures",
    },
    {
      type: "json",
      code: "attachments",
    },
    {
      type: "auto",
      code: "attachments",
    },
  ],
};

const page: RapidPage = {
  code: "pm_log_list",
  name: "项目日志",
  title: "项目日志",
  permissionCheck: { any: [] },
  view: [
    {
      $type: "sonicEntityList",
      entityCode: "PmLog",
      viewMode: "table",
      listActions: [
        {
          $type: "sonicToolbarNewEntityButton",
          icon: "PlusOutlined",
          actionStyle: "primary",
        },
      ],
      extraActions: [
        {
          $type: "sonicToolbarFormItem",
          formItemType: "search",
          placeholder: "Search",
          actionEventName: "onSearch",
          filterMode: "contains",
          filterFields: ["content"],
        },
      ],
      orderBy: [
        {
          field: "logDate",
          desc: true,
        },
      ],
      pageSize: 20,
      columns: [
        {
          type: "auto",
          code: "project",
          width: "100px",
        },
        {
          type: "auto",
          code: "logDate",
          width: "100px",
        },
        {
          type: "auto",
          code: "content",
        },
        {
          type: "auto",
          code: "pictures",
          width: "100px",
        },
        {
          type: "auto",
          code: "attachments",
          width: "300px",
          rendererProps: {
            showFileSize: true,
          },
        },
      ],
      actions: [
        {
          $type: "sonicRecordActionEditEntity",
          code: "edit",
          actionType: "edit",
        },
        {
          $type: "sonicRecordActionDeleteEntity",
          code: "delete",
          actionType: "delete",
          dataSourceCode: "list",
          entityCode: "PmLog",
        },
      ],
      newForm: cloneDeep(formConfig),
      editForm: cloneDeep(formConfig),
      $exps: {},
    } as SonicEntityListRockConfig,
  ],
};

export default page;
