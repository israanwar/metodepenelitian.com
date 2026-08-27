/**
 * Platform Phase 0 — database connection lifecycle check.
 *
 * A single, honest probe used by the readiness endpoint: never throws, never
 * reports "ok" unless a real round trip to the database succeeded, and
 * bounds how long it will wait so an unavailable database fails fast rather
 * than hanging a request.
 * See docs/implementation/P0 BACKEND IMPLEMENTATION SEQUENCE.md, Phase 0.
 */
import { createServerClient } from "@/lib/supabase/server";

export interface DbCheckResult {
  ok: boolean;
  latencyMs: number;
  error?: string;
}

type ClientFactory = () => ReturnType<typeof createServerClient>;

const DEFAULT_TIMEOUT_MS = 3000;
/** Cheapest existing table to probe against — see supabase/schema.sql. */
const PROBE_TABLE = "profiles";

/**
 * Performs one lightweight round trip to the database and reports whether it
 * succeeded. Configuration errors, network errors, and timeouts are all
 * reported as `{ ok: false }` with a non-sensitive `error` string — this
 * function is not allowed to throw, since a readiness check that crashes is
 * worse than one that honestly reports "not ready".
 */
export async function checkDatabaseConnection(
  clientFactory: ClientFactory = createServerClient,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<DbCheckResult> {
  const startedAt = Date.now();

  try {
    const client = clientFactory();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const { error } = await client
        .from(PROBE_TABLE)
        .select("id", { head: true, count: "exact" })
        .abortSignal(controller.signal);

      if (error) {
        return { ok: false, latencyMs: Date.now() - startedAt, error: error.message };
      }
      return { ok: true, latencyMs: Date.now() - startedAt };
    } finally {
      clearTimeout(timeout);
    }
  } catch (err) {
    return {
      ok: false,
      latencyMs: Date.now() - startedAt,
      error: err instanceof Error ? err.message : "Unknown database error",
    };
  }
}
