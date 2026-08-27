import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/platform/auth", () => ({
  getAuthContext: vi.fn(),
}));

import { getAuthContext } from "@/lib/platform/auth";
import { GET, POST } from "./route";

const mockGetAuthContext = vi.mocked(getAuthContext);

function contextWithClient(client: unknown) {
  return { user: { id: "user-1", email: "user1@example.test" }, client };
}

describe("GET /api/organizations", () => {
  afterEach(() => vi.resetAllMocks());

  it("returns 401 when unauthenticated", async () => {
    mockGetAuthContext.mockResolvedValue(null);
    const response = await GET(new Request("http://localhost/api/organizations"));
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error.code).toBe("UNAUTHENTICATED");
  });

  it("returns the caller's organizations on success", async () => {
    const rows = [{ id: "org-1", name: "Org 1", slug: "org-1", created_by: "user-1", created_at: "2026-01-01" }];
    mockGetAuthContext.mockResolvedValue(
      contextWithClient({
        from: () => ({
          select: () => ({
            order: async () => ({ data: rows, error: null }),
          }),
        }),
      }) as never
    );
    const response = await GET(new Request("http://localhost/api/organizations"));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.organizations).toEqual(rows);
  });

  it("returns a normalized 500 (never a raw DB error) when the query fails", async () => {
    mockGetAuthContext.mockResolvedValue(
      contextWithClient({
        from: () => ({
          select: () => ({
            order: async () => ({ data: null, error: { message: "connection reset" } }),
          }),
        }),
      }) as never
    );
    const response = await GET(new Request("http://localhost/api/organizations"));
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(JSON.stringify(body)).not.toContain("connection reset");
  });
});

describe("POST /api/organizations", () => {
  afterEach(() => vi.resetAllMocks());

  function req(body: unknown) {
    return new Request("http://localhost/api/organizations", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "content-type": "application/json" },
    });
  }

  it("returns 401 when unauthenticated", async () => {
    mockGetAuthContext.mockResolvedValue(null);
    const response = await POST(req({ name: "Lab", slug: "lab" }));
    expect(response.status).toBe(401);
  });

  it("returns 400 for a missing name", async () => {
    mockGetAuthContext.mockResolvedValue(contextWithClient({}) as never);
    const response = await POST(req({ slug: "lab" }));
    expect(response.status).toBe(400);
    expect((await response.json()).error.code).toBe("INVALID_NAME");
  });

  it("returns 400 for a malformed slug", async () => {
    mockGetAuthContext.mockResolvedValue(contextWithClient({}) as never);
    const response = await POST(req({ name: "Lab", slug: "Not A Slug!" }));
    expect(response.status).toBe(400);
    expect((await response.json()).error.code).toBe("INVALID_SLUG");
  });

  it("creates the organization on success (201)", async () => {
    const created = { id: "org-1", name: "Lab", slug: "lab", created_by: "user-1", created_at: "2026-01-01" };
    mockGetAuthContext.mockResolvedValue(
      contextWithClient({
        from: () => ({
          insert: () => ({
            select: () => ({
              single: async () => ({ data: created, error: null }),
            }),
          }),
        }),
      }) as never
    );
    const response = await POST(req({ name: "Lab", slug: "lab" }));
    expect(response.status).toBe(201);
    expect((await response.json()).organization).toEqual(created);
  });

  it("returns 409 when the slug is already taken", async () => {
    mockGetAuthContext.mockResolvedValue(
      contextWithClient({
        from: () => ({
          insert: () => ({
            select: () => ({
              single: async () => ({ data: null, error: { code: "23505", message: "duplicate key" } }),
            }),
          }),
        }),
      }) as never
    );
    const response = await POST(req({ name: "Lab", slug: "lab" }));
    expect(response.status).toBe(409);
    expect((await response.json()).error.code).toBe("SLUG_TAKEN");
  });
});
