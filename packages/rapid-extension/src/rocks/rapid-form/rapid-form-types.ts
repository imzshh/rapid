import { HttpRequestOptions, RockConfig, RockEventHandlerConfig, RockExpsConfig } from "@ruiapp/move-style";
import { RapidFormItemConfig } from "../rapid-form-item/rapid-form-item-types";
import { RapidFormSubmitOptions } from "../../types/rapid-action-types";

export const RAPID_FORM_ROCK_TYPE = "rapidForm" as const;

export type RapidFormProps = {
  /**
   * 数据源编号：当dataSource不为null或者disabledLoadStore为true时，忽略当前字段配置
   */
  dataSourceCode?: string | null;

  /**
   * 数据源。
   */
  dataSource?: Record<string, any>;

  /**
   * 禁用store后，dataSourceCode不起作用
   */
  disabledLoadStore?: boolean;

  /**
   * 大小，默认为`middle`
   */
  size?: "default" | "middle" | "small";

  requiredMark?: boolean | "optional";

  /**
   * 布局模式，默认为`horizontal`
   */
  layout?: "horizontal" | "vertical" | "inline";

  /**
   * 是否显示冒号
   */
  colon?: boolean;

  /**
   * 栏数，默认为1
   */
  column?: number;

  /**
   * 表单项
   */
  items: RapidFormItemConfig[];

  /**
   * 表单项标签布局
   */
  labelCol?: { span?: number; offset?: number; flex?: string | number };

  /**
   * 表单控件布局
   */
  wrapperCol?: { span?: number; offset?: number; flex?: string | number };

  /**
   * 表单操作配置。如：提交、重置、取消等
   */
  actions?: RapidFormAction[];

  /**
   * 表单操作布局
   */
  actionsLayout?: {
    labelCol?: { span?: number; offset?: number; flex?: string | number };

    wrapperCol?: { span?: number; offset?: number; flex?: string | number };
  };

  /**
   * 操作按钮对齐方式
   */
  actionsAlign?: "center" | "left" | "right";

  /**
   * 表单固定字段，用于数据提交
   */
  fixedFields?: Record<string, any>;

  /**
   * 表单默认字段，可用于新建表单设置默认值
   */
  defaultFormFields?: Record<string, any>;

  /**
   * @deprecated 请使用 onSubmit
   */
  onFinish?: RockEventHandlerConfig;

  /**
   * @deprecated 请使用 onSubmit
   */
  onFormSubmit?: RockEventHandlerConfig;

  beforeSubmit?: RockEventHandlerConfig;

  onSubmit?: RockEventHandlerConfig;

  onSubmitSuccess?: RockEventHandlerConfig;

  onSubmitError?: RockEventHandlerConfig;

  onFormRefresh?: RockEventHandlerConfig;

  onValuesChange?: RockEventHandlerConfig;

  fieldNameOfFormDataInDataSource?: string;

  // TODO: defaultFormFields直接配置成表单项可用的数据格式即可，为什么还要经过这个formDataAdapter的预处理？
  /**
   * 对defaultFormFields或者数据源中的数据进行预处理的函数。
   * 可在函数中使用以下变量：
   * - `data`: 原始数据
   * - `form`: 表单实例对象
   */
  formDataAdapter?: string;

  /**
   * 在触发onFinish事件之前对表单数据进行处理的函数。
   * 可在函数中使用以下变量：
   * - `formData`: 表单数据
   * - `fixedFields`: 固定字段
   */
  beforeSubmitFormDataAdapter?: string;

  /**
   * 表单数据在提交数据中的字段名称。默认表单数据就是提交数据。当设置该字段后，表单数据作为提交数据的一个字段值。
   *
   * 例如，当`fieldNameOfFormDataInSubmitData`设置为`formData`时，提交数据结构如下：
   * ```json
   * {
   *   "formData": formData
   * }
   * ```
   */
  fieldNameOfFormDataInSubmitData?: string;

  submitMethod?: HttpRequestOptions["method"];

  submitUrl?: string;

  /**
   * 表单提交成功后的提示消息
   */
  successMessage?: string;

  /**
   * 表单提交失败后的提示消息
   */
  errorMessage?: string;
};

/**
 * 表单动作
 */
export type RapidFormAction = RockConfig | RapidFormActionConfig;

export type RapidFormActionConfig = {
  /**
   * 操作类型
   */
  actionType: RapidFormActionType;

  /**
   * 按钮类型
   */
  buttonType?: "primary" | "ghost" | "dashed" | "link" | "text" | "default";

  /**
   * 操作文字
   */
  actionText?: string;

  /**
   * 操作按钮其它属性
   */
  actionProps?: any;

  /**
   * 是否隐藏
   */
  hidden?: boolean;

  /**
   * 动作数据，提交时会合并到表单数据中
   */
  actionData?: Record<string, any>;

  /**
   * 请求方法，设置后会覆盖表单的请求方法
   */
  submitMethod?: RapidFormSubmitOptions["submitMethod"];

  /**
   * 请求地址，设置后覆盖表单的请求地址
   */
  submitUrl?: RapidFormSubmitOptions["submitUrl"];

  /**
   * 表单固定字段。当操作类型为submit时，将会合并到表单数据中一起提交。
   */
  fixedFields?: RapidFormSubmitOptions["fixedFields"];

  /**
   * 操作成功后的提示消息。当`actionType`为`submit`时，将会覆盖表单的`successMessage`配置。
   */
  successMessage?: string;

  /**
   * 操作失败后的提示消息。当`actionType`为`submit`时，将会覆盖表单的`errorMessage`配置。
   */
  errorMessage?: string;

  onSuccess?: RockEventHandlerConfig;

  onError?: RockEventHandlerConfig;

  $exps?: RockExpsConfig;
};

/**
 * 表单按钮的行为类型。`submit`表示提交表单；`reset`表示重置表单；`button`表示没有默认行为。
 */
export type RapidFormActionType =
  | "button"
  | "submit" // 提交
  | "reset"; // 重置

export type RapidFormRockConfig = RockConfig<RapidFormProps, typeof RAPID_FORM_ROCK_TYPE>;

export interface RapidFormState {
  form: any;
  submitOptions?: RapidFormSubmitOptions;
}
