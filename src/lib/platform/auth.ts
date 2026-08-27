/**
 * Platform Phase 1 — session/identity resolution.
 *
 * Does not reimplement authentication: it validates the bearer token an
 * API route received against Supabase Auth (already the platform's
 * identity provider since Phase 0's `profiles` table) and hands back a
 * client scoped to that exact user, so every subsequent query is
 * Row-Level-Security-enforced as them.
 * See docs/implementation/P0 BACKEND IMPLEMENTATION SEQUENCE.md, Phase 1.
 */
import { createUserScopedClient } from "@/lib/supabase/server";

export interface AuthenticatedUser {
  id: string;
  email: string | null;
}

export interface AuthContext {
  user: AuthenticatedUser;
  /** RLS-enforced client acting as this user. Never a service-role client. */
  client: ReturnType<typeof createUserScopedClient>;
}

const BEARER_PREFIX = "Bearer ";

function extractBearerToken(headers: Headers): string | null {
  const raw = headers.get("authorization");
  if (!raw || !raw.startsWith(BEARER_PREFIX)) return null;
  const token = raw.slice(BEARER_PREFIX.length).trim();
  return token.length > 0 ? token : null;
}

/**
 * Resolves the authenticated user from a request's `Authorization: Bearer`
 * header. Fail-closed: a missing header, malformed token, expired
 * session, or Supabase Auth error all resolve to `null` — this function
 * never throws, so a caller cannot accidentally treat an auth failure as
 * an unhandled 500 instead of a deliberate 401.
 */
export async function getAuthContext(headers: Headers): Promise<AuthContext | null> {
  const token = extractBearerToken(headers);
  if (!token) return null;

  try {
    const client = createUserScopedClient(token);
    const { data, error } = await client.auth.getUser(token);
    if (error || !data.user) return null;
    return { user: { id: data.user.id, email: data.user.email ?? null }, client };
  } catch {
    return null;
  }
}
