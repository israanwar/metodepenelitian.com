#!/usr/bin/env node
/**
 * Platform Phase 1 — Identity & Tenancy RLS rehearsal.
 *
 * Proves, against a REAL local Postgres (not a mock), that the
 * organizations/organization_members/audit_log row-level-security
 * policies actually enforce: default-deny, tenant isolation, role-gated
 * writes, and privilege-escalation prevention. This is not part of
 * `npm test` because it requires a running local Supabase stack
 * (`supabase start`) — run it manually after `supabase db reset`.
 *
 * Usage:
 *   supabase start && supabase db reset
 *   node scripts/phase1-rls-rehearsal.mjs
 *
 * Exit code 0 = every assertion passed. Non-zero = at least one failed;
 * failures are printed with expected vs. actual.
 */
import { createClient } from "@supabase/supabase-js";
import { execFileSync } from "node:child_process";

// Read connection details from the running local stack instead of hardcoding
// any key: `supabase status` prints this project's local-only demo
// credentials, which differ from (and are never valid against) the hosted
// project in .env.local. Fails loudly if the local stack is not running.
function localSupabaseStatus() {
  let raw;
  try {
    raw = execFileSync("supabase", ["status", "-o", "json"], { encoding: "utf8" });
  } catch (err) {
    throw new Error(
      "Could not read `supabase status` — is the local stack running? Start it with `supabase start && supabase db reset` first.\n" +
        (err.stderr?.toString() ?? err.message)
    );
  }
  return JSON.parse(raw);
}

const status = localSupabaseStatus();
const LOCAL_URL = status.API_URL;
const ANON_KEY = status.ANON_KEY;
const SERVICE_ROLE_KEY = status.SERVICE_ROLE_KEY;

