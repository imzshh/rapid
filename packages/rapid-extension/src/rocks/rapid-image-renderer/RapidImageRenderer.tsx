import { Rock, RockComponentProps, RockInstanceProps } from "@ruiapp/move-style";
import RapidImageRendererMeta from "./RapidImageRendererMeta";
import { RapidImageRendererProps, RapidImageRendererRockConfig } from "./rapid-image-renderer-types";
import { wrapToRockComponent } from "@ruiapp/react-renderer";
import { isArray } from "lodash";
import { Image } from "antd";
import rapidAppDefinition from "../../rapidAppDefinition";

export function configRapidImageRenderer(config: RockComponentProps<RapidImageRendererRockConfig>): RapidImageRendererRockConfig {
  config.$type = RapidImageRendererMeta.$type;
  return config as RapidImageRendererRockConfig;
}

export function RapidImageRendererComponent(props: RockInstanceProps<RapidImageRendererProps>) {
  const { value, preview, height, width, fallback, alt, style, className } = props;

  if (!value) {
    return null;
  }

  if (isArray(value)) {
    return (
      <div className={className} style={{ display: "flex", gap: "8px", flexWrap: "wrap", ...style }}>
        {value.map((fileInfo, index) => (
          <RapidImageRendererComponent key={fileInfo.key || String(index)} {...({ value: fileInfo, preview, height, width, fallback, alt } as any)} />
        ))}
      </div>
    );
  }

  const fileInfo = value;
  const apiBaseUrl = rapidAppDefinition.getApiBaseUrl();
  const downloadUrl = `${apiBaseUrl}/download/file?fileKey=${encodeURIComponent(fileInfo.key)}&fileName=${encodeURIComponent(fileInfo.name)}`;

  return <Image className={className} style={style} src={downloadUrl} preview={preview} height={height} width={width} fallback={fallback} alt={alt} />;
}

export const RapidImageRenderer = wrapToRockComponent(RapidImageRendererMeta, RapidImageRendererComponent);

export default {
  Renderer: RapidImageRendererComponent,
  ...RapidImageRendererMeta,
} as Rock<RapidImageRendererRockConfig>;
