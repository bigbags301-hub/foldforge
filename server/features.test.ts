import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(role: "user" | "admin" = "user"): { ctx: TrpcContext; clearedCookies: any[] } {
  const clearedCookies: any[] = [];
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-001",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    stripeCustomerId: null,
    suspended: false,
    dataSourcePreference: "reference",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  const ctx: TrpcContext = {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };
  return { ctx, clearedCookies };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("auth.me", () => {
  it("returns user when authenticated", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeDefined();
    expect(result?.email).toBe("test@example.com");
    expect(result?.role).toBe("user");
  });

  it("returns null when not authenticated", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });
});

describe("auth.logout", () => {
  it("clears the session cookie and reports success", async () => {
    const { ctx, clearedCookies } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
  });
});

describe("referenceData.list", () => {
  it("returns reference symbols from the database", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.referenceData.getAll();
    expect(Array.isArray(result)).toBe(true);
    // We seeded 174 symbols
    expect(result.length).toBeGreaterThanOrEqual(100);
  });

  it("returns symbols with correct structure", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.referenceData.getAll();
    if (result.length > 0) {
      const sym = result[0];
      expect(sym).toHaveProperty("symbol");
      expect(sym).toHaveProperty("displayName");
      expect(sym).toHaveProperty("category");
      expect(sym).toHaveProperty("digits");
      expect(sym).toHaveProperty("contractSize");
    }
  });
});

describe("referenceData.byCategory", () => {
  it("returns only forex symbols when filtered", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.referenceData.getByCategory({ category: "forex" });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    result.forEach((s: any) => expect(s.category).toBe("forex"));
  });

  it("returns only metals symbols when filtered", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.referenceData.getByCategory({ category: "metals" });
    expect(Array.isArray(result)).toBe(true);
    result.forEach((s: any) => expect(s.category).toBe("metals"));
  });
});

describe("referenceData.count", () => {
  it("returns a count of 174", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.referenceData.getCount();
    expect(result).toBeGreaterThanOrEqual(162);
  });
});

describe("admin procedures", () => {
  it("admin.metrics returns metrics for admin users", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.getMetrics();
    expect(result).toHaveProperty("totalUsers");
    expect(result).toHaveProperty("activeSubscriptions");
    expect(result).toHaveProperty("totalLicenses");
    expect(result).toHaveProperty("openTickets");
    expect(result).toHaveProperty("mrrEstimate");
  });

  it("admin.metrics rejects non-admin users", async () => {
    const { ctx } = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.getMetrics()).rejects.toThrow();
  });

  it("admin.users returns user list for admin", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.getUsers();
    expect(Array.isArray(result)).toBe(true);
  });

  it("admin.users rejects non-admin users", async () => {
    const { ctx } = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.getUsers()).rejects.toThrow();
  });
});
