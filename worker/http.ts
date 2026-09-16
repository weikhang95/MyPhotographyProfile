import type { ApiError } from '../shared/api-types';

const MAX_BODY_BYTES = 16_000;

/** Thrown by handlers to return a specific status code and message to the client. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly details?: ApiError['details'],
  ) {
    super(message);
  }
}

export function json(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  // API responses contain private or fast-changing data; never cache them.
  headers.set('Cache-Control', 'no-store');
  return new Response(JSON.stringify(data), { ...init, headers });
}

export function errorResponse(error: HttpError): Response {
  const body: ApiError = { error: error.message };
  if (error.details) body.details = error.details;
  return json(body, { status: error.status });
}

/**
 * Parses a JSON object body. Requiring `application/json` also blocks CSRF:
 * a cross-site HTML form cannot send that content type without a CORS
 * preflight, and this API never answers preflights.
 */
export async function readJson(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get('Content-Type') ?? '';
  if (!contentType.toLowerCase().startsWith('application/json')) {
    throw new HttpError(415, 'Expected an application/json body');
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
    throw new HttpError(413, 'Request body is too large');
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    throw new HttpError(400, 'Request body is not valid JSON');
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new HttpError(400, 'Expected a JSON object');
  }
  return body as Record<string, unknown>;
}
