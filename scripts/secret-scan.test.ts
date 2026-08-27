import { describe, expect, it } from "vitest";
import { scanContent } from "./secret-scan.mjs";

// Fixture strings are built by concatenation so this file itself never
// contains a literal secret-shaped substring that other tooling could flag.
const FAKE_JWT = ["eyJhbGciOiJIUzI1NiJ9", "eyJzdWIiOiJ0ZXN0In0", "c2lnbmF0dXJlLXBhcnQ"].join(".");
const FAKE_AWS_KEY = "AKIA" + "IOSFODNN7EXAMPLE";
const FAKE_PEM = "-----BEGIN" + " PRIVATE KEY-----\nMIIBVgIBADANBgkq\n-----END PRIVATE KEY-----";

describe("scanContent", () => {
  it("flags a JWT-shaped token", () => {
    const findings = scanContent(`const key = "${FAKE_JWT}";`);
    expect(findings.some((f) => f.pattern.includes("JWT"))).toBe(true);
  });

  it("flags an AWS-style access key id", () => {
    const findings = scanContent(`AWS_ACCESS_KEY_ID=${FAKE_AWS_KEY}`);
    expect(findings.some((f) => f.pattern.includes("AWS"))).toBe(true);
  });

  it("flags a PEM private key block", () => {
    const findings = scanContent(FAKE_PEM);
    expect(findings.some((f) => f.pattern.includes("PEM"))).toBe(true);
  });

  it("never includes the raw matched value in a finding, only a truncated/redacted snippet", () => {
    const findings = scanContent(`const key = "${FAKE_JWT}";`);
    for (const finding of findings) {
      expect(finding.snippet).toContain("[REDACTED]");
      expect(finding.snippet.length).toBeLessThan(FAKE_JWT.length);
    }
  });

  it("does not flag ordinary application code", () => {
    const findings = scanContent(`
      export function add(a: number, b: number) {
        return a + b;
      }
    `);
    expect(findings).toEqual([]);
  });
});
