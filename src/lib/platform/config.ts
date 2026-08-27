/**
 * Platform Phase 0 — configuration schema and fail-closed validation.
 *
 * Every required environment variable is validated once, at the point of
 * use, before any downstream service (Supabase client, health checks) is
 * allowed to run. Missing or malformed configuration throws a `PlatformError`
 * immediately rather than letting the app boot into an inconsistent state.
 * Error messages name the missing/invalid key only — never its value — so a
 * config error can never leak a secret into logs or a response body.
 * See docs/implementation/P0 BACKEND IMPLEMENTATION SEQUENCE.md, Phase 0.
 */
import { PlatformError } from "./errors";

export type Env = Record<string, string | undefined>;

/** Configuration safe to read from a client component. */
export interface PublicConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  siteUrl: string;
}

/** Configuration that must never reach the client bundle. */
export interface ServerConfig extends PublicConfig {
  supabaseServiceRoleKey: string;
}

const CONFIG_INVALID = "CONFIG_INVALID";

function configError(message: string): PlatformError {
  // 503: an environment/config problem is a "not ready", not a client error.
  return new PlatformError(CONFIG_INVALID, message, 503);
}

function readRequired(env: Env, key: string): string {
  const value = env[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw configError(`Missing required environment variable: ${key}`);
  }
  return value;
}

function readUrl(env: Env, key: string): string {
  const value = readRequired(env, key);
  try {
    // eslint-disable-next-line no-new
    new URL(value);
  } catch {
    throw configError(`Environment variable ${key} is not a valid URL`);
  }
  return value;
}

/**
 * Loads and validates the public (client-safe) configuration.
 * Pass an explicit `env` (e.g. in a test) to avoid depending on process.env.
 */
export function loadPublicConfig(env: Env = process.env): PublicConfig {
  const supabaseUrl = readUrl(env, "NEXT_PUBLIC_SUPABASE_URL");
  const supabaseAnonKey = readRequired(env, "NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const siteUrl = env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

  return { supabaseUrl, supabaseAnonKey, siteUrl };
}

/**
 * Loads and validates the full server-side configuration, including the
 * service-role key. Never call this from client-executed code.
 */
export function loadServerConfig(env: Env = process.env): ServerConfig {
  const publicConfig = loadPublicConfig(env);
  const supabaseServiceRoleKey = readRequired(env, "SUPABASE_SERVICE_ROLE_KEY");

  return { ...publicConfig, supabaseServiceRoleKey };
}
