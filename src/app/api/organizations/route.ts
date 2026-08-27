/**
 * Platform Phase 1 — organizations collection.
 *
 * GET: list organizations the caller is a member of (RLS does the
 * filtering; this route does not add its own tenant filter on top).
 * POST: create a new organization; the caller becomes its owner
 * atomically (database trigger, not application code — see the Phase 1
 * migration's `bootstrap_org_owner`).
 * See docs/implementation/P0 BACKEND IMPLEMENTATION SEQUENCE.md, Phase 1.
 */
import { NextResponse } from "next/server";
import { CORRELATION_HEADER, getOrCreateCorrelationId } from "@/lib/platform/correlation";
import { getAuthContext } from "@/lib/platform/auth";
import { toErrorEnvelope, PlatformError } from "@/lib/platform/errors";
import { logger } from "@/lib/platform/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_NAME_LENGTH = 200;
const MAX_SLUG_LENGTH = 100;

function respondError(err: unknown, correlationId: string) {
  const { envelope, httpStatus } = toErrorEnvelope(err, correlationId);
  return NextResponse.json(envelope, { status: httpStatus, headers: { [CORRELATION_HEADER]: correlationId } });
}

export async function GET(request: Request) {
  const correlationId = getOrCreateCorrelationId(request.headers);

  const context = await getAuthContext(request.headers);
  if (!context) {
    return respondError(new PlatformError("UNAUTHENTICATED", "Sign in required.", 401), correlationId);
  }

  const { data, error } = await context.client
    .from("organizations")
    .select("id, name, slug, created_by, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("list organizations failed", { correlationId, error: error.message });
    return respondError(new PlatformError("ORG_LIST_FAILED", "Could not list organizations.", 500), correlationId);
  }

  logger.info("organizations listed", { correlationId, count: data.length });
  return NextResponse.json({ organizations: data, correlationId }, { status: 200, headers: { [CORRELATION_HEADER]: correlationId } });
}

export async function POST(request: Request) {
  const correlationId = getOrCreateCorrelationId(request.headers);

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

  const name = (body as Record<string, unknown>)?.name;
  const slug = (body as Record<string, unknown>)?.slug;

  if (typeof name !== "string" || name.trim().length === 0 || name.length > MAX_NAME_LENGTH) {
    return respondError(new PlatformError("INVALID_NAME", `"name" is required (1-${MAX_NAME_LENGTH} characters).`, 400), correlationId);
  }
  if (typeof slug !== "string" || slug.length > MAX_SLUG_LENGTH || !SLUG_PATTERN.test(slug)) {
    return respondError(
      new PlatformError("INVALID_SLUG", `"slug" is required and must be lowercase-kebab-case (1-${MAX_SLUG_LENGTH} characters).`, 400),
      correlationId
    );
  }

  const { data, error } = await context.client
    .from("organizations")
    .insert({ name: name.trim(), slug, created_by: context.user.id })
    .select("id, name, slug, created_by, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      // unique_violation on slug
      return respondError(new PlatformError("SLUG_TAKEN", "An organization with this slug already exists.", 409), correlationId);
    }
    logger.error("create organization failed", { correlationId, error: error.message, code: error.code });
    return respondError(new PlatformError("ORG_CREATE_FAILED", "Could not create the organization.", 500), correlationId);
  }

  logger.info("organization created", { correlationId, orgId: data.id, actor: context.user.id });
  return NextResponse.json({ organization: data, correlationId }, { status: 201, headers: { [CORRELATION_HEADER]: correlationId } });
}
