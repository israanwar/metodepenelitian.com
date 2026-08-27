/**
 * Platform Phase 1 — organization membership.
 *
 * POST: add a member to an organization. Requires the caller to already
 * hold admin+ rank in that org. A non-member gets 404 (object-enumeration
 * safe: the same response whether the org exists or not), a member below
 * admin rank gets 403 (they already know the org exists). "owner" is
 * never accepted as a grantable role through this endpoint — ownership
 * assignment is out of Phase 1 scope; the database's own rank check
 * would reject it regardless (defense in depth, not the only guard).
 * See docs/implementation/P0 BACKEND IMPLEMENTATION SEQUENCE.md, Phase 1.
 */
import { NextResponse } from "next/server";
import { CORRELATION_HEADER, getOrCreateCorrelationId } from "@/lib/platform/correlation";
import { getAuthContext } from "@/lib/platform/auth";
import { authorizeOrgAction, type OrgRole } from "@/lib/platform/authz";
import { toErrorEnvelope, PlatformError } from "@/lib/platform/errors";
import { logger } from "@/lib/platform/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const GRANTABLE_ROLES: OrgRole[] = ["member", "admin"];

function respondError(err: unknown, correlationId: string) {
  const { envelope, httpStatus } = toErrorEnvelope(err, correlationId);
  return NextResponse.json(envelope, { status: httpStatus, headers: { [CORRELATION_HEADER]: correlationId } });
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const correlationId = getOrCreateCorrelationId(request.headers);
  const orgId = params.id;

  if (!UUID_PATTERN.test(orgId)) {
    return respondError(new PlatformError("INVALID_ORG_ID", "Organization id must be a UUID.", 400), correlationId);
  }

  const context = await getAuthContext(request.headers);
  if (!context) {
    return respondError(new PlatformError("UNAUTHENTICATED", "Sign in required.", 401), correlationId);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return respondError(new PlatformError("INVALID_BODY", "Request body must be valid JSON.", 400), correlationId);
  }

  const userId = (body as Record<string, unknown>)?.userId;
  const role = (body as Record<string, unknown>)?.role;

  if (typeof userId !== "string" || !UUID_PATTERN.test(userId)) {
    return respondError(new PlatformError("INVALID_USER_ID", '"userId" is required and must be a UUID.', 400), correlationId);
  }
  if (typeof role !== "string" || !GRANTABLE_ROLES.includes(role as OrgRole)) {
    return respondError(
      new PlatformError("INVALID_ROLE", `"role" must be one of: ${GRANTABLE_ROLES.join(", ")}.`, 400),
      correlationId
    );
  }

  const decision = await authorizeOrgAction(context, orgId, "admin");
  if (decision.rank <= 0) {
    // Not a member at all: do not reveal whether the org exists.
    logger.info("member-add denied: not a member (or org does not exist)", { correlationId, orgId, actor: context.user.id });
    return respondError(new PlatformError("NOT_FOUND", "Organization not found.", 404), correlationId);
  }
  if (!decision.allowed) {
    logger.info("member-add denied: insufficient role", { correlationId, orgId, actor: context.user.id, reason: decision.reason });
    return respondError(new PlatformError("FORBIDDEN", decision.reason, 403), correlationId);
  }

  const { data, error } = await context.client
    .from("organization_members")
    .insert({ org_id: orgId, user_id: userId, role, invited_by: context.user.id })
    .select("id, org_id, user_id, role, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return respondError(new PlatformError("ALREADY_MEMBER", "That user is already a member of this organization.", 409), correlationId);
    }
    if (error.code === "42501") {
      // RLS WITH CHECK violation the app-level rank check above did not
      // already catch (e.g. a rank-comparison edge case) — deny, don't crash.
      logger.info("member-add denied by database policy", { correlationId, orgId, actor: context.user.id });
      return respondError(new PlatformError("FORBIDDEN", "Not permitted to grant this role.", 403), correlationId);
    }
    logger.error("add member failed", { correlationId, error: error.message, code: error.code });
    return respondError(new PlatformError("MEMBER_ADD_FAILED", "Could not add the member.", 500), correlationId);
  }

  logger.info("member added", { correlationId, orgId, actor: context.user.id, newMember: userId, role });
  return NextResponse.json({ member: data, correlationId }, { status: 201, headers: { [CORRELATION_HEADER]: correlationId } });
}
