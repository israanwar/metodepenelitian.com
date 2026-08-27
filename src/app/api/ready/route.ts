/**
 * Platform Phase 0 — readiness endpoint.
 *
 * Reports "ready" only when required configuration is present/valid AND a
 * real round trip to the database succeeds. Never fabricates a successful
 * response — an unavailable database or invalid configuration returns a
 * normalized 503, not a fake 200.
 * See docs/implementation/P0 BACKEND IMPLEMENTATION SEQUENCE.md, Phase 0.
 */
import { NextResponse } from "next/server";
import { CORRELATION_HEADER, getOrCreateCorrelationId } from "@/lib/platform/correlation";
import { loadServerConfig } from "@/lib/platform/config";
import { checkDatabaseConnection } from "@/lib/platform/db";
import { toErrorEnvelope, PlatformError } from "@/lib/platform/errors";
import { logger } from "@/lib/platform/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const correlationId = getOrCreateCorrelationId(request.headers);

  try {
    // Fail closed: an invalid/missing configuration throws before any
    // database round trip is attempted.
    loadServerConfig();

    const db = await checkDatabaseConnection();
    if (!db.ok) {
      logger.error("readiness check failed: database unavailable", {
        correlationId,
        error: db.error,
        latencyMs: db.latencyMs,
      });
      const { envelope, httpStatus } = toErrorEnvelope(
        new PlatformError("DATABASE_UNAVAILABLE", "Database is not reachable.", 503),
        correlationId
      );
      return NextResponse.json(envelope, {
        status: httpStatus,
        headers: { [CORRELATION_HEADER]: correlationId },
      });
    }

    logger.info("readiness check passed", { correlationId, latencyMs: db.latencyMs });
    return NextResponse.json(
      {
        status: "ready",
        database: { ok: true, latencyMs: db.latencyMs },
        time: new Date().toISOString(),
        correlationId,
      },
      { status: 200, headers: { [CORRELATION_HEADER]: correlationId } }
    );
  } catch (err) {
    logger.error("readiness check failed: configuration error", {
      correlationId,
      error: err instanceof Error ? err.message : String(err),
    });
    const { envelope, httpStatus } = toErrorEnvelope(err, correlationId);
    return NextResponse.json(envelope, {
      status: httpStatus,
      headers: { [CORRELATION_HEADER]: correlationId },
    });
  }
}
