import { fireEvent, MoveStyleUtils, Rock, RockConfig, RockInstance } from "@ruiapp/move-style";
import RapidJsonFormInputMeta from "./RapidJsonFormInputMeta";
import { RapidJsonFormInputProps, RapidJsonFormInputRockConfig } from "./rapid-json-form-input-types";
import { Modal } from "antd";
import { useRef, useState } from "react";
import { genRockRenderer, renderRock } from "@ruiapp/react-renderer";

export function configRapidJsonFormInput(config: RapidJsonFormInputRockConfig): RapidJsonFormInputRockConfig {
  return config;
}

export function RapidJsonFormInput(props: RapidJsonFormInputProps) {
  const { $id, _context: context } = props as any as RockInstance;
  const { value, onChange } = props;
  const { framework, page, scope } = context;
  const logger = framework.getRockLogger(RapidJsonFormInputMeta.$type, $id);

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

    let codeContent = cmdsEditor.current.getCodeContent();
    let newValue: any;
    if (codeContent) {
      codeContent = codeContent.trim();
    }
    if (codeContent) {
      try {
        newValue = JSON.parse(codeContent);
      } catch (ex) {
        logger.error(props, "Invalid JSON string.", { error: ex });
      }
    } else {
      newValue = null;
    }

    setCodeEditorVisible(false);
    fireEvent({
      eventName: "onChange",
      framework,
      page,
      scope,
      sender: props,
      senderCategory: "component",
      eventHandlers: onChange,
      eventArgs: [newValue],
    });
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

export default {
  Renderer: genRockRenderer(RapidJsonFormInputMeta.$type, RapidJsonFormInput, true),
  ...RapidJsonFormInputMeta,
} as Rock<RapidJsonFormInputRockConfig>;
