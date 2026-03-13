import { EventEmitter, type Rock } from "@ruiapp/move-style";
import { RapidEntityTableSelectRockConfig } from "./rapid-entity-table-select-types";
import { renderRock } from "@ruiapp/react-renderer";
import RapidEntityTableSelectMeta from "./RapidEntityTableSelectMeta";
import rapidAppDefinition from "../../rapidAppDefinition";
import { useEffect } from "react";
import { generateRockConfigOfError } from "../../rock-generators/generateRockConfigOfError";
import { autoConfigTableColumnToRockConfig } from "../rapid-entity-list/RapidEntityList";
import { filter, map, uniq } from "lodash";
import { RapidTableSelectRockConfig } from "../rapid-table-select/rapid-table-select-types";
import { RapidTableColumnConfig } from "../rapid-table-column/rapid-table-column-types";

const bus = new EventEmitter();

export default {
  onReceiveMessage(message, state, props) {
    if (message.name === "refreshData") {
      bus.emit(`${props.$id}-refresh`, message.payload);
    } else if (message.name === "reload") {
      bus.emit(`${props.$id}-reload`);
    }
  },
  Renderer(context, props) {
    const logger = context.framework.getRockLogger();
    const { entityCode, queryProperties, extraProperties, relations, fixedFilters, orderBy, keepNonPropertyFields, ...rapidTableSelectProps } = props;
    let { columns } = props;

    let mainEntity = null;
    if (entityCode) {
      mainEntity = rapidAppDefinition.getEntityByCode(entityCode);
      if (!mainEntity) {
        const errorRockConfig = generateRockConfigOfError(new Error(`Entitiy with code '${entityCode}' not found.`));
        return renderRock({ context, rockConfig: errorRockConfig });
      }
    }

    useEffect(() => {
      const refreshEventKey = `${props.$id}-refresh`;
      const refreshHandler = () => {
        context.page.sendComponentMessage(`${props.$id}-tableselect`, {
          name: "refreshData",
        });
      };
      const reloadEventKey = `${props.$id}-reload`;
      const reloadHandler = () => {
        context.page.sendComponentMessage(`${props.$id}-tableselect`, {
          name: "reload",
        });
      };

      bus.on(refreshEventKey, refreshHandler);
      bus.on(reloadEventKey, reloadHandler);
      return () => {
        bus.off(refreshEventKey, refreshHandler);
        bus.off(reloadEventKey, reloadHandler);
      };
    }, [props.$id]);

    if (!columns) {
      columns = [
        {
          code: mainEntity.displayPropertyCode,
        },
      ] satisfies RapidEntityTableSelectRockConfig["columns"];
    }
    const tableColumnRocks: RapidTableColumnConfig[] = columns.map((column) => autoConfigTableColumnToRockConfig(context, logger, props, column, mainEntity));

    const properties: string[] = uniq(
      queryProperties || [
        "id",
        ...map(
          filter(columns, (column) => !!column.code),
          (column) => column.code,
        ),
        ...(extraProperties || []),
      ],
    );

    const rockConfig: RapidTableSelectRockConfig = {
      ...rapidTableSelectProps,
      $id: `${props.$id}-tableselect`,
      $type: "rapidTableSelect",
      columns: tableColumnRocks,
      requestConfig: props.requestConfig || {
        url: `/${mainEntity?.namespace}/${mainEntity?.pluralCode}/operations/find`,
        method: "post",
        params: {
          fixedFilters,
          properties,
          relations,
          orderBy,
          keepNonPropertyFields,
        },
      },
      $exps: props.$exps,
    };

    return renderRock({ context, rockConfig });
  },

  ...RapidEntityTableSelectMeta,
} as Rock<RapidEntityTableSelectRockConfig>;
