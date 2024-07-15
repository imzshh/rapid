import {
  EventEmitter,
  Framework,
  HttpRequestOptions,
  IStore,
  MoveStyleUtils,
  Page,
  RuiModuleLogger,
  Scope,
  StoreConfigBase,
  StoreMeta,
} from "@ruiapp/move-style";
import { cloneDeep, find, set } from "lodash";
import rapidAppDefinition from "../rapidAppDefinition";
import type { FindEntityOptions, RapidEntity } from "../types/rapid-entity-types";

export interface EntityStoreConfig extends StoreConfigBase, FindEntityOptions {
  type: "entityStore";
  entityModel?: RapidEntity;
  entityCode?: string;
  frozon?: boolean;
  fixedFilters?: FindEntityOptions["filters"];
}

export class EntityStore implements IStore<EntityStoreConfig> {
  #framework: Framework;
  #logger: RuiModuleLogger;
  #page: Page;
  #scope: Scope;
  #name: string;
  #emitter: EventEmitter;
  #data?: any;
  #config: EntityStoreConfig;
  #isLoading: boolean;

  constructor(framework: Framework, page: Page, scope: Scope) {
    this.#emitter = new EventEmitter();
    this.#framework = framework;
    this.#logger = framework.getLogger("store");
    this.#page = page;
    this.#scope = scope;
    this.#name = "";
    this.#isLoading = false;
    this.#config = {} as any;
  }

  get name(): string {
    return this.#name;
  }

  setConfig(storeConfig: EntityStoreConfig) {
    this.#config = storeConfig;
    this.#name = storeConfig.name;
  }

  getConfig() {
    return this.#config;
  }

  updateConfig(storeConfig: Partial<EntityStoreConfig>) {
    Object.assign(this.#config, storeConfig);
  }

  setPropertyExpression(propName: string, propExpression: string) {
    if (!this.#config.$exps) {
      this.#config.$exps = {};
    }
    this.#config.$exps[propName] = propExpression;
  }

  setPagination(pagination: FindEntityOptions["pagination"]) {
    if (pagination) {
      Object.assign(this.#config, { pagination });
    } else {
      this.#config.pagination = null;
    }
  }

  setFrozon(frozon: boolean) {
    this.#config.frozon = frozon;
  }

  async loadData(input?: any): Promise<any> {
    this.#logger.debug(`Loading entity store data, name='${this.name}'`);
    if (this.#isLoading) {
      return;
    }

    this.#isLoading = true;

    let entityModel = this.#config.entityModel;
    if (!entityModel) {
      const entities = rapidAppDefinition.getEntities();
      const entityCode = this.#config.entityCode;
      entityModel = find(entities, (item) => item.code === entityCode);
    }

    if (!entityModel) {
      this.#logger.debug(`Can not find entity model of store '${this.name}'`, { storeConfig: this.#config });
      return;
    }

    const expressions = this.#config.$exps;
    const config: Partial<EntityStoreConfig> = {
      fixedFilters: cloneDeep(this.#config.fixedFilters),
      filters: cloneDeep(this.#config.filters),
      orderBy: cloneDeep(this.#config.orderBy),
      properties: cloneDeep(this.#config.properties),
      relations: cloneDeep(this.#config.relations),
      pagination: cloneDeep(this.#config.pagination),
      keepNonPropertyFields: this.#config.keepNonPropertyFields,
    };

    if (expressions) {
      for (const propName in expressions) {
        if (propName.startsWith("$")) {
          this.#logger.error(`System field can not bind to an expression. ${propName}=${expressions[propName]}`);
          continue;
        }
        const interpretedValue = this.#page.interpreteExpression(expressions[propName], {
          $scope: this.#scope,
        });
        set(config, propName, interpretedValue);
      }
    }

    if (config.frozon) {
      this.#isLoading = false;
      return;
    }

    const requestOptions: HttpRequestOptions<FindEntityOptions> = {
      method: "POST",
      url: `/api/${entityModel.namespace}/${entityModel.pluralCode}/operations/find`,
      data: {
        filters: config.filters,
        orderBy: config.orderBy,
        properties: config.properties,
        relations: config.relations,
        pagination: config.pagination,
        keepNonPropertyFields: config.keepNonPropertyFields,
      },
    };

    if (input) {
      Object.assign(requestOptions.data!, input);
    }

    const { fixedFilters } = config;
    if (fixedFilters && fixedFilters.length) {
      requestOptions.data!.filters = [
        {
          operator: "and",
          filters: [...fixedFilters, ...(requestOptions.data!.filters! || [])],
        },
      ];
    }

    const response = await MoveStyleUtils.request(requestOptions);
    // TODO: should deal with response.statusCode
    // TODO: need something like ResponseDataTransformer.
    const data = response.data;

    this.#data = data;
    this.#isLoading = false;
    this.#emitter.emit("dataChange", data);

    return data;
  }

  observe(callback: (data: any) => void): void {
    this.#emitter.on("dataChange", callback);
  }

  get data() {
    return this.#data;
  }
}

export default {
  type: "entityStore",
  store: EntityStore,
} as StoreMeta<EntityStoreConfig>;
