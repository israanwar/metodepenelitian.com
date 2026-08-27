import { describe, expect, it } from "vitest";
import { PlatformError, toErrorEnvelope } from "./errors";

describe("toErrorEnvelope", () => {
  it("renders a PlatformError with its own code, message, and status", () => {
    const err = new PlatformError("DATABASE_UNAVAILABLE", "Database is not reachable.", 503);
    const { envelope, httpStatus } = toErrorEnvelope(err, "corr-1");

    expect(httpStatus).toBe(503);
    expect(envelope).toEqual({
      error: {
        code: "DATABASE_UNAVAILABLE",
        message: "Database is not reachable.",
        correlationId: "corr-1",
      },
    });
  });

  it("renders an unknown error as a generic 500 without leaking its message", () => {
    const err = new Error("leaked internal stack trace detail");
    const { envelope, httpStatus } = toErrorEnvelope(err, "corr-2");

    expect(httpStatus).toBe(500);
    expect(envelope.error.code).toBe("INTERNAL_ERROR");
    expect(envelope.error.message).not.toContain("leaked internal stack trace detail");
    expect(envelope.error.correlationId).toBe("corr-2");
  });

  it("renders a non-Error thrown value as a generic 500", () => {
    const { envelope, httpStatus } = toErrorEnvelope("a raw string throw", "corr-3");
    expect(httpStatus).toBe(500);
    expect(envelope.error.code).toBe("INTERNAL_ERROR");
  });
});
