/**
 * Platform Phase 0 — liveness endpoint.
 *
 * Answers only "is the process up and able to handle a request", never
 * "is the database reachable" — that is `/api/ready`. A liveness probe that
 * depends on a downstream dependency can cause a healthy process to be
 * killed because of an unrelated outage, which is the failure mode this
 * endpoint is written to avoid.
 * See docs/implementation/P0 BACKEND IMPLEMENTATION SEQUENCE.md, Phase 0.
 */
import { NextResponse } from "next/server";
import { CORRELATION_HEADER, getOrCreateCorrelationId } from "@/lib/platform/correlation";
import { logger } from "@/lib/platform/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const correlationId = getOrCreateCorrelationId(request.headers);
  logger.info("liveness check", { correlationId });

  return NextResponse.json(
    {
      status: "ok",
      service: "metodepenelitian-web",
      time: new Date().toISOString(),
      correlationId,
    },
    { status: 200, headers: { [CORRELATION_HEADER]: correlationId } }
  );
}
