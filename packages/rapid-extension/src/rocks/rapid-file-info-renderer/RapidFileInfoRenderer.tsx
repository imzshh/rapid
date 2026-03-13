import { Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import RapidFileInfoRendererMeta from "./RapidFileInfoRendererMeta";
import { RapidFileInfoRendererProps, RapidFileInfoRendererRockConfig } from "./rapid-file-info-renderer-types";
import { wrapToRockComponent } from "@ruiapp/react-renderer";
import { isArray } from "lodash";
import { RapidFileInfo } from "../rapid-uploader-form-input/rapid-uploader-form-input-types";
import { formatFileSize } from "../../utils/format-utility";
import rapidAppDefinition from "../../rapidAppDefinition";
import { RapidArrayRenderer } from "../rapid-array-renderer/RapidArrayRenderer";

export function configRapidFileInfoRenderer(config: RockComponentProps<RapidFileInfoRendererRockConfig>): RapidFileInfoRendererRockConfig {
  config.$type = RapidFileInfoRendererMeta.$type;
  return config as RapidFileInfoRendererRockConfig;
}

export function RapidFileInfoRendererComponent(props: RapidFileInfoRendererProps) {
  const { value, showFileSize, fileSizeDecimalPlaces } = props;
  if (!value) {
    return null;
  }

  if (isArray(value)) {
    return (
      <RapidArrayRenderer
        value={value}
        listContainer={(items) => <div>{items}</div>}
        itemContainer={(item) => <div>{item}</div>}
        item={(itemValue) => <RapidFileInfoRendererComponent value={itemValue} showFileSize={showFileSize} fileSizeDecimalPlaces={fileSizeDecimalPlaces} />}
        noSeparator={true}
        {...props.arrayRendererProps}
      />
    );
  } else {
    const apiBaseUrl = rapidAppDefinition.getApiBaseUrl();
    const fileInfo = value as RapidFileInfo;
    return (
      <>
        <a href={`${apiBaseUrl}/download/file?fileKey=${encodeURIComponent(fileInfo.key)}&fileName=${encodeURIComponent(fileInfo.name)}`}>
          {fileInfo.name.toString()}
        </a>
        {showFileSize ? ` (${formatFileSize(fileInfo.size, fileSizeDecimalPlaces)})` : ""}
      </>
    );
  }
}

export const RapidFileInfoRenderer = wrapToRockComponent(RapidFileInfoRendererMeta, RapidFileInfoRendererComponent);

export default {
  Renderer: RapidFileInfoRendererComponent,
  ...RapidFileInfoRendererMeta,
} as Rock<RapidFileInfoRendererRockConfig>;
