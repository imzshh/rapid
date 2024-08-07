import { RpdRoute } from "~/types";

export default {
  namespace: "svc",
  name: "svc.getSystemSettingValues",
  code: "svc.getSystemSettingValues",
  type: "RESTful",
  method: "GET",
  endpoint: "/svc/systemSettingValues",
  actions: [
    {
      code: "getSystemSettingValues",
    },
  ],
} satisfies RpdRoute;
