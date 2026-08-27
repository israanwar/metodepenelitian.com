import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createUserScopedClient: vi.fn(),
}));

import { createUserScopedClient } from "@/lib/supabase/server";
import { getAuthContext } from "./auth";

const mockCreateUserScopedClient = vi.mocked(createUserScopedClient);

function fakeClient(getUserResult: { data: { user: unknown }; error: { message: string } | null }) {
  return {
    auth: { getUser: async () => getUserResult },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

describe("getAuthContext", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("returns null when there is no Authorization header", async () => {
    const context = await getAuthContext(new Headers());
    expect(context).toBeNull();
    expect(mockCreateUserScopedClient).not.toHaveBeenCalled();
  });

  it("returns null when the Authorization header is not a Bearer token", async () => {
    const context = await getAuthContext(new Headers({ authorization: "Basic abc123" }));
    expect(context).toBeNull();
  });

  it("returns null when the Bearer token is blank", async () => {
    const context = await getAuthContext(new Headers({ authorization: "Bearer    " }));
    expect(context).toBeNull();
  });

  it("resolves the user when Supabase Auth accepts the token", async () => {
    mockCreateUserScopedClient.mockReturnValue(
      fakeClient({ data: { user: { id: "user-1", email: "user1@example.test" } }, error: null })
    );
    const context = await getAuthContext(new Headers({ authorization: "Bearer valid-token" }));
    expect(context).not.toBeNull();
    expect(context?.user).toEqual({ id: "user-1", email: "user1@example.test" });
    expect(mockCreateUserScopedClient).toHaveBeenCalledWith("valid-token");
  });

  it("returns null (never throws) when Supabase Auth rejects the token", async () => {
    mockCreateUserScopedClient.mockReturnValue(fakeClient({ data: { user: null }, error: { message: "invalid token" } }));
    const context = await getAuthContext(new Headers({ authorization: "Bearer expired-token" }));
    expect(context).toBeNull();
  });

  it("returns null (never throws) when the client factory itself throws (e.g. missing config)", async () => {
    mockCreateUserScopedClient.mockImplementation(() => {
      throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
    });
    const context = await getAuthContext(new Headers({ authorization: "Bearer any-token" }));
    expect(context).toBeNull();
  });
});
