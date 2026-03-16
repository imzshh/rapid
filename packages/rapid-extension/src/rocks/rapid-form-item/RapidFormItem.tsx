import { Rock, RockComponentProps, RockConfig, RockInstanceProps } from "@ruiapp/move-style";
import { renderRock, useRockInstanceContext, wrapToRockComponent } from "@ruiapp/react-renderer";
import RapidFormItemMeta from "./RapidFormItemMeta";
import { RapidFormItemProps, RapidFormItemRockConfig, RapidFormItemType } from "./rapid-form-item-types";
import RapidExtensionSetting from "../../RapidExtensionSetting";
import { useEffect, useRef } from "react";
import rapidAppDefinition from "../../rapidAppDefinition";
import { cloneDeep } from "lodash";

const formItemTypeToControlRockTypeMap: Record<Exclude<RapidFormItemType, "auto" | "custom">, string> = {
  box: "box",
  text: "antdInput",
  textarea: "antdInputTextArea",
  password: "antdInputPassword",
  number: "antdInputNumber",
  switch: "antdSwitch",
  checkbox: "antdCheckbox",
  checkboxList: "rapidCheckboxListFormInput",
  radioList: "rapidRadioListFormInput",
  date: "rapidDatePicker",
  month: "rapidMonthPicker",
  time: "rapidTimePicker",
  datetime: "rapidDatePicker",
  dateRange: "antdDatePickerRangePicker",
  dateTimeRange: "antdDatePickerRangePicker",
  select: "rapidSelect",
  treeSelect: "rapidTreeSelect",
  tableSelect: "rapidTableSelect",
  entityTableSelect: "sonicEntityTableSelect",
  search: "antdInputSearch",
  file: "rapidUploaderFormInput",
  fileList: "rapidUploaderFormInput",
  image: "rapidUploaderFormInput",
  imageList: "rapidUploaderFormInput",
  json: "rapidJsonFormInput",
  richText: "rapidRichTextEditor",
};

const apiBaseUrl = rapidAppDefinition.getApiBaseUrl();

const defaultUploadProps = {
  name: "files",
  action: `${apiBaseUrl}/upload`,
  headers: {},
};

const defaultControlPropsOfFormItemType: Partial<Record<RapidFormItemType, Record<string, any>>> = {
  textarea: {
    rows: 3,
  },

  datetime: {
    showTime: true,
  },

  dateTimeRange: {
    showTime: true,
  },

  search: {
    enterButton: true,
  },

  file: {
    uploadProps: defaultUploadProps,
  },

  fileList: {
    uploadProps: defaultUploadProps,
    multiple: true,
  },

  image: {
    uploadProps: defaultUploadProps,
  },

  imageList: {
    uploadProps: defaultUploadProps,
    multiple: true,
  },
};

const valuePropNameOfFormInput: Record<string, string> = {
  antdSwitch: "checked",
  antdCheckbox: "checked",
  antdUpload: "fileList",
};

export function configRapidFormItem(config: RockComponentProps<RapidFormItemRockConfig>): RapidFormItemRockConfig {
  config.$type = RapidFormItemMeta.$type;
  return config as RapidFormItemRockConfig;
}

export function RapidFormItemComponent(props: RockInstanceProps<RapidFormItemProps>) {
  const context = useRockInstanceContext();
  const isMountedRef = useRef<boolean>(false);

  const mode = props.mode || "input";
  let formControlType = null;
  let formItemValuePropName: string = "value";
  let formItemTrigger: string = "onChange";
  let childRock: RockConfig;

  if (mode === "input") {
    formControlType = props.formControlType || formItemTypeToControlRockTypeMap[props.type] || "antdInput";
    const defaultFormControlProps = cloneDeep(defaultControlPropsOfFormItemType[props.type]);
    childRock = {
      $id: `${props.$id}-input`,
      $type: formControlType,
      placeholder: props.placeholder,
      ...defaultFormControlProps,
      ...props.formControlProps,
      form: props.form,
    };

    // for antdSelect
    // TODO: may be we should remove `multipleValues` prop from RapidFormItemConfig
    if (props.multipleValues) {
      childRock.mode = "multiple";
    }

    formItemValuePropName = props.formControlValuePropName || (formControlType && valuePropNameOfFormInput[formControlType]) || "value";
  } else {
    let rendererType = props.rendererType;
    let defaultRendererProps = {};
    if (!rendererType) {
      if (props.valueFieldType === "relation[]") {
        rendererType = "rapidArrayRenderer";
      } else {
        rendererType = RapidExtensionSetting.getDefaultRendererTypeOfFieldType(props.valueFieldType);
        defaultRendererProps = RapidExtensionSetting.getDefaultRendererProps(props.valueFieldType, rendererType);
      }
    }

    childRock = {
      $id: `${props.$id}-display`,
      $type: rendererType,
      ...defaultRendererProps,
      ...props.rendererProps,
      form: props.form,
      readOnly: true,
    };

    formItemValuePropName = props.rendererValuePropName || (rendererType && valuePropNameOfFormInput[rendererType]) || "value";
    formItemTrigger = "__doNotChange";
  }

  // TODO: 此处应该是用来实现表单选项联动的，但是`storeDependencies`属性和`reload`消息名意义都不是很明确，应优化。
  const dependencies = (props.storeDependencies || []).map((key) => props.form.getFieldValue(key));
  useEffect(() => {
    if (props.mode == "display") {
      return;
    }

    if (isMountedRef.current && dependencies.length) {
      const page = context.page;
      if (page) {
        page.sendComponentMessage(`${props.$id}-input`, {
          name: "reload",
        });
      }
    }

    isMountedRef.current = true;
  }, dependencies);

  const rockConfig: RockConfig = {
    $id: props.$id,
    $type: "antdFormItem",
    required: props.required,
    name: (props.valueFieldName || props.code)?.split("."), // TODO: should `code` be required for a search form item?
    label: props.label,
    hidden: props.hidden,
    valuePropName: formItemValuePropName,
    trigger: formItemTrigger,
    form: props.form,
    children: childRock,
    rules: props.rules,
    extra: props.extra,
    labelAlign: props.labelAlign,
    labelCol: props.labelCol,
    wrapperCol: props.wrapperCol,
    tooltip: props.tooltip,
    $exps: props.$exps,
  };

  // 使用 renderRock 渲染 antdFormItem，因为它包含动态的 children
  return renderRock({ context, rockConfig });
}

export const RapidFormItem = wrapToRockComponent(RapidFormItemMeta, RapidFormItemComponent);

export default {
  Renderer: RapidFormItemComponent,
  ...RapidFormItemMeta,
} as Rock<RapidFormItemRockConfig>;
