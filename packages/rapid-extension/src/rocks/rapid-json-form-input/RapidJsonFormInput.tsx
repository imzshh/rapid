import { fireEvent, MoveStyleUtils, Rock, RockComponentProps, RockConfig, RockInstanceProps } from "@ruiapp/move-style";
import RapidJsonFormInputMeta from "./RapidJsonFormInputMeta";
import { RapidJsonFormInputProps, RapidJsonFormInputRockConfig } from "./rapid-json-form-input-types";
import { message, Modal } from "antd";
import { useRef, useState } from "react";
import { renderRock, useRockInstance, useRockInstanceContext, wrapToRockComponent } from "@ruiapp/react-renderer";

export function configRapidJsonFormInput(config: RockComponentProps<RapidJsonFormInputRockConfig>): RapidJsonFormInputRockConfig {
  config.$type = RapidJsonFormInputMeta.$type;
  return config as RapidJsonFormInputRockConfig;
}

export function RapidJsonFormInputComponent(props: RockInstanceProps<RapidJsonFormInputProps>) {
  const context = useRockInstanceContext();
  const { $id } = useRockInstance(props, RapidJsonFormInputMeta.$type);
  const { value, onChange } = props;

  const cmdsEditor = useRef<{
    getCodeContent(): string;
    setCodeContent(codeContent: string): void;
  }>(null);
  const [codeEditorVisible, setCodeEditorVisible] = useState(false);

  const onBtnEditClick = async () => {
    setCodeEditorVisible(true);
    await MoveStyleUtils.waitVariable("current", cmdsEditor);
    cmdsEditor.current.setCodeContent((value && JSON.stringify(value, null, 4)) || "");
  };

  const onModalOk = () => {
    if (!cmdsEditor.current) {
      return;
    }

    if (!onChange) {
      return;
    }

    let codeContent = cmdsEditor.current.getCodeContent();
    let newValue: any;
    if (codeContent) {
      codeContent = codeContent.trim();
    }
    if (codeContent) {
      try {
        newValue = JSON.parse(codeContent);
      } catch (ex) {
        message.error("Invalid JSON string.");
        return;
      }
    } else {
      newValue = null;
    }

    setCodeEditorVisible(false);
    onChange(newValue);
  };

  const onModalCancel = () => {
    setCodeEditorVisible(false);
  };

  const editorConfig: RockConfig = {
    $id: `${$id}-editor`,
    $type: "monacoEditor",
    cmds: cmdsEditor,
    width: "100%",
    height: "500px",
    language: "json",
  };

  return (
    <>
      <a onClick={onBtnEditClick}>Edit</a>
      <Modal title="Edit code" open={codeEditorVisible} width="800px" onOk={onModalOk} onCancel={onModalCancel}>
        <div style={{ height: 500 }}>{renderRock({ context, rockConfig: editorConfig })}</div>
      </Modal>
    </>
  );
}

export const RapidJsonFormInput = wrapToRockComponent(RapidJsonFormInputMeta, RapidJsonFormInputComponent);

export default {
  Renderer: RapidJsonFormInputComponent,
  ...RapidJsonFormInputMeta,
} as Rock<RapidJsonFormInputRockConfig>;
