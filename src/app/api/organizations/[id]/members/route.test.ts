import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/platform/auth", () => ({
  getAuthContext: vi.fn(),
}));
vi.mock("@/lib/platform/authz", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/platform/authz")>();
  return { ...actual, authorizeOrgAction: vi.fn() };
});

import { getAuthContext } from "@/lib/platform/auth";
import { authorizeOrgAction } from "@/lib/platform/authz";
import { POST } from "./route";

const mockGetAuthContext = vi.mocked(getAuthContext);
const mockAuthorize = vi.mocked(authorizeOrgAction);

const VALID_ORG_ID = "11111111-1111-1111-1111-111111111111";
const VALID_USER_ID = "22222222-2222-2222-2222-222222222222";

function contextWithClient(client: unknown) {
  return { user: { id: "user-1", email: "user1@example.test" }, client };
}

function req(body: unknown) {
  return new Request(`http://localhost/api/organizations/${VALID_ORG_ID}/members`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

describe("POST /api/organizations/:id/members", () => {
  afterEach(() => vi.resetAllMocks());

  it("returns 400 for a non-UUID org id", async () => {
    mockGetAuthContext.mockResolvedValue(contextWithClient({}) as never);
    const response = await POST(new Request("http://localhost/api/organizations/not-a-uuid/members", {
      method: "POST",
      body: JSON.stringify({ userId: VALID_USER_ID, role: "member" }),
    }), { params: { id: "not-a-uuid" } });
    expect(response.status).toBe(400);
  });

  it("returns 401 when unauthenticated", async () => {
    mockGetAuthContext.mockResolvedValue(null);
    const response = await POST(req({ userId: VALID_USER_ID, role: "member" }), { params: { id: VALID_ORG_ID } });
    expect(response.status).toBe(401);
  });

  it("returns 400 for an invalid role", async () => {
    mockGetAuthContext.mockResolvedValue(contextWithClient({}) as never);
    const response = await POST(req({ userId: VALID_USER_ID, role: "owner" }), { params: { id: VALID_ORG_ID } });
    expect(response.status).toBe(400);
    expect((await response.json()).error.code).toBe("INVALID_ROLE");
  });

  it("returns 404 (object-enumeration safe) when the caller is not a member at all", async () => {
    mockGetAuthContext.mockResolvedValue(contextWithClient({}) as never);
    mockAuthorize.mockResolvedValue({ allowed: false, reason: "not a member of this organization", rank: 0 });
    const response = await POST(req({ userId: VALID_USER_ID, role: "member" }), { params: { id: VALID_ORG_ID } });
    expect(response.status).toBe(404);
  });

  it("returns 403 when the caller is a member but below admin rank", async () => {
    mockGetAuthContext.mockResolvedValue(contextWithClient({}) as never);
    mockAuthorize.mockResolvedValue({ allowed: false, reason: "requires admin+ role", rank: 1 });
    const response = await POST(req({ userId: VALID_USER_ID, role: "member" }), { params: { id: VALID_ORG_ID } });
    expect(response.status).toBe(403);
  });

  it("adds the member on success (201) when the caller is admin+", async () => {
    mockAuthorize.mockResolvedValue({ allowed: true, reason: "sufficient role", rank: 2 });
    const created = { id: "m-1", org_id: VALID_ORG_ID, user_id: VALID_USER_ID, role: "member", created_at: "2026-01-01" };
    mockGetAuthContext.mockResolvedValue(
      contextWithClient({
        from: () => ({
          insert: () => ({
            select: () => ({ single: async () => ({ data: created, error: null }) }),
          }),
        }),
      }) as never
    );
    const response = await POST(req({ userId: VALID_USER_ID, role: "member" }), { params: { id: VALID_ORG_ID } });
    expect(response.status).toBe(201);
    expect((await response.json()).member).toEqual(created);
  });

  it("returns 409 when the user is already a member", async () => {
    mockAuthorize.mockResolvedValue({ allowed: true, reason: "sufficient role", rank: 3 });
    mockGetAuthContext.mockResolvedValue(
      contextWithClient({
        from: () => ({
          insert: () => ({
            select: () => ({ single: async () => ({ data: null, error: { code: "23505", message: "duplicate" } }) }),
          }),
        }),
      }) as never
    );
    const response = await POST(req({ userId: VALID_USER_ID, role: "member" }), { params: { id: VALID_ORG_ID } });
    expect(response.status).toBe(409);
  });

  it("returns 403 (not 500) when the database itself rejects via RLS", async () => {
    mockAuthorize.mockResolvedValue({ allowed: true, reason: "sufficient role", rank: 2 });
    mockGetAuthContext.mockResolvedValue(
      contextWithClient({
        from: () => ({
          insert: () => ({
            select: () => ({ single: async () => ({ data: null, error: { code: "42501", message: "rls" } }) }),
          }),
        }),
      }) as never
    );
    const response = await POST(req({ userId: VALID_USER_ID, role: "admin" }), { params: { id: VALID_ORG_ID } });
    expect(response.status).toBe(403);
  });
});
