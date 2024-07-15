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
      code: "title",
    },
    {
      type: "textarea",
      code: "description",
    },
    {
      type: "auto",
      code: "bugLevel",
    },
    {
      type: "auto",
      code: "state",
    },
  ],
};

const page: RapidPage = {
  code: "pm_bug_issue_list",
  name: "Bug列表",
  title: "Bug列表",
  permissionCheck: { any: [] },
  view: [
    {
      $type: "sonicEntityList",
      entityCode: "PmBugIssue",
      viewMode: "table",
      listActions: [
        {
          $type: "sonicToolbarNewEntityButton",
          text: "新建",
          icon: "PlusOutlined",
          actionStyle: "primary",
        },
        {
          $type: "sonicToolbarRefreshButton",
          text: "刷新",
          icon: "ReloadOutlined",
        },
      ],
      extraActions: [
        {
          $type: "sonicToolbarFormItem",
          formItemType: "search",
          placeholder: "Search",
          actionEventName: "onSearch",
          filterMode: "contains",
          filterFields: ["title", "description"],
        },
      ],
      orderBy: [
        {
          field: "project.orderNum",
        },
        {
          field: "code",
        },
      ],
      pageSize: 20,
      columns: [
        {
          type: "auto",
          code: "code",
          width: "100px",
        },
        {
          type: "auto",
          code: "project",
          fieldName: "project.name",
          width: "200px",
        },
        {
          type: "auto",
          code: "project",
          title: "项目创建时间",
          fieldName: "project.createdAt",
          width: "200px",
        },
        {
          type: "auto",
          code: "taskType",
          width: "100px",
        },
        {
          type: "auto",
          code: "bugLevel",
          width: "100px",
        },
        {
          type: "link",
          code: "title",
          width: "300px",
          rendererProps: {
            url: "/pages/pm_bug_issue_details?id={{id}}",
          },
        },
        {
          type: "auto",
          code: "description",
        },
        {
          type: "auto",
          code: "state",
          width: "100px",
        },
        {
          type: "auto",
          code: "createdAt",
          width: "150px",
        },
        {
          type: "auto",
          code: "createdBy",
          width: "150px",
        },
        {
          type: "auto",
          code: "updatedAt",
          width: "150px",
        },
        {
          type: "auto",
          code: "updatedBy",
          width: "150px",
        },
      ],
      actions: [
        {
          $type: "sonicRecordActionEditEntity",
          code: "edit",
          actionType: "edit",
          actionText: "修改",
        },
        {
          $type: "sonicRecordActionDeleteEntity",
          code: "delete",
          actionType: "delete",
          actionText: "删除",
          dataSourceCode: "list",
          entityCode: "PmBugIssue",
        },
      ],
      newForm: cloneDeep(formConfig),
      editForm: cloneDeep(formConfig),
      searchForm: {
        items: [
          {
            type: "auto",
            code: "title",
            filterMode: "contains",
          },
          {
            type: "auto",
            code: "bugLevel",
            filterMode: "eq",
          },
          {
            type: "auto",
            code: "state",
            filterMode: "eq",
          },
          {
            type: "auto",
            code: "createdAt",
            filterMode: "range",
          },
        ],
      },
      $exps: {
        "newForm.fixedFields.taskType": "'bug'",
      },
    } as SonicEntityListRockConfig,
  ],
};

export default page;
