import { describe, expect, it } from "vitest";
import { CORRELATION_HEADER, generateCorrelationId, getOrCreateCorrelationId } from "./correlation";

describe("generateCorrelationId", () => {
  it("generates a well-formed UUID each time", () => {
    const a = generateCorrelationId();
    const b = generateCorrelationId();
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(a).toMatch(uuidPattern);
    expect(b).toMatch(uuidPattern);
    expect(a).not.toBe(b);
  });
});

describe("getOrCreateCorrelationId", () => {
  it("reuses an inbound header value from a Headers object", () => {
    const headers = new Headers({ [CORRELATION_HEADER]: "inbound-id-123" });
    expect(getOrCreateCorrelationId(headers)).toBe("inbound-id-123");
  });

  it("reuses an inbound header value from a plain record", () => {
    expect(getOrCreateCorrelationId({ [CORRELATION_HEADER]: "inbound-id-456" })).toBe(
      "inbound-id-456"
    );
  });

  it("generates a new id when the header is absent", () => {
    const id = getOrCreateCorrelationId(new Headers());
    expect(id.length).toBeGreaterThan(0);
  });

  it("generates a new id when the header is present but blank", () => {
    const headers = new Headers({ [CORRELATION_HEADER]: "   " });
    const id = getOrCreateCorrelationId(headers);
    expect(id.trim()).not.toBe("");
    expect(id).not.toBe("   ");
  });
});
