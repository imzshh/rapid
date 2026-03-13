import { RockConfig } from "@ruiapp/move-style";
import { RapidFileInfo } from "../rapid-uploader-form-input/rapid-uploader-form-input-types";

export const RAPID_FILE_INFO_RENDERER_ROCK_TYPE = "rapidFileInfoRenderer" as const;

export interface RapidFileInfoRendererProps {
  value?: RapidFileInfo | RapidFileInfo[] | null;
  showFileSize?: boolean;
  fileSizeDecimalPlaces?: number;
  arrayRendererProps?: any;
}

export type RapidFileInfoRendererRockConfig = RockConfig<RapidFileInfoRendererProps, typeof RAPID_FILE_INFO_RENDERER_ROCK_TYPE>;
