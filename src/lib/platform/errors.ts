/**
 * Platform Phase 0 — normalized error envelope.
 *
 * Every API route in this codebase must render failures through this shape
 * instead of an ad-hoc object, so callers can rely on one stable contract.
 * See docs/implementation/P0 BACKEND IMPLEMENTATION SEQUENCE.md, Phase 0.
 */

export interface ErrorEnvelope {
  error: {
    /** Stable, machine-readable failure code (e.g. "CONFIG_INVALID"). */
    code: string;
    /** Human-readable, non-sensitive message. Never includes secret values. */
    message: string;
    /** Correlation id for this request, so an error can be traced to its logs. */
    correlationId: string;
  };
}

/**
 * An error the platform raised deliberately, with a stable code and an HTTP
 * status it should be rendered as. Anything else (a thrown library error, a
 * bug) is treated as unknown and rendered generically — its message is never
 * exposed to the caller, only logged server-side.
 */
export class PlatformError extends Error {
  readonly code: string;
  readonly httpStatus: number;

  constructor(code: string, message: string, httpStatus = 500) {
    super(message);
    this.name = "PlatformError";
    this.code = code;
    this.httpStatus = httpStatus;
  }
}

const GENERIC_MESSAGE = "An unexpected error occurred.";
const GENERIC_CODE = "INTERNAL_ERROR";

/**
 * Normalizes any thrown value into an ErrorEnvelope + HTTP status.
 * A `PlatformError` is rendered with its own code/message/status. Any other
 * error (unexpected exception, third-party library failure) is rendered as a
 * generic 500 with no leaked internal detail — the original error still
 * belongs in the structured logs, not in the response body.
 */
export function toErrorEnvelope(
  err: unknown,
  correlationId: string
): { envelope: ErrorEnvelope; httpStatus: number } {
  if (err instanceof PlatformError) {
    return {
      envelope: { error: { code: err.code, message: err.message, correlationId } },
      httpStatus: err.httpStatus,
    };
  }

  return {
    envelope: { error: { code: GENERIC_CODE, message: GENERIC_MESSAGE, correlationId } },
    httpStatus: 500,
  };
}
