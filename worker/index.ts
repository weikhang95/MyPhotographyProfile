import { login, logout, requireAdmin } from './auth';
import { createEnquiry, deleteEnquiry, listEnquiries, updateEnquiry } from './enquiries';
import { errorResponse, HttpError, json } from './http';

interface RouteContext {
  request: Request;
  env: Env;
  url: URL;
  params: Record<string, string | undefined>;
}

interface Route {
  method: string;
  pattern: URLPattern;
  /** Admin routes require a valid session before the handler runs. */
  admin: boolean;
  handler: (ctx: RouteContext) => Promise<Response>;
}

const route = (method: string, pathname: string, admin: boolean, handler: Route['handler']): Route => ({
  method,
  pattern: new URLPattern({ pathname }),
  admin,
  handler,
});

const routes: Route[] = [
  route('POST', '/api/enquiries', false, ({ request, env }) => createEnquiry(request, env)),

  route('POST', '/api/admin/login', false, ({ request, env }) => login(request, env)),
  route('POST', '/api/admin/logout', false, ({ request, env }) => logout(request, env)),
  route('GET', '/api/admin/session', true, async () => json({ authenticated: true })),

  route('GET', '/api/admin/enquiries', true, ({ url, env }) => listEnquiries(url, env)),
  route('PATCH', '/api/admin/enquiries/:id', true, ({ request, env, params }) =>
    updateEnquiry(request, env, parseId(params['id'])),
  ),
  route('DELETE', '/api/admin/enquiries/:id', true, ({ env, params }) => deleteEnquiry(env, parseId(params['id']))),
];

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    // wrangler.jsonc only sends /api/* here; anything else is a static asset.
    if (!url.pathname.startsWith('/api/')) {
      return env.ASSETS.fetch(request);
    }

    try {
      const matches = routes
        .map((r) => ({ route: r, match: r.pattern.exec({ pathname: url.pathname }) }))
        .filter((m) => m.match !== null);

      if (matches.length === 0) throw new HttpError(404, 'Not found');

      const found = matches.find((m) => m.route.method === request.method);
      if (!found) {
        const allow = matches.map((m) => m.route.method).join(', ');
        return json({ error: 'Method not allowed' }, { status: 405, headers: { Allow: allow } });
      }

      if (found.route.admin) await requireAdmin(request, env);

      return await found.route.handler({ request, env, url, params: found.match!.pathname.groups });
    } catch (error) {
      if (error instanceof HttpError) return errorResponse(error);
      console.error('Unhandled API error', error);
      return errorResponse(new HttpError(500, 'Something went wrong'));
    }
  },
} satisfies ExportedHandler<Env>;

function parseId(value: string | undefined): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(404, 'Enquiry not found');
  return id;
}
