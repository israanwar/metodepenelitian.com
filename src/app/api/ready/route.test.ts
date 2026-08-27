import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/platform/config", () => ({
  loadServerConfig: vi.fn(),
}));
vi.mock("@/lib/platform/db", () => ({
  checkDatabaseConnection: vi.fn(),
}));

import { loadServerConfig } from "@/lib/platform/config";
import { checkDatabaseConnection } from "@/lib/platform/db";
import { PlatformError } from "@/lib/platform/errors";
import { GET } from "./route";

const mockLoadServerConfig = vi.mocked(loadServerConfig);
const mockCheckDatabaseConnection = vi.mocked(checkDatabaseConnection);

describe("GET /api/ready", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("reports 200 ready when config is valid and the database round trip succeeds", async () => {
    mockLoadServerConfig.mockReturnValue({
      supabaseUrl: "https://example.supabase.co",
      supabaseAnonKey: "anon",
      siteUrl: "http://localhost:3000",
      supabaseServiceRoleKey: "service",
    });
    mockCheckDatabaseConnection.mockResolvedValue({ ok: true, latencyMs: 12 });

    const response = await GET(new Request("http://localhost/api/ready"));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("ready");
    expect(body.database).toEqual({ ok: true, latencyMs: 12 });
  });

  it("reports a normalized 503, never a fake 200, when the database is unreachable", async () => {
    mockLoadServerConfig.mockReturnValue({
      supabaseUrl: "https://example.supabase.co",
      supabaseAnonKey: "anon",
      siteUrl: "http://localhost:3000",
      supabaseServiceRoleKey: "service",
    });
    mockCheckDatabaseConnection.mockResolvedValue({
      ok: false,
      latencyMs: 3000,
      error: "connection timed out",
    });

    const response = await GET(new Request("http://localhost/api/ready"));
    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.error.code).toBe("DATABASE_UNAVAILABLE");
    // the raw DB error detail stays server-side, never in the response body
    expect(JSON.stringify(body)).not.toContain("connection timed out");
  });

  it("reports a normalized 503 and never touches the database when configuration is invalid", async () => {
    mockLoadServerConfig.mockImplementation(() => {
      throw new PlatformError("CONFIG_INVALID", "Missing required environment variable: X", 503);
    });

    const response = await GET(new Request("http://localhost/api/ready"));
    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.error.code).toBe("CONFIG_INVALID");
    expect(mockCheckDatabaseConnection).not.toHaveBeenCalled();
  });
});
