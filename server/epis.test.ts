import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(role: "admin" | "tecnico_seguranca" | "almoxarife" | "colaborador"): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
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
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("tipos de EPI router", () => {
  it("admin can create tipo de EPI", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tiposEpi.create({
      nome: "Capacete de Segurança",
      categoria: "Proteção da Cabeça",
      ca: "CA 12345",
      fabricante: "Fabricante Teste",
      orientacoesUso: "Usar sempre que houver risco de queda de objetos",
      vidaUtilPadrao: 24,
    });

    expect(result).toBeDefined();
  });

  it("almoxarife can create tipo de EPI", async () => {
    const { ctx } = createAuthContext("almoxarife");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tiposEpi.create({
      nome: "Luva de Proteção",
      categoria: "Proteção das Mãos",
      ca: "CA 54321",
      fabricante: "Fabricante Teste 2",
      orientacoesUso: "Usar em atividades com risco de cortes",
      vidaUtilPadrao: 6,
    });

    expect(result).toBeDefined();
  });

  it("colaborador cannot create tipo de EPI", async () => {
    const { ctx } = createAuthContext("colaborador");
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.tiposEpi.create({
        nome: "Bota de Segurança",
        categoria: "Proteção dos Pés",
        ca: "CA 99999",
        fabricante: "Fabricante Teste 3",
        orientacoesUso: "Usar em áreas com risco de perfuração",
        vidaUtilPadrao: 12,
      })
    ).rejects.toThrow("Acesso negado");
  });

  it("admin can list tipos de EPI", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tiposEpi.list();

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("EPIs com geração automática de SKU", () => {
  it("admin can create batch of EPIs with auto-generated SKUs", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    // Primeiro criar um tipo de EPI
    const tipoEpi = await caller.tiposEpi.create({
      nome: "Capacete Industrial",
      categoria: "Proteção da Cabeça",
      ca: "CA 11111",
      fabricante: "Fabricante A",
      orientacoesUso: "Uso obrigatório em obras",
      vidaUtilPadrao: 24,
    });

    // Criar lote de 5 EPIs
    const result = await caller.epis.createBatch({
      tipoEpiId: tipoEpi.id,
      dataCompra: new Date("2024-01-01"),
      periodoVencimentoMeses: 12,
      quantidade: 5,
    });

    expect(result.quantidade).toBe(5);
    expect(result.epis).toHaveLength(5);
    
    // Verificar se todos os SKUs são únicos
    const skus = result.epis.map((epi) => epi.sku);
    const uniqueSkus = new Set(skus);
    expect(uniqueSkus.size).toBe(5);

    // Verificar formato do SKU (EPI-YYYY-NNNNN)
    const skuPattern = /^EPI-\d{4}-\d{5}$/;
    result.epis.forEach((epi) => {
      expect(epi.sku).toMatch(skuPattern);
      expect(epi.status).toBe("disponivel");
    });
  });

  it("almoxarife can create batch of EPIs", async () => {
    const { ctx } = createAuthContext("almoxarife");
    const caller = appRouter.createCaller(ctx);

    // Criar tipo de EPI
    const tipoEpi = await caller.tiposEpi.create({
      nome: "Óculos de Proteção",
      categoria: "Proteção dos Olhos",
      ca: "CA 22222",
      fabricante: "Fabricante B",
      orientacoesUso: "Usar em ambientes com partículas",
      vidaUtilPadrao: 12,
    });

    // Criar lote de 10 EPIs
    const result = await caller.epis.createBatch({
      tipoEpiId: tipoEpi.id,
      dataCompra: new Date("2024-02-01"),
      periodoVencimentoMeses: 6,
      quantidade: 10,
    });

    expect(result.quantidade).toBe(10);
    expect(result.epis).toHaveLength(10);
  });

  it("colaborador cannot create batch of EPIs", async () => {
    const { ctx } = createAuthContext("colaborador");
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.epis.createBatch({
        tipoEpiId: 1,
        dataCompra: new Date("2024-03-01"),
        periodoVencimentoMeses: 12,
        quantidade: 5,
      })
    ).rejects.toThrow("Acesso negado");
  });

  it("calculates expiration date correctly", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    // Criar tipo de EPI
    const tipoEpi = await caller.tiposEpi.create({
      nome: "Protetor Auricular",
      categoria: "Proteção Auditiva",
      ca: "CA 33333",
      fabricante: "Fabricante C",
      orientacoesUso: "Usar em ambientes com ruído",
      vidaUtilPadrao: 6,
    });

    const dataCompra = new Date("2024-01-15");
    const periodoVencimentoMeses = 12;

    const result = await caller.epis.createBatch({
      tipoEpiId: tipoEpi.id,
      dataCompra,
      periodoVencimentoMeses,
      quantidade: 1,
    });

    const epi = result.epis[0];
    const expectedExpiration = new Date("2025-01-15");

    expect(new Date(epi.dataValidade).toDateString()).toBe(expectedExpiration.toDateString());
  });

  it("admin can list all EPIs", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.epis.list();

    expect(Array.isArray(result)).toBe(true);
  });
});
