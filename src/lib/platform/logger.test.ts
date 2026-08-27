import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logger } from "./logger";

describe("logger", () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("emits one structured JSON line with level, message, and time", () => {
    logger.info("readiness check passed", { correlationId: "corr-1" });

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    const line = consoleLogSpy.mock.calls[0][0] as string;
    const record = JSON.parse(line);

    expect(record.level).toBe("info");
    expect(record.message).toBe("readiness check passed");
    expect(record.correlationId).toBe("corr-1");
    expect(typeof record.time).toBe("string");
  });

  it("redacts fields whose key name looks like a secret", () => {
    logger.info("config loaded", {
      supabaseServiceRoleKey: "actual-secret-value",
      apiToken: "another-secret",
      password: "hunter2",
      safeField: "this is fine",
    });

    const line = consoleLogSpy.mock.calls[0][0] as string;
    expect(line).not.toContain("actual-secret-value");
    expect(line).not.toContain("another-secret");
    expect(line).not.toContain("hunter2");
    expect(line).toContain("this is fine");

    const record = JSON.parse(line);
    expect(record.supabaseServiceRoleKey).toBe("[REDACTED]");
    expect(record.apiToken).toBe("[REDACTED]");
    expect(record.password).toBe("[REDACTED]");
  });

  it("redacts sensitive keys nested inside an object field, on the error level", () => {
    logger.error("db check failed", {
      context: { apiToken: "nested-secret-value", note: "ok" },
    });
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const line = consoleErrorSpy.mock.calls[0][0] as string;
    expect(line).not.toContain("nested-secret-value");
    const record = JSON.parse(line);
    expect(record.context).toEqual({ apiToken: "[REDACTED]", note: "ok" });
  });

  it("does not attempt value-content secret scanning — redaction is key-name based only", () => {
    // Documents the logger's actual contract: a secret-shaped VALUE under an
    // innocuous key name is not caught. Callers must not name a field this
    // way; broader content scanning is explicitly out of Phase 0 scope.
    logger.info("example", { note: "contains sk_live_not_actually_redacted" });
    const line = consoleLogSpy.mock.calls[0][0] as string;
    expect(line).toContain("sk_live_not_actually_redacted");
  });
});
