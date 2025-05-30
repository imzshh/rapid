import { FindEntityOptions, RunEntityActionHandlerOptions } from "~/types";
import runCollectionEntityActionHandler from "~/helpers/runCollectionEntityActionHandler";
import { removeFiltersWithNullValue } from "~/helpers/filterHelper";
import { ActionHandlerContext } from "~/core/actionHandler";
import { RapidPlugin } from "~/core/server";

export const code = "findCollectionEntities";

export async function handler(plugin: RapidPlugin, ctx: ActionHandlerContext, options: RunEntityActionHandlerOptions) {
  await runCollectionEntityActionHandler(ctx, options, code, true, false, async (entityManager, input: FindEntityOptions) => {
    const { routerContext: routeContext } = ctx;
    input.filters = removeFiltersWithNullValue(input.filters);
    input.routeContext = routeContext;
    const entities = await entityManager.findEntities(input);
    const result: {
      list: any;
      total?: any;
    } = { list: entities };

    if (input.pagination && !input.pagination.withoutTotal) {
      // TOOD: count entities when calling findEntities for performance.
      const total = await entityManager.count(input);
      result.total = total;
    }
    return result;
  });
}
