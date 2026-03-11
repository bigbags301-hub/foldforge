import { describe, expect, it } from "vitest";

describe("Environment secrets", () => {
  it("has SUPABASE_URL set", () => {
    expect(process.env.SUPABASE_URL).toBeDefined();
    expect(process.env.SUPABASE_URL).toMatch(/^https:\/\/.+\.supabase\.co$/);
  });

  it("has SUPABASE_ANON_KEY set", () => {
    expect(process.env.SUPABASE_ANON_KEY).toBeDefined();
    expect(process.env.SUPABASE_ANON_KEY!.length).toBeGreaterThan(50);
  });

  it("has SUPABASE_SERVICE_ROLE_KEY set", () => {
    expect(process.env.SUPABASE_SERVICE_ROLE_KEY).toBeDefined();
    expect(process.env.SUPABASE_SERVICE_ROLE_KEY!.length).toBeGreaterThan(50);
  });

  it("has ADMIN_EMAIL set", () => {
    expect(process.env.ADMIN_EMAIL).toBeDefined();
    expect(process.env.ADMIN_EMAIL).toContain("@");
  });
});
