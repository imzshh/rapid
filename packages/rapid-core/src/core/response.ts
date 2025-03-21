import { isArray, isObject } from "lodash";
import { HttpStatus, ResponseData } from "./http-types";

export const GlobalResponse = global.Response;

function mergeHeaders(target: Headers, source: HeadersInit) {
  if (source instanceof Headers) {
    for (const keyValuePair of source.entries()) {
      target.set(keyValuePair[0], keyValuePair[1]);
    }
  } else if (isArray(source)) {
    for (const keyValuePair of source) {
      target.set(keyValuePair[0], keyValuePair[1]);
    }
  } else if (isObject(source)) {
    Object.entries(source).forEach(([key, value]) => target.set(key, value));
  }
}

interface NewResponseOptions {
  body?: ResponseData;
  status?: HttpStatus;
  headers?: HeadersInit;
}

function newResponse(options: NewResponseOptions) {
  return new Response(options.body, {
    headers: options.headers,
    status: options.status || 200,
  });
}

export class RapidResponse {
  // TODO: remove this field.
  #response: Response;
  status: number;
  body: BodyInit;
  headers: Headers;

  constructor(body?: BodyInit, init?: ResponseInit) {
    this.body = body;
    this.headers = new Headers(init?.headers);
    this.status = init?.status;
  }

  json(obj: any, status?: HttpStatus, headers?: HeadersInit) {
    let body: string | null = null;
    if (obj) {
      body = JSON.stringify(obj);
    }
    this.headers.set("Content-Type", "application/json");
    const responseHeaders = new Headers(this.headers);
    if (headers) {
      mergeHeaders(responseHeaders, headers);
    }
    this.status = status || 200;
    this.body = body;
    this.#response = newResponse({ body, status: this.status, headers: responseHeaders });
  }

  redirect(location: string, status?: HttpStatus) {
    this.headers.set("Location", location);
    this.status = status || 302;
    this.#response = newResponse({
      headers: this.headers,
      status: this.status,
    });
  }

  getResponse() {
    if (!this.#response) {
      this.#response = new Response(this.body, {
        status: this.status || 200,
        headers: this.headers,
      });
    }
    return this.#response;
  }
}
