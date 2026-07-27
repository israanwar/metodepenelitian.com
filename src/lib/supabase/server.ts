import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client using the service role key.
 * NEVER import this into a client component — it bypasses RLS.
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
