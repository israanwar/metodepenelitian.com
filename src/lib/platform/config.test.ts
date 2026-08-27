import { describe, expect, it } from "vitest";
import { loadPublicConfig, loadServerConfig } from "./config";
import { PlatformError } from "./errors";

const VALID_ENV = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key-value",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-key-value",
  NEXT_PUBLIC_SITE_URL: "https://metodepenelitian.com",
};

describe("loadPublicConfig", () => {
  it("parses a valid environment", () => {
    const config = loadPublicConfig(VALID_ENV);
    expect(config).toEqual({
      supabaseUrl: "https://example.supabase.co",
      supabaseAnonKey: "anon-key-value",
      siteUrl: "https://metodepenelitian.com",
    });
  });

  it("defaults siteUrl to localhost when unset", () => {
    const { NEXT_PUBLIC_SITE_URL, ...rest } = VALID_ENV;
    const config = loadPublicConfig(rest);
    expect(config.siteUrl).toBe("http://localhost:3000");
  });

  it("fails closed when the Supabase URL is missing", () => {
    const { NEXT_PUBLIC_SUPABASE_URL, ...rest } = VALID_ENV;
    expect(() => loadPublicConfig(rest)).toThrow(PlatformError);
  });

  it("fails closed when the Supabase URL is malformed", () => {
    expect(() =>
      loadPublicConfig({ ...VALID_ENV, NEXT_PUBLIC_SUPABASE_URL: "not-a-url" })
    ).toThrow(PlatformError);
  });

  it("fails closed when the anon key is empty/whitespace", () => {
    expect(() =>
      loadPublicConfig({ ...VALID_ENV, NEXT_PUBLIC_SUPABASE_ANON_KEY: "   " })
    ).toThrow(PlatformError);
  });

  it("never includes the offending value in the thrown message", () => {
    try {
      loadPublicConfig({ ...VALID_ENV, NEXT_PUBLIC_SUPABASE_ANON_KEY: "super-secret-value" });
    } catch (err) {
      expect(err).toBeInstanceOf(PlatformError);
      expect((err as PlatformError).message).not.toContain("super-secret-value");
      expect((err as PlatformError).message).toContain("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }
  });

  it("uses a stable CONFIG_INVALID code and 503 status for every validation failure", () => {
    try {
      loadPublicConfig({});
      throw new Error("expected loadPublicConfig to throw");
    } catch (err) {
      expect(err).toBeInstanceOf(PlatformError);
      expect((err as PlatformError).code).toBe("CONFIG_INVALID");
      expect((err as PlatformError).httpStatus).toBe(503);
    }
  });
});

describe("loadServerConfig", () => {
  it("parses a valid environment, including the service role key", () => {
    const config = loadServerConfig(VALID_ENV);
    expect(config.supabaseServiceRoleKey).toBe("service-role-key-value");
  });

  it("fails closed when the service role key is missing", () => {
    const { SUPABASE_SERVICE_ROLE_KEY, ...rest } = VALID_ENV;
    expect(() => loadServerConfig(rest)).toThrow(PlatformError);
  });

  it("still validates public fields before the service role key", () => {
    const { NEXT_PUBLIC_SUPABASE_URL, ...rest } = VALID_ENV;
    expect(() => loadServerConfig(rest)).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
  });
});
