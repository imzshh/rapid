import type { RockConfig } from "@ruiapp/move-style";
import type { UploadProps } from "antd";

export const RAPID_UPLOADER_FORM_INPUT_ROCK_TYPE = "rapidUploaderFormInput" as const;

export type RapidFileInfo = {
  key: string;
  name: string;
  size: number;
  type: string;
};

export interface RapidUploaderFormInputProps {
  value?: RapidFileInfo | RapidFileInfo[] | null;
  buttonText?: string;
  uploadProps?: UploadProps;
  multiple?: boolean;
  onUploaded?(value: RapidFileInfo): void;
  onChange?(value: RapidFileInfo | RapidFileInfo[] | null): void;
}

export type RapidUploaderFormInputRockConfig = RockConfig<RapidUploaderFormInputProps, typeof RAPID_UPLOADER_FORM_INPUT_ROCK_TYPE>;
