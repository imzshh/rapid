import { Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import RapidUploaderFormInputMeta from "./RapidUploaderFormInputMeta";
import { useRockInstanceContext, wrapToRockComponent } from "@ruiapp/react-renderer";
import { RapidFileInfo, RapidUploaderFormInputProps, RapidUploaderFormInputRockConfig } from "./rapid-uploader-form-input-types";
import { Button, Upload, UploadFile, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { isArray, set } from "lodash";
import { useCallback, useMemo } from "react";
import { getExtensionLocaleStringResource } from "~/helpers/i18nHelper";

export function configRapidUploaderFormInput(config: RockComponentProps<RapidUploaderFormInputRockConfig>): RapidUploaderFormInputRockConfig {
  config.$type = RapidUploaderFormInputMeta.$type;
  return config as RapidUploaderFormInputRockConfig;
}

export function RapidUploaderFormInputComponent(props: RockInstanceProps<RapidUploaderFormInputProps>) {
  const context = useRockInstanceContext();
  const { framework } = context;
  const onUploadChange = useCallback<UploadProps["onChange"]>(
    (info) => {
      const file = info.file;
      if (file) {
        if (file.status === "done") {
          const rpdFileInfo: RapidFileInfo = {
            name: file.name,
            key: file.response.fileKey,
            size: file.size,
            type: file.type,
          };

          props.onUploaded?.(rpdFileInfo);
          let value: RapidFileInfo | RapidFileInfo[] | null = props.value || null;
          if (props.multiple) {
            if (isArray(value)) {
              value = [...value, rpdFileInfo];
            } else if (value) {
              value = [value, rpdFileInfo];
            } else {
              value = [rpdFileInfo];
            }
          } else {
            value = rpdFileInfo;
          }
          props.onChange?.(value);
        }
      }
    },
    [props.value, props.onChange, props.multiple],
  );

  const onRemoveFile = useCallback<UploadProps["onRemove"]>(
    (file) => {
      let { value } = props;
      if (!value) {
        return;
      }

      if (isArray(value)) {
        const fileKey = file.uid;
        value = value.filter((item) => item.key !== fileKey);
      } else {
        value = null;
      }

      props.onChange?.(value);
    },
    [props.value, props.onChange],
  );

  const defaultFileList = useMemo(() => {
    const { value } = props;
    if (!value) {
      return undefined;
    }
    if (isArray(value)) {
      return value.map(convertRpdFileInfoToAntdFileInfo);
    }

    return [convertRpdFileInfoToAntdFileInfo(value)];
  }, [props.value]);

  const buttonText = props.buttonText || getExtensionLocaleStringResource(framework, "uploadButtonText");
  const uploadProps = { ...props.uploadProps };
  if (!props.multiple) {
    set(uploadProps, "maxCount", 1);
  }

  return (
    <Upload {...uploadProps} defaultFileList={defaultFileList} onChange={onUploadChange} onRemove={onRemoveFile}>
      <Button icon={<UploadOutlined />}>{buttonText}</Button>
    </Upload>
  );
}

function convertRpdFileInfoToAntdFileInfo(source: RapidFileInfo): UploadFile {
  return {
    uid: source.key,
    name: source.name,
    size: source.size,
    type: source.type,
  };
}

export const RapidUploaderFormInput = wrapToRockComponent(RapidUploaderFormInputMeta, RapidUploaderFormInputComponent);

export default {
  Renderer: RapidUploaderFormInputComponent,
  ...RapidUploaderFormInputMeta,
} as Rock<RapidUploaderFormInputRockConfig>;
