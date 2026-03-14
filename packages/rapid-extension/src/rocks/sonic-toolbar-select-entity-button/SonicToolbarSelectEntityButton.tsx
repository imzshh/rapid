import type { Rock, RockInstance, RockEvent } from "@ruiapp/move-style";
import { genRockRenderer, renderRock } from "@ruiapp/react-renderer";
import SonicToolbarSelectEntityButtonMeta from "./SonicToolbarSelectEntityButtonMeta";
import type { SonicToolbarSelectEntityButtonProps, SonicToolbarSelectEntityButtonRockConfig } from "./sonic-toolbar-select-entity-button-types";
import { RapidToolbarButtonComponent } from "../rapid-toolbar-button/RapidToolbarButton";
import { Modal } from "antd";
import { useState } from "react";
import { getExtensionLocaleStringResource, getMetaEntityLocaleName } from "../../helpers/i18nHelper";
import rapidAppDefinition from "../../rapidAppDefinition";
import { find, get } from "lodash";
import type { SonicEntityListRockConfig } from "../sonic-entity-list/sonic-entity-list-types";

export function configSonicToolbarSelectEntityButton(config: SonicToolbarSelectEntityButtonRockConfig): SonicToolbarSelectEntityButtonRockConfig {
  return config;
}

export function SonicToolbarSelectEntityButton(props: SonicToolbarSelectEntityButtonProps) {
  const { $id, _context: context } = props as any as RockInstance;
  const { framework } = context;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<any[]>([]);

  const entities = rapidAppDefinition.getEntities();
  const mainEntity = find(entities, (item) => item.code === props.entityCode);
  const entityName = props.entityName || getMetaEntityLocaleName(framework, mainEntity);

  const handleButtonClick = () => {
    setModalOpen(true);
  };

  const handleModalCancel = () => {
    setModalOpen(false);
  };

  const handleModalOk = async () => {
    props.onSelected?.({ selectedIds, selectedRecords });
    setModalOpen(false);
  };

  const sonicEntityListConfig: SonicEntityListRockConfig = {
    $id: `${$id}-list`,
    $type: "sonicEntityList",
    entityCode: props.entityCode,
    viewMode: "table",
    selectionMode: "multiple",
    selectOnClickRow: get(props, "selectOnClickRow", true),
    fixedFilters: props.fixedFilters,
    extraProperties: props.extraProperties,
    queryProperties: props.queryProperties,
    orderBy: props.orderBy || [{ field: "id" }],
    pageSize: props.pageSize,
    extraActions:
      props.extraActions ||
      (props.quickSearchMode || props.quickSearchFields
        ? [
            {
              $type: "sonicToolbarFormItem",
              formItemType: "search",
              placeholder: "Search",
              actionEventName: "onSearch",
              filterMode: props.quickSearchMode || "contains",
              filterFields: props.quickSearchFields || ["name"],
            },
          ]
        : null),
    toolbox: props.toolbox || { disabled: true },
    columns: props.columns || [{ type: "auto", code: "name" }],
    onSelectedIdsChange: [
      {
        $action: "script",
        script: (event: RockEvent) => {
          const args = event.args[0];
          setSelectedIds(args.selectedIds);
          setSelectedRecords(args.selectedRecords);
        },
      },
    ],
  };

  return (
    <>
      <RapidToolbarButtonComponent {...props} onAction={handleButtonClick} />
      <Modal
        open={modalOpen}
        title={getExtensionLocaleStringResource(framework, "selectEntityModalTitle", { entityName })}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        {...props.modalProps}
      >
        {renderRock({ context, rockConfig: sonicEntityListConfig })}
      </Modal>
    </>
  );
}

export default {
  Renderer: genRockRenderer(SonicToolbarSelectEntityButtonMeta.$type, SonicToolbarSelectEntityButton, true),
  ...SonicToolbarSelectEntityButtonMeta,
} as Rock<SonicToolbarSelectEntityButtonRockConfig>;
