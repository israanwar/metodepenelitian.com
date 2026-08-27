/**
 * Platform Phase 1 — authorization kernel.
 *
 * One library every route/module calls instead of writing its own ad hoc
 * permission check (01 PLATFORM CORE.md: "no module is permitted to
 * implement its own ad hoc permission logic"). The rank mapping here is
 * intentionally identical to `org_role_rank()` in
 * supabase/migrations/20260827105119_phase1_identity_tenancy.sql — this
 * function informs which HTTP status/message a route returns, while the
 * database's own copy is the actual enforced boundary (RLS), so the two
 * are deliberately duplicated rather than coupled at runtime, and must be
 * changed together if the role set ever changes.
 * See docs/implementation/P0 BACKEND IMPLEMENTATION SEQUENCE.md, Phase 1.
 */
import type { AuthContext } from "./auth";

export type OrgRole = "member" | "admin" | "owner";

const ROLE_RANK: Record<OrgRole, number> = { member: 1, admin: 2, owner: 3 };

export function roleRank(role: OrgRole): number {
  return ROLE_RANK[role];
}

export interface AuthorizationDecision {
  allowed: boolean;
  /** Non-sensitive, safe to log or use in an error message. */
  reason: string;
}

/**
 * Pure decision given an already-resolved rank (0 = not a member). Kept
 * separate from the DB round trip so it is trivially unit-testable.
 */
export function decideByRank(actualRank: number, minRole: OrgRole): AuthorizationDecision {
  if (actualRank <= 0) {
    return { allowed: false, reason: "not a member of this organization" };
  }
  if (actualRank < roleRank(minRole)) {
    return { allowed: false, reason: `requires ${minRole}+ role` };
  }
  return { allowed: true, reason: "sufficient role" };
}

/**
 * Fetches the caller's own rank within one organization via the
 * database's `my_org_role_rank` function, through their own RLS-scoped
 * client (never a service-role client) — so this can never report a rank
 * the database itself would not also enforce. Returns 0 (not a member)
 * on any error, rather than throwing: an authorization check that can
 * crash is a fail-open risk, not an acceptable shortcut.
 */
export async function getMyOrgRank(client: AuthContext["client"], orgId: string): Promise<number> {
  const { data, error } = await client.rpc("my_org_role_rank", { check_org_id: orgId });
  if (error || typeof data !== "number") return 0;
  return data;
}

/**
 * Convenience wrapper combining the two calls above: resolve this user's
 * rank in `orgId`, then decide against `minRole`.
 */
export async function authorizeOrgAction(
  context: AuthContext,
  orgId: string,
  minRole: OrgRole
): Promise<AuthorizationDecision & { rank: number }> {
  const rank = await getMyOrgRank(context.client, orgId);
  return { ...decideByRank(rank, minRole), rank };
}
