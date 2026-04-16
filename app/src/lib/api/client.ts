import { ApiError } from "./types";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue>;

interface RequestOptions {
  query?: QueryParams;
  signal?: AbortSignal;
  headers?: Record<string, string>;
  expect?: "json" | "blob" | "void";
}

export interface ApiClientConfig {
  baseUrl: string;
  getToken: () => string | null;
  onUnauthorized?: () => void;
  fetchImpl?: typeof fetch;
}

export interface ApiClient {
  get<T = unknown>(path: string, opts?: RequestOptions): Promise<T>;
  post<T = unknown>(path: string, body?: unknown, opts?: RequestOptions): Promise<T>;
  put<T = unknown>(path: string, body?: unknown, opts?: RequestOptions): Promise<T>;
  patch<T = unknown>(path: string, body?: unknown, opts?: RequestOptions): Promise<T>;
  del<T = unknown>(path: string, opts?: RequestOptions): Promise<T>;
}

function buildUrl(baseUrl: string, path: string, query?: QueryParams): string {
  const url = new URL(path, baseUrl);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function parseErrorBody(response: Response): Promise<{
  message: string;
  code: string | null;
  details: unknown;
}> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      const body = (await response.json()) as {
        message?: string;
        error?: string;
        code?: string;
        details?: unknown;
      };
      return {
        message: body.message ?? body.error ?? response.statusText,
        code: body.code ?? null,
        details: body.details ?? body,
      };
    } catch {
      return { message: response.statusText, code: null, details: null };
    }
  }
  const text = await response.text().catch(() => "");
  return {
    message: text || response.statusText,
    code: null,
    details: null,
  };
}

export function createApiClient(config: ApiClientConfig): ApiClient {
  const fetchImpl = config.fetchImpl ?? globalThis.fetch.bind(globalThis);

  async function request<T>(
    method: HttpMethod,
    path: string,
    body: unknown,
    opts: RequestOptions = {}
  ): Promise<T> {
    const url = buildUrl(config.baseUrl, path, opts.query);

    const headers: Record<string, string> = {
      Accept: "application/json",
      ...opts.headers,
    };

    const token = config.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    let serializedBody: BodyInit | undefined;
    if (body !== undefined && body !== null) {
      headers["Content-Type"] = "application/json";
      serializedBody = JSON.stringify(body);
    }

    const response = await fetchImpl(url, {
      method,
      headers,
      body: serializedBody,
      signal: opts.signal,
    });

    if (response.status === 401) {
      config.onUnauthorized?.();
    }

    if (!response.ok) {
      const { message, code, details } = await parseErrorBody(response);
      throw new ApiError({ status: response.status, message, code, details });
    }

    const expect = opts.expect ?? "json";
    if (expect === "void" || response.status === 204) {
      return undefined as T;
    }
    if (expect === "blob") {
      return (await response.blob()) as T;
    }

    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
  }

  return {
    get: (path, opts) => request("GET", path, undefined, opts),
    post: (path, body, opts) => request("POST", path, body, opts),
    put: (path, body, opts) => request("PUT", path, body, opts),
    patch: (path, body, opts) => request("PATCH", path, body, opts),
    del: (path, opts) => request("DELETE", path, undefined, opts),
  };
}
