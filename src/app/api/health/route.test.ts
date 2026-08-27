import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/health", () => {
  it("always reports ok:200 without touching the database", async () => {
    const response = await GET(new Request("http://localhost/api/health"));
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(typeof body.correlationId).toBe("string");
    expect(body.correlationId.length).toBeGreaterThan(0);
  });

  it("echoes an inbound correlation id instead of generating a new one", async () => {
    const response = await GET(
      new Request("http://localhost/api/health", {
        headers: { "x-correlation-id": "test-corr-id" },
      })
    );
    const body = await response.json();
    expect(body.correlationId).toBe("test-corr-id");
    expect(response.headers.get("x-correlation-id")).toBe("test-corr-id");
  });
});
