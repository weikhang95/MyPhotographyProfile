import {
  ENQUIRY_LIMITS,
  ENQUIRY_STATUSES,
  type Enquiry,
  type EnquiryField,
  type EnquiryInput,
  type EnquiryPage,
  type EnquiryStatus,
} from '../shared/api-types';
import { HttpError, json, readJson } from './http';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const ENQUIRY_COLUMNS = 'id, name, email, subject, message, status, created_at';

export function validateEnquiry(body: Record<string, unknown>): EnquiryInput {
  const errors: Partial<Record<EnquiryField, string>> = {};

  const readField = (field: EnquiryField): string => {
    const { min, max } = ENQUIRY_LIMITS[field];
    const raw = body[field];
    const value = typeof raw === 'string' ? raw.trim() : '';

    if (value.length === 0) {
      errors[field] = 'This field is required';
    } else if (value.length < min) {
      errors[field] = `Must be at least ${min} characters`;
    } else if (value.length > max) {
      errors[field] = `Must be at most ${max} characters`;
    }
    return value;
  };

  const input: EnquiryInput = {
    name: readField('name'),
    email: readField('email').toLowerCase(),
    subject: readField('subject'),
    message: readField('message'),
  };

  if (!errors.email && !EMAIL_PATTERN.test(input.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (Object.keys(errors).length > 0) {
    throw new HttpError(422, 'Please fix the highlighted fields', errors);
  }
  return input;
}

/** POST /api/enquiries — public. */
export async function createEnquiry(request: Request, env: Env): Promise<Response> {
  const body = await readJson(request);

  // Honeypot: the `website` field is hidden from people, so only bots fill it in.
  // Pretend success so the bot learns nothing, but store nothing.
  if (typeof body['website'] === 'string' && body['website'].trim() !== '') {
    return json({ ok: true }, { status: 201 });
  }

  const input = validateEnquiry(body);

  // Placeholders (?1, ?2, …) keep user input out of the SQL text: no SQL injection.
  const row = await env.DB.prepare(
    'INSERT INTO enquiries (name, email, subject, message) VALUES (?1, ?2, ?3, ?4) RETURNING id',
  )
    .bind(input.name, input.email, input.subject, input.message)
    .first<{ id: number }>();

  return json({ ok: true, id: row?.id }, { status: 201 });
}

/** GET /api/admin/enquiries?status=new&page=1&pageSize=20 — admin only. */
export async function listEnquiries(url: URL, env: Env): Promise<Response> {
  const status = parseStatus(url.searchParams.get('status'));
  const page = parsePositiveInt(url.searchParams.get('page'), 1);
  const pageSize = Math.min(parsePositiveInt(url.searchParams.get('pageSize'), DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);
  const offset = (page - 1) * pageSize;

  const where = status ? 'WHERE status = ?1' : '';
  const filter = status ? [status] : [];

  // batch() sends all three queries to D1 in a single round trip.
  const [items, total, counts] = await env.DB.batch([
    env.DB.prepare(
      `SELECT ${ENQUIRY_COLUMNS} FROM enquiries ${where}
       ORDER BY created_at DESC, id DESC
       LIMIT ?${filter.length + 1} OFFSET ?${filter.length + 2}`,
    ).bind(...filter, pageSize, offset),
    env.DB.prepare(`SELECT COUNT(*) AS total FROM enquiries ${where}`).bind(...filter),
    env.DB.prepare('SELECT status, COUNT(*) AS count FROM enquiries GROUP BY status'),
  ]);

  const statusCounts = Object.fromEntries(ENQUIRY_STATUSES.map((s) => [s, 0])) as Record<EnquiryStatus, number>;
  for (const row of counts.results as { status: EnquiryStatus; count: number }[]) {
    statusCounts[row.status] = row.count;
  }

  const result: EnquiryPage = {
    items: items.results as unknown as Enquiry[],
    page,
    pageSize,
    total: (total.results[0] as { total: number } | undefined)?.total ?? 0,
    counts: statusCounts,
  };
  return json(result);
}

/** PATCH /api/admin/enquiries/:id  body: { status } — admin only. */
export async function updateEnquiry(request: Request, env: Env, id: number): Promise<Response> {
  const body = await readJson(request);
  const status = parseStatus(body['status']);
  if (!status) {
    throw new HttpError(422, 'Invalid status', { status: `Must be one of: ${ENQUIRY_STATUSES.join(', ')}` });
  }

  const enquiry = await env.DB.prepare(`UPDATE enquiries SET status = ?1 WHERE id = ?2 RETURNING ${ENQUIRY_COLUMNS}`)
    .bind(status, id)
    .first<Enquiry>();

  if (!enquiry) throw new HttpError(404, 'Enquiry not found');
  return json(enquiry);
}

/** DELETE /api/admin/enquiries/:id — admin only. */
export async function deleteEnquiry(env: Env, id: number): Promise<Response> {
  const result = await env.DB.prepare('DELETE FROM enquiries WHERE id = ?1').bind(id).run();
  if (result.meta.changes === 0) throw new HttpError(404, 'Enquiry not found');
  return new Response(null, { status: 204 });
}

function parseStatus(value: unknown): EnquiryStatus | null {
  return ENQUIRY_STATUSES.includes(value as EnquiryStatus) ? (value as EnquiryStatus) : null;
}

function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}
