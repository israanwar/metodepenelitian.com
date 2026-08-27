import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client using the service role key.
 * NEVER import this into a client component — it bypasses RLS.
 * Reserved for genuinely trusted server-only work (health checks,
 * SECURITY DEFINER-equivalent operations). Any operation performed on
 * behalf of a specific end user belongs to `createUserScopedClient`
 * instead, so Row Level Security stays the enforced boundary.
 */
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set them in .env.local for server-side data access."
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Server-side Supabase client acting AS one authenticated end user (their
 * own access token, anon key as the API key). Every query issued through
 * this client is Row-Level-Security-enforced exactly as if the user made
 * it directly — this is what Platform Phase 1's authorization kernel is
 * built on, and it is the client every API route must use once a user is
 * identified, precisely so a code bug can never silently bypass RLS the
 * way it could with `createServerClient`'s service-role key.
 */
export function createUserScopedClient(accessToken: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Set them in .env.local for server-side data access."
    );
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}
