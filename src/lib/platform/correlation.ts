/**
 * Platform Phase 0 — request correlation id.
 *
 * Every request gets one id that ties its logs and its error envelope
 * together, so a failure reported to a user can be located in the logs.
 * See docs/implementation/P0 BACKEND IMPLEMENTATION SEQUENCE.md, Phase 0.
 */
import { randomUUID } from "node:crypto";

export const CORRELATION_HEADER = "x-correlation-id";

/** Minimal shape this module needs from an inbound header source. */
type HeaderSource = Headers | Record<string, string | string[] | undefined>;

function readHeader(source: HeaderSource, name: string): string | undefined {
  if (typeof (source as Headers).get === "function") {
    return (source as Headers).get(name) ?? undefined;
  }
  const value = (source as Record<string, string | string[] | undefined>)[name];
  return Array.isArray(value) ? value[0] : value;
}

/** Generates a fresh correlation id. Exposed separately so tests don't need a Headers object. */
export function generateCorrelationId(): string {
  return randomUUID();
}

/**
 * Reuses an inbound `x-correlation-id` header when present and non-empty,
 * otherwise generates a new one. Never throws.
 */
export function getOrCreateCorrelationId(source: HeaderSource): string {
  const existing = readHeader(source, CORRELATION_HEADER);
  const trimmed = existing?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : generateCorrelationId();
}