const admin = createClient(LOCAL_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const results = [];

function record(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
}

async function makeUser(email) {
  const password = "phase1-rehearsal-pw-" + Math.random().toString(36).slice(2);
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw new Error(`createUser(${email}) failed: ${error.message}`);

  const client = createClient(LOCAL_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: signIn, error: signInError } = await client.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError) throw new Error(`signIn(${email}) failed: ${signInError.message}`);

  // A client bound to this user's own access token — every query through
  // it runs with `auth.uid()` = this user, exactly as an API route would.
  const scoped = createClient(LOCAL_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${signIn.session.access_token}` } },
  });

  return { id: data.user.id, email, client: scoped };
}

async function main() {
  const userA = await makeUser(`phase1-a-${Date.now()}@example.test`);
  const userB = await makeUser(`phase1-b-${Date.now()}@example.test`);
  const userC = await makeUser(`phase1-c-${Date.now()}@example.test`);
  const anon = createClient(LOCAL_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 1. userA creates an org and is auto-bootstrapped as owner.
  const orgName = `Rehearsal Org ${Date.now()}`;
  const { data: org, error: createErr } = await userA.client
    .from("organizations")
    .insert({ name: orgName, slug: `rehearsal-${Date.now()}`, created_by: userA.id })
    .select()
    .single();
  record("userA can create an organization", !createErr && !!org, createErr?.message);
  const orgId = org?.id;

  const { data: bootstrapRow } = await userA.client
    .from("organization_members")
    .select("role")
    .eq("org_id", orgId)
    .eq("user_id", userA.id)
    .maybeSingle();
  record("creator is auto-bootstrapped as owner", bootstrapRow?.role === "owner", JSON.stringify(bootstrapRow));

  // 2. Tenant isolation: userB (non-member) cannot see org A at all.
  const { data: bView } = await userB.client.from("organizations").select("id").eq("id", orgId);
  record("non-member sees zero rows for a tenant they are not in (object enumeration safe)", (bView ?? []).length === 0, `rows=${bView?.length}`);

  // 3. Anonymous cannot see it either.
  const { data: anonView } = await anon.from("organizations").select("id").eq("id", orgId);
  record("anonymous sees zero rows (default deny)", (anonView ?? []).length === 0, `rows=${anonView?.length}`);

  // 4. userB cannot self-add as a member of org A (privilege escalation / wrong tenant).
  const { error: selfAddErr } = await userB.client
    .from("organization_members")
    .insert({ org_id: orgId, user_id: userB.id, role: "member" });
  record("non-member cannot self-add to an org", !!selfAddErr, selfAddErr ? "denied as expected" : "UNEXPECTEDLY SUCCEEDED");

  // 5. userA (owner) adds userB as member.
  const { error: addBErr } = await userA.client
    .from("organization_members")
    .insert({ org_id: orgId, user_id: userB.id, role: "member", invited_by: userA.id });
  record("owner can add a member", !addBErr, addBErr?.message);

  // 6. userB (mere member) cannot add userC (wrong role / privilege escalation).
  const { error: memberAddErr } = await userB.client
    .from("organization_members")
    .insert({ org_id: orgId, user_id: userC.id, role: "member", invited_by: userB.id });
  record("plain member cannot add another member", !!memberAddErr, memberAddErr ? "denied as expected" : "UNEXPECTEDLY SUCCEEDED");

  // 7. userA promotes userB to admin.
  const { error: promoteErr } = await userA.client
    .from("organization_members")
    .update({ role: "admin" })
    .eq("org_id", orgId)
    .eq("user_id", userB.id);
  record("owner can promote a member to admin", !promoteErr, promoteErr?.message);

  // 8. userB (now admin) can add userC.
  const { error: adminAddErr } = await userB.client
    .from("organization_members")
    .insert({ org_id: orgId, user_id: userC.id, role: "member", invited_by: userB.id });
  record("admin can add a member", !adminAddErr, adminAddErr?.message);

  // 9. userB (admin, rank 2) cannot promote userC to owner (rank 3 >= own rank).
  const { error: escalateErr } = await userB.client
    .from("organization_members")
    .update({ role: "owner" })
    .eq("org_id", orgId)
    .eq("user_id", userC.id);
  record("admin cannot grant a role >= their own rank (privilege escalation blocked)", !!escalateErr, escalateErr ? "denied as expected" : "UNEXPECTEDLY SUCCEEDED");

  // 10. userB (admin) cannot remove userA (owner, higher rank).
  // Note: a DELETE whose row is excluded by a RLS `USING` clause is not an
  // error — Postgres silently matches zero rows (only a WITH CHECK
  // violation, e.g. assertion 9 above, raises an actual error). So the
  // correct "denied" signal here is an empty affected-rows array, not
  // `error` — chain `.select()` to get the affected rows back.
  const { data: removeOwnerRows, error: removeOwnerErr } = await userB.client
    .from("organization_members")
    .delete()
    .eq("org_id", orgId)
    .eq("user_id", userA.id)
    .select();
  record(
    "admin cannot remove a peer/superior (owner) member",
    !removeOwnerErr && (removeOwnerRows ?? []).length === 0,
    removeOwnerErr ? removeOwnerErr.message : `rows affected=${removeOwnerRows?.length}`
  );

  // 11. userC (plain member) cannot update the org (same USING-vs-error
  // caveat as above: zero rows affected, not a thrown error).
  const { data: memberUpdateOrgRows, error: memberUpdateOrgErr } = await userC.client
    .from("organizations")
    .update({ name: "hijacked name" })
    .eq("id", orgId)
    .select();
  record(
    "plain member cannot update the organization",
    !memberUpdateOrgErr && (memberUpdateOrgRows ?? []).length === 0,
    memberUpdateOrgErr ? memberUpdateOrgErr.message : `rows affected=${memberUpdateOrgRows?.length}`
  );

  // 12. userB (admin) can update the org.
  const { error: adminUpdateOrgErr } = await userB.client
    .from("organizations")
    .update({ name: `${orgName} (renamed)` })
    .eq("id", orgId);
  record("admin can update the organization", !adminUpdateOrgErr, adminUpdateOrgErr?.message);

  // 13. Audit trail: admin can read it, plain member cannot.
  const { data: auditAsAdmin, error: auditAdminErr } = await userB.client
    .from("audit_log")
    .select("action")
    .eq("org_id", orgId);
  record(
    "admin can read the org's audit trail, and it recorded the mutations above",
    !auditAdminErr && (auditAsAdmin ?? []).length >= 5,
    `rows=${auditAsAdmin?.length}, actions=${JSON.stringify(auditAsAdmin?.map((r) => r.action))}`
  );

  const { data: auditAsMember } = await userC.client.from("audit_log").select("action").eq("org_id", orgId);
  record("plain member cannot read the audit trail", (auditAsMember ?? []).length === 0, `rows=${auditAsMember?.length}`);

  // Cleanup: remove the three rehearsal users so repeated runs stay clean.
  for (const u of [userA, userB, userC]) {
    await admin.auth.admin.deleteUser(u.id);
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} assertions passed.`);
  if (failed.length > 0) {
    console.error(`${failed.length} FAILED assertion(s):`);
    for (const f of failed) console.error(`  - ${f.name}`);
    process.exit(1);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error("Rehearsal script crashed:", err);
  process.exit(1);
});
