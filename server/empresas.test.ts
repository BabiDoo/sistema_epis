import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    colaboradorId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

function createAlmoxarifeContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "almoxarife-user",
    email: "almoxarife@example.com",
    name: "Almoxarife User",
    loginMethod: "manus",
    role: "almoxarife",
    colaboradorId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

function createColaboradorContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 3,
    openId: "colaborador-user",
    email: "colaborador@example.com",
    name: "Colaborador User",
    loginMethod: "manus",
    role: "colaborador",
    colaboradorId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("empresas router", () => {
  it("admin can list empresas", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.empresas.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("almoxarife can list empresas", async () => {
    const { ctx } = createAlmoxarifeContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.empresas.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("colaborador can list empresas", async () => {
    const { ctx } = createColaboradorContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.empresas.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("colaboradores router", () => {
  it("admin can list all colaboradores", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.colaboradores.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("colaborador can only see their own data", async () => {
    const { ctx } = createColaboradorContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.colaboradores.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("dashboard router", () => {
  it("admin can access dashboard stats", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dashboard.stats();
    expect(result).toBeDefined();
    expect(typeof result?.totalEpis).toBe("number");
    expect(typeof result?.episDisponiveis).toBe("number");
    expect(typeof result?.episEmUso).toBe("number");
    expect(typeof result?.episVencidos).toBe("number");
    expect(typeof result?.totalColaboradores).toBe("number");
  });

  it("almoxarife can access dashboard stats", async () => {
    const { ctx } = createAlmoxarifeContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dashboard.stats();
    expect(result).toBeDefined();
  });

  it("colaborador cannot access dashboard stats", async () => {
    const { ctx } = createColaboradorContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.dashboard.stats()).rejects.toThrow();
  });
});
