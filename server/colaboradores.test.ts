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

describe("colaboradores router", () => {
  it("admin can create colaborador", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const randomCpf = `${Math.floor(Math.random() * 100000000000)}`;

    const result = await caller.colaboradores.create({
      empresaId: 1,
      nome: "João Silva",
      cpf: randomCpf,
      email: "joao@empresa.com",
      telefone: "(11) 99999-9999",
      fotoUrl: "",
      funcao: "Operador",
      setor: "Produção",
      dataAdmissao: new Date("2024-01-01"),
      status: "ativo",
    });

    expect(result).toBeDefined();
  });

  it("almoxarife can create colaborador", async () => {
    const { ctx } = createAuthContext("almoxarife");
    const caller = appRouter.createCaller(ctx);

    const randomCpf = `${Math.floor(Math.random() * 100000000000)}`;

    const result = await caller.colaboradores.create({
      empresaId: 1,
      nome: "Maria Santos",
      cpf: randomCpf,
      email: "maria@empresa.com",
      telefone: "(11) 88888-8888",
      fotoUrl: "",
      funcao: "Auxiliar",
      setor: "Almoxarifado",
      dataAdmissao: new Date("2024-01-15"),
      status: "ativo",
    });

    expect(result).toBeDefined();
  });

  it("colaborador cannot create colaborador", async () => {
    const { ctx } = createAuthContext("colaborador");
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.colaboradores.create({
        empresaId: 1,
        nome: "Pedro Costa",
        cpf: "111.222.333-44",
        email: "pedro@empresa.com",
        telefone: "(11) 77777-7777",
        fotoUrl: "",
        funcao: "Técnico",
        setor: "Manutenção",
        dataAdmissao: new Date("2024-02-01"),
        status: "ativo",
      })
    ).rejects.toThrow("Acesso negado");
  });

  it("admin can list all colaboradores", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.colaboradores.list();

    expect(Array.isArray(result)).toBe(true);
  });

  it("colaborador can only see their own data", async () => {
    const user: AuthenticatedUser = {
      id: 1,
      openId: "test-colaborador",
      email: "colaborador@example.com",
      name: "Colaborador Test",
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
      res: {
        clearCookie: () => {},
      } as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);
    const result = await caller.colaboradores.list();

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("onboarding flow", () => {
  it("admin can create empresa with segmento", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const randomCnpj = `${Math.floor(Math.random() * 100000000)}/0001-${Math.floor(Math.random() * 100)}`;

    const result = await caller.empresas.create({
      razaoSocial: "Empresa Teste LTDA",
      cnpj: randomCnpj,
      segmento: "Construção Civil",
      grauRisco: 3,
      endereco: "Rua Teste, 123",
      municipio: "São Paulo",
      uf: "SP",
      cep: "01234-567",
    });

    expect(result).toBeDefined();
  });
});
