import { MoveStyleUtils, Rock, RockConfig, RockEvent, RockEventHandlerScript, RockInstance, fireEvent } from "@ruiapp/move-style";
import { renderRock } from "@ruiapp/react-renderer";
import RapidFormMeta from "./RapidFormMeta";
import { RAPID_FORM_ROCK_TYPE, RapidFormProps, RapidFormRockConfig, RapidFormState } from "./rapid-form-types";
import { assign, each, get, mapValues, merge, set, trim } from "lodash";
import { Form, Row, Col, Space, Spin, FormInstance } from "antd";
import { useEffect, useMemo, useState } from "react";
import { parseRockExpressionFunc } from "../../utils/parse-utility";
import { generateRockConfigOfError } from "../../rock-generators/generateRockConfigOfError";
import { RapidFormSubmitOptions } from "../../types/rapid-action-types";
import { getExtensionLocaleStringResource } from "../../helpers/i18nHelper";

export function configRapidForm(config: RapidFormRockConfig): RapidFormRockConfig {
  return config;
}

export function RapidForm(props: RapidFormProps) {
  const { $id, _context: context, _state: state } = props as unknown as RockInstance;
  const { form } = state as RapidFormState;
  const { framework, page, scope } = context;
  const logger = framework.getRockLogger(RAPID_FORM_ROCK_TYPE, $id);

  // 当前主要是触发 rerender
  // const [, setCurrentFormData] = useState<Record<string, any>>({});

  if (!props.items) {
    return renderRock({
      context,
      rockConfig: generateRockConfigOfError(new Error(`RapidFormConfig.items are required.`)),
    });
  }

  if (props.onFinish && props.onFormSubmit) {
    return renderRock({
      context,
      rockConfig: generateRockConfigOfError(new Error(`"onFinish" should not be configured while "onFormSubmit" is configured.`)),
    });
  }

  const dataFormItemRocks: RockConfig[] = [];
  if (props.items) {
    props.items.forEach((formItemConfig) => {
      (formItemConfig as any).form = form;

      let formItemRockConfig: RockConfig;
      if (formItemConfig.hidden) {
        formItemRockConfig = {
          $id: `${$id}-item-${formItemConfig.uniqueKey || formItemConfig.code}`,
          $type: "rapidFormItem",
          ...formItemConfig,
        };
      } else {
        formItemRockConfig = {
          $id: `${$id}-item-${formItemConfig.uniqueKey || formItemConfig.code}-col`,
          $type: "antdCol",
          span: (24 / (props.column || 1)) * (formItemConfig.column || 1),
          form: form,
          children: {
            $id: `${$id}-item-${formItemConfig.uniqueKey || formItemConfig.code}`,
            $type: "rapidFormItem",
            ...formItemConfig,
          },
          $exps: formItemConfig.$exps,
        };
      }

      dataFormItemRocks.push(formItemRockConfig);
    });
  }

  const formActionRocks: RockConfig[] = [];
  each(props.actions, (formAction, index) => {
    if ((formAction as RockConfig).$type) {
      formActionRocks.push(formAction as RockConfig);
      return;
    }

    page.interpreteComponentProperties(null, formAction as any, {});

    const formActionRock: RockConfig = {
      $id: `${$id}-actions-${index}`,
      $type: "antdButton",
      children: {
        $type: "text",
        text: formAction.actionText,
      },
      onClick: () => {
        if (formAction.submitMethod || formAction.submitUrl || formAction.fixedFields) {
          page.sendComponentMessage($id, {
            name: "setSubmitOptions",
            payload: {
              submitMethod: formAction.submitMethod,
              submitUrl: formAction.submitUrl,
              fixedFields: formAction.fixedFields,
              successMessage: formAction.successMessage,
              errorMessage: formAction.errorMessage,
              onSuccess: formAction.onSuccess,
              onError: formAction.onError,
            } satisfies RapidFormSubmitOptions,
          });
        }
      },
      _hidden: formAction.hidden,
    };
    if (formAction.actionType === "submit") {
      formActionRock.type = formAction.buttonType || "primary";
      formActionRock.htmlType = "submit";
      formActionRock.form = undefined;
    }
    assign(formActionRock, formAction.actionProps);
    formActionRocks.push(formActionRock);
  });

  const dataSource = props.dataSource || (props.dataSourceCode && get(scope.stores[props.dataSourceCode], "data.list[0]"));
  const initialValues = useMemo(() => {
    let values;
    if (dataSource || (props.dataSourceCode && !props.disabledLoadStore)) {
      values = {
        ...props.defaultFormFields,
        ...(props.fieldNameOfFormDataInDataSource ? get(dataSource, props.fieldNameOfFormDataInDataSource) : dataSource),
      };
    } else {
      values = props.defaultFormFields;
    }

    if (typeof props.formDataAdapter === "string" && trim(props.formDataAdapter)) {
      const formDataAdapter = parseRockExpressionFunc(props.formDataAdapter, { data: values, form }, context);
      values = formDataAdapter();
    }

    return values || {};
  }, [props.defaultFormFields, props.disabledLoadStore, props.fieldNameOfFormDataInDataSource, dataSource, props.formDataAdapter]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
    // setCurrentFormData(initialValues);
  }, [initialValues, form]);

  const onValuesChange = (changedValues: any, allValues: any) => {
    // setCurrentFormData(allValues);
    fireEvent({
      eventName: "onValuesChange",
      framework,
      page,
      scope,
      sender: { ...props, form },
      senderCategory: "component",
      eventHandlers: props.onValuesChange,
      eventArgs: [allValues, changedValues],
    });
  };

  const onFinish = async (values: any) => {
    const submitOptions = state.submitOptions;
    const submitUrl = submitOptions?.submitUrl || props.submitUrl;
    let onSubmit = props.onSubmit || props.onFormSubmit || props.onFinish;

    if (!submitUrl && !onSubmit) {
      logger.error(props, `Failed to submit form: submitUrl or onSubmit is not configured.`);
      return;
    }

    let formData = Object.assign({}, omitUndefinedValues(values));

    const fixedFields = omitUndefinedValues(merge({}, props.fixedFields, submitOptions?.fixedFields));

    if (typeof props.beforeSubmitFormDataAdapter === "string" && trim(props.beforeSubmitFormDataAdapter)) {
      const adapter = parseRockExpressionFunc(props.beforeSubmitFormDataAdapter, { formData, fixedFields }, context);
      formData = adapter();
    }

    let submitData: any;
    if (props.fieldNameOfFormDataInSubmitData) {
      submitData = set({}, props.fieldNameOfFormDataInSubmitData, formData);
    } else {
      submitData = formData;
    }
    submitData = merge(submitData, fixedFields);

    if (props.beforeSubmit) {
      await fireEvent({
        eventName: "beforeSubmit",
        framework,
        page: page as any,
        scope,
        sender: { ...props, form },
        senderCategory: "component",
        eventHandlers: props.beforeSubmit,
        eventArgs: [submitData, submitOptions],
      });
    }

    if (!onSubmit) {
      const submitMethod = submitOptions?.submitMethod || props.submitMethod || "POST";
      const successMessage = submitOptions?.successMessage || props.successMessage || getExtensionLocaleStringResource(framework, "saveSuccess");
      const errorMessage = submitOptions?.errorMessage || props.errorMessage || getExtensionLocaleStringResource(framework, "saveError");

      const onSubmitSuccess = submitOptions?.onSuccess || props.onSubmitSuccess;
      const onSubmitError = submitOptions?.onError || props.onSubmitError;

      onSubmit = {
        $action: "sendHttpRequest",
        method: submitMethod,
        url: submitUrl,
        data: submitData,
        onSuccess: [
          {
            $action: "antdToast",
            type: "success",
            content: successMessage,
          },
          ...(onSubmitSuccess ? (Array.isArray(onSubmitSuccess) ? onSubmitSuccess : [onSubmitSuccess]) : []),
        ],
        onError: [
          {
            $action: "antdToast",
            type: "error",
            $exps: {
              content: `${JSON.stringify(errorMessage)}+ " " + $event.args[0].message`,
            },
          },
          ...(onSubmitError ? (Array.isArray(onSubmitError) ? onSubmitError : [onSubmitError]) : []),
        ],
      };
    }

    await fireEvent({
      eventName: "onSubmit",
      framework,
      page: page as any,
      scope,
      sender: { ...props, form },
      senderCategory: "component",
      eventHandlers: onSubmit,
      eventArgs: [submitData, submitOptions],
    });
  };

  const dataLoaded = !props.dataSourceCode || get(scope.stores[props.dataSourceCode], "data");
  if (!dataLoaded) {
    return <Spin />;
  }

  const isHorizonLayout = !(props.layout === "vertical" || props.layout === "inline");

  return (
    <Form
      form={form}
      labelCol={isHorizonLayout ? props.labelCol || { span: 8 } : undefined}
      wrapperCol={isHorizonLayout ? props.wrapperCol || { span: 16 } : undefined}
      layout={props.layout}
      requiredMark={props.requiredMark}
      initialValues={initialValues}
      onFinish={onFinish}
      onValuesChange={onValuesChange}
    >
      <Row gutter={24}>{dataFormItemRocks.map((rock) => renderRock({ context, rockConfig: rock }))}</Row>
      {formActionRocks.length > 0 && (
        <Row gutter={24} id={`${$id}-actions`}>
          <Col span={24} id={`${$id}-actions-wrap-col`}>
            <Form.Item
              id={`${$id}-actions-wrap-form-item`}
              style={{
                textAlign: props.actionsAlign || (isHorizonLayout ? "center" : "left"),
              }}
              {...props.actionsLayout}
            >
              {formActionRocks.length === 1 ? (
                renderRock({ context, rockConfig: formActionRocks[0] })
              ) : (
                <Space size={16}>{formActionRocks.map((rock) => renderRock({ context, rockConfig: rock }))}</Space>
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
    </Form>
  );
}

function omitUndefinedValues(data: Record<string, any>) {
  return mapValues(data, (v) => (v === undefined ? null : v));
}

export default {
  $type: RAPID_FORM_ROCK_TYPE,

  onResolveState(props, state) {
    const [form] = Form.useForm();
    return {
      form,
    };
  },

  async onReceiveMessage(message, state, props, rockInstance) {
    // TODO: refactor to write less if-else
    const form = state.form;
    if (message.name === "submit") {
      try {
        const values = await form.validateFields();
        form.submit();
      } catch (err) {
        message.framework.getRockLogger().error(props, `Failed to submit form: ${err.message}`, { error: err });
      }
    } else if (message.name === "validateFields") {
      state.form.validateFields();
    } else if (message.name === "setFieldsValue") {
      state.form.setFieldsValue(message.payload);
    } else if (message.name === "resetFields") {
      state.form.resetFields();
      await fireEvent({
        eventName: "onFormRefresh",
        framework: message.framework,
        page: message.page as any,
        scope: rockInstance._scope,
        sender: { ...props, form },
        senderCategory: "component",
        eventHandlers: props.onFormRefresh,
        eventArgs: [{ form: state.form }],
      });
    } else if (message.name === "refreshView") {
      state.form.resetFields();
      await fireEvent({
        eventName: "onFormRefresh",
        framework: message.framework,
        page: message.page as any,
        scope: rockInstance._scope,
        sender: { ...props, form },
        senderCategory: "component",
        eventHandlers: props.onFormRefresh,
        eventArgs: [{ form: state.form }],
      });
    } else if (message.name === "setSubmitOptions") {
      state.submitOptions = message.payload;
    }
  },

  Renderer(context, props, state) {
    return RapidForm(props);
  },

  ...RapidFormMeta,
} as Rock<RapidFormRockConfig, RapidFormState>;
