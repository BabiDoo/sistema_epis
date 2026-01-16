import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("importarCSV", () => {
  it("deve importar colaboradores com sucesso", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const resultado = await caller.colaboradores.importarCSV({
      empresaId: 1,
      colaboradores: [
        {
          nome: "João Silva",
          cpf: "44444444444",
          telefone: "11999999999",
          email: "joao@example.com",
          funcao: "Operador",
          setor: "Produção",
          dataAdmissao: new Date("2024-01-15"),
        },
        {
          nome: "Maria Santos",
          cpf: "55555555555",
          telefone: "11988888888",
          email: "maria@example.com",
          funcao: "Auxiliar",
          setor: "Almoxarifado",
          dataAdmissao: new Date("2024-02-20"),
        },
      ],
    });

    expect(resultado).toBeDefined();
    expect(resultado.sucesso).toBeGreaterThan(0);
    expect(resultado.detalhes).toBeDefined();
    expect(Array.isArray(resultado.detalhes)).toBe(true);
  });

  it("deve retornar erro para CPF duplicado", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const cpfDuplicado = "88888888888";

    // Primeira importação
    await caller.colaboradores.importarCSV({
      empresaId: 1,
      colaboradores: [
        {
          nome: "João Silva",
          cpf: cpfDuplicado,
          telefone: "11999999999",
          email: "joao@example.com",
          funcao: "Operador",
          setor: "Produção",
        },
      ],
    });

    // Segunda importação com mesmo CPF
    const resultado = await caller.colaboradores.importarCSV({
      empresaId: 1,
      colaboradores: [
        {
          nome: "João Silva Duplicado",
          cpf: cpfDuplicado,
          telefone: "11999999999",
          email: "joao2@example.com",
          funcao: "Operador",
          setor: "Produção",
        },
      ],
    });

    expect(resultado.erro).toBeGreaterThan(0);
    expect(resultado.detalhes[0]?.status).toBe("erro");
    expect(resultado.detalhes[0]?.mensagem).toContain("CPF");
  });

  it("deve rejeitar acesso de colaborador comum", async () => {
    const user: AuthenticatedUser = {
      id: 2,
      openId: "colaborador-user",
      email: "colab@example.com",
      name: "Colaborador User",
      loginMethod: "manus",
      role: "colaborador",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    const ctx: TrpcContext = {
      user,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: { clearCookie: () => {} } as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);

    try {
      await caller.colaboradores.importarCSV({
        empresaId: 1,
        colaboradores: [
          {
            nome: "João Silva",
            cpf: "99999999999",
            funcao: "Operador",
            setor: "Produção",
          },
        ],
      });
      expect.fail("Deveria ter lançado erro de acesso negado");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("deve permitir acesso de almoxarife", async () => {
    const user: AuthenticatedUser = {
      id: 3,
      openId: "almoxarife-user",
      email: "almox@example.com",
      name: "Almoxarife User",
      loginMethod: "manus",
      role: "almoxarife",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    const ctx: TrpcContext = {
      user,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: { clearCookie: () => {} } as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);

    const resultado = await caller.colaboradores.importarCSV({
      empresaId: 1,
      colaboradores: [
        {
          nome: "Pedro Costa",
          cpf: "66666666666",
          telefone: "11977777777",
          email: "pedro@example.com",
          funcao: "Operador",
          setor: "Produção",
        },
      ],
    });

    expect(resultado).toBeDefined();
    expect(resultado.sucesso).toBeGreaterThan(0);
  });

  it("deve lidar com campos opcionais", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const resultado = await caller.colaboradores.importarCSV({
      empresaId: 1,
      colaboradores: [
        {
          nome: "Ana Silva",
          cpf: "77777777777",
        },
      ],
    });

    expect(resultado.sucesso).toBeGreaterThan(0);
    expect(resultado.detalhes[0]?.status).toBe("sucesso");
  });
});
