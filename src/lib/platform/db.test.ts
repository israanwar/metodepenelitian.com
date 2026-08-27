import { describe, expect, it } from "vitest";
import { checkDatabaseConnection } from "./db";

/** A minimal fake matching only the chain `.from().select().abortSignal()` this module uses. */
function fakeClient(behavior: "ok" | "dbError" | "throws") {
  return () =>
    ({
      from() {
        return {
          select() {
            return {
              async abortSignal() {
                if (behavior === "throws") {
                  throw new Error("network unreachable");
                }
                if (behavior === "dbError") {
                  return { data: null, error: { message: "relation does not exist" } };
                }
                return { data: [], error: null };
              },
            };
          },
        };
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any;
}

describe("checkDatabaseConnection", () => {
  it("reports ok:true on a successful round trip", async () => {
    const result = await checkDatabaseConnection(fakeClient("ok"));
    expect(result.ok).toBe(true);
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    expect(result.error).toBeUndefined();
  });

  it("reports ok:false, never throws, when the query returns an error", async () => {
    const result = await checkDatabaseConnection(fakeClient("dbError"));
    expect(result.ok).toBe(false);
    expect(result.error).toContain("relation does not exist");
  });

  it("reports ok:false, never throws, when the client factory itself throws", async () => {
    const result = await checkDatabaseConnection(() => {
      throw new Error("missing Supabase configuration");
    });
    expect(result.ok).toBe(false);
    expect(result.error).toContain("missing Supabase configuration");
  });

  it("reports ok:false when the underlying call rejects", async () => {
    const result = await checkDatabaseConnection(fakeClient("throws"));
    expect(result.ok).toBe(false);
    expect(result.error).toContain("network unreachable");
  });
});
