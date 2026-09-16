import { HttpError, json, readJson } from './http';

const SESSION_COOKIE = 'admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/** POST /api/admin/login  body: { password } */
export async function login(request: Request, env: Env): Promise<Response> {
  if (!env.ADMIN_PASSWORD) {
    throw new HttpError(500, 'Admin login is not configured');
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const now = Date.now();

  // Rate limit: refuse once this IP has too many recent failures.
  const recent = await env.DB.prepare('SELECT COUNT(*) AS count FROM login_attempts WHERE ip = ?1 AND attempted_at > ?2')
    .bind(ip, now - ATTEMPT_WINDOW_MS)
    .first<{ count: number }>();
  if ((recent?.count ?? 0) >= MAX_FAILED_ATTEMPTS) {
    throw new HttpError(429, 'Too many failed attempts. Try again in 15 minutes.');
  }

  const body = await readJson(request);
  const password = typeof body['password'] === 'string' ? body['password'] : '';

  if (!(await passwordMatches(password, env.ADMIN_PASSWORD))) {
    await env.DB.batch([
      env.DB.prepare('INSERT INTO login_attempts (ip, attempted_at) VALUES (?1, ?2)').bind(ip, now),
      env.DB.prepare('DELETE FROM login_attempts WHERE attempted_at <= ?1').bind(now - ATTEMPT_WINDOW_MS),
    ]);
    throw new HttpError(401, 'Incorrect password');
  }

  const token = randomToken();
  await env.DB.batch([
    env.DB.prepare('INSERT INTO sessions (token_hash, created_at, expires_at) VALUES (?1, ?2, ?3)').bind(
      await sha256Hex(token),
      now,
      now + SESSION_TTL_SECONDS * 1000,
    ),
    env.DB.prepare('DELETE FROM sessions WHERE expires_at <= ?1').bind(now),
    env.DB.prepare('DELETE FROM login_attempts WHERE ip = ?1').bind(ip),
  ]);

  return json({ ok: true }, { headers: { 'Set-Cookie': sessionCookie(request, token, SESSION_TTL_SECONDS) } });
}

/** POST /api/admin/logout */
export async function logout(request: Request, env: Env): Promise<Response> {
  const token = readSessionToken(request);
  if (token) {
    await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?1').bind(await sha256Hex(token)).run();
  }
  return json({ ok: true }, { headers: { 'Set-Cookie': sessionCookie(request, '', 0) } });
}

/** Throws 401 unless the request carries a valid, unexpired session cookie. */
export async function requireAdmin(request: Request, env: Env): Promise<void> {
  const token = readSessionToken(request);
  if (!token) throw new HttpError(401, 'Not signed in');

  const session = await env.DB.prepare('SELECT 1 FROM sessions WHERE token_hash = ?1 AND expires_at > ?2')
    .bind(await sha256Hex(token), Date.now())
    .first();
  if (!session) throw new HttpError(401, 'Session expired. Please sign in again.');
}

/**
 * Compares in constant time so response timing does not reveal how much of the
 * password was right. Hashing first gives both inputs the same length, which
 * timingSafeEqual requires.
 */
async function passwordMatches(candidate: string, expected: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(candidate)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected)),
  ]);
  return crypto.subtle.timingSafeEqual(a, b);
}

function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function readSessionToken(request: Request): string | null {
  const cookies = request.headers.get('Cookie') ?? '';
  for (const part of cookies.split(';')) {
    const [name, ...rest] = part.trim().split('=');
    if (name === SESSION_COOKIE) return rest.join('=') || null;
  }
  return null;
}

/**
 * HttpOnly: page JavaScript cannot read the cookie, so an XSS bug cannot steal it.
 * SameSite=Strict: the browser never sends it on requests started by other sites.
 * Path=/api/admin: it is only sent to admin API routes.
 * Secure: HTTPS only (skipped on plain-http localhost during development).
 */
function sessionCookie(request: Request, token: string, maxAgeSeconds: number): string {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${SESSION_COOKIE}=${token}; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=${maxAgeSeconds}${secure}`;
}
