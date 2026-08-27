#!/usr/bin/env node
/**
 * Platform Phase 0 — secret scan.
 *
 * Scans every git-tracked file (i.e. what would actually ship in a commit —
 * `.env*` files are excluded from tracking already, see .gitignore) for
 * patterns that look like a committed secret: a JWT-shaped Supabase key, an
 * AWS-style access key id, or a PEM private key block. This is a heuristic
 * safety net, not a substitute for never committing real credentials — see
 * docs/implementation/P0 BACKEND IMPLEMENTATION SEQUENCE.md, Phase 0's
 * "secret leakage" failure mode.
 *
 * Usage: node scripts/secret-scan.mjs
 * Exit code 0 = clean, 1 = at least one finding.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const SELF = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(SELF), "..");

/** name → regex. Keep patterns specific enough to avoid flagging ordinary code. */
export const SECRET_PATTERNS = {
  "JWT-shaped token (e.g. Supabase anon/service key)": /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/,
  "AWS access key id": /AKIA[0-9A-Z]{16}/,
  "PEM private key block": /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/,
};

/** Files this scanner must not flag itself for defining the very patterns it looks for. */
const SELF_EXCLUDED_PATHS = new Set([
  path.relative(REPO_ROOT, SELF),
  "scripts/secret-scan.test.ts",
]);

export function scanContent(content) {
  const findings = [];
  for (const [name, pattern] of Object.entries(SECRET_PATTERNS)) {
    const match = content.match(pattern);
    if (match) {
      findings.push({ pattern: name, snippet: `${match[0].slice(0, 12)}…[REDACTED]` });
    }
  }
  return findings;
}

function listTrackedFiles() {
  const output = execFileSync("git", ["ls-files"], { cwd: REPO_ROOT, encoding: "utf8" });
  return output.split("\n").filter(Boolean);
}

function main() {
  const files = listTrackedFiles().filter((file) => !SELF_EXCLUDED_PATHS.has(file));
  const allFindings = [];

  for (const file of files) {
    let content;
    try {
      content = readFileSync(path.join(REPO_ROOT, file), "utf8");
    } catch {
      continue; // binary or unreadable — not a text-secret risk this scan handles
    }
    for (const finding of scanContent(content)) {
      allFindings.push({ file, ...finding });
    }
  }

  if (allFindings.length === 0) {
    console.log(`secret-scan: clean (${files.length} tracked files checked)`);
    process.exit(0);
  }

  console.error(`secret-scan: ${allFindings.length} finding(s):`);
  for (const finding of allFindings) {
    console.error(`  ${finding.file}: ${finding.pattern} (${finding.snippet})`);
  }
  process.exit(1);
}

// Only run when invoked directly (`node scripts/secret-scan.mjs`), not when imported by a test.
if (process.argv[1] === SELF) {
  main();
}
