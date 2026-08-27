import { describe, expect, it } from "vitest";
import { authorizeOrgAction, decideByRank, getMyOrgRank, roleRank } from "./authz";
import type { AuthContext } from "./auth";

describe("roleRank", () => {
  it("ranks owner > admin > member", () => {
    expect(roleRank("owner")).toBeGreaterThan(roleRank("admin"));
    expect(roleRank("admin")).toBeGreaterThan(roleRank("member"));
  });
});

describe("decideByRank", () => {
  it("denies a non-member (rank 0) regardless of minRole", () => {
    const decision = decideByRank(0, "member");
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toMatch(/not a member/);
  });

  it("denies a rank below the required minRole", () => {
    const decision = decideByRank(roleRank("member"), "admin");
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toMatch(/admin/);
  });

  it("allows a rank equal to minRole", () => {
    expect(decideByRank(roleRank("admin"), "admin").allowed).toBe(true);
  });

  it("allows a rank above minRole", () => {
    expect(decideByRank(roleRank("owner"), "admin").allowed).toBe(true);
  });
});

function fakeContext(rpcResult: { data?: unknown; error?: { message: string } }): AuthContext {
  return {
    user: { id: "user-1", email: "user1@example.test" },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client: { rpc: async () => rpcResult } as any,
  };
}

describe("getMyOrgRank", () => {
  it("returns the numeric rank the RPC reports", async () => {
    const rank = await getMyOrgRank(fakeContext({ data: 2 }).client, "org-1");
    expect(rank).toBe(2);
  });

  it("returns 0 (never throws) when the RPC errors", async () => {
    const rank = await getMyOrgRank(fakeContext({ error: { message: "boom" } }).client, "org-1");
    expect(rank).toBe(0);
  });

  it("returns 0 when the RPC returns a non-numeric value", async () => {
    const rank = await getMyOrgRank(fakeContext({ data: null }).client, "org-1");
    expect(rank).toBe(0);
  });
});

describe("authorizeOrgAction", () => {
  it("combines the rank lookup and the decision in one call", async () => {
    const context = fakeContext({ data: roleRank("owner") });
    const decision = await authorizeOrgAction(context, "org-1", "admin");
    expect(decision.allowed).toBe(true);
    expect(decision.rank).toBe(roleRank("owner"));
  });

  it("denies and reports rank 0 for a non-member", async () => {
    const context = fakeContext({ data: 0 });
    const decision = await authorizeOrgAction(context, "org-1", "member");
    expect(decision.allowed).toBe(false);
    expect(decision.rank).toBe(0);
  });
});
