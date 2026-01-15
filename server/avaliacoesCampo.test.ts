import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(role: "admin" | "tecnico_seguranca" | "almoxarife" | "colaborador" = "admin"): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "sample-user",
    email: "sample@example.com",
    name: "Sample User",
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
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("avaliacoesCampo", () => {
  it("admin pode criar avaliação de campo", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    // Criar empresa primeiro
    const empresa = await caller.empresas.create({
      razaoSocial: "Empresa Teste Avaliação",
      cnpj: "11222333000991",
      grauRisco: 3,
      segmento: "Industrial",
      endereco: "Rua Teste, 123",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567",
    });

    const avaliacao = await caller.avaliacoesCampo.create({
      empresaId: empresa.id,
      setor: "Produção",
      dataAvaliacao: new Date(),
      tecnicoResponsavelId: ctx.user!.id,
      status: "pendente",
      riscosFisicos: "Ruído excessivo, vibração de máquinas",
      riscosQuimicos: "Poeiras metálicas, vapores de solda",
      riscosBiologicos: "Não identificados",
      riscosErgonomicos: "Postura inadequada, levantamento de peso",
      riscosAcidentes: "Máquinas sem proteção adequada",
      observacoesTecnicas: "Necessário implementar medidas de controle urgentes",
      episRecomendados: "Protetor auricular, luvas, máscara PFF2",
      medidasControle: "Instalação de proteções nas máquinas, treinamento de ergonomia",
    });

    expect(avaliacao).toBeDefined();
    expect(avaliacao.setor).toBe("Produção");
    expect(avaliacao.status).toBe("pendente");
  });

  it("técnico de segurança pode criar avaliação de campo", async () => {
    const { ctx } = createAuthContext("tecnico_seguranca");
    const caller = appRouter.createCaller(ctx);

    // Criar empresa primeiro
    const empresa = await caller.empresas.create({
      razaoSocial: "Empresa Teste Técnico",
      cnpj: "22333444000882",
      grauRisco: 2,
      segmento: "Construção Civil",
      endereco: "Av. Teste, 456",
      cidade: "Rio de Janeiro",
      estado: "RJ",
      cep: "20000-000",
    });

    const avaliacao = await caller.avaliacoesCampo.create({
      empresaId: empresa.id,
      setor: "Canteiro de Obras",
      dataAvaliacao: new Date(),
      tecnicoResponsavelId: ctx.user!.id,
      status: "em_andamento",
      riscosFisicos: "Exposição ao sol, ruído de equipamentos",
      riscosAcidentes: "Risco de queda de altura, equipamentos pesados",
      observacoesTecnicas: "Vistoria realizada no período da manhã",
      episRecomendados: "Capacete, protetor solar, cinto de segurança",
    });

    expect(avaliacao).toBeDefined();
    expect(avaliacao.setor).toBe("Canteiro de Obras");
  });

  it("almoxarife não pode criar avaliação de campo", async () => {
    const { ctx } = createAuthContext("almoxarife");
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.avaliacoesCampo.create({
        empresaId: 1,
        setor: "Almoxarifado",
        dataAvaliacao: new Date(),
        tecnicoResponsavelId: ctx.user!.id,
      })
    ).rejects.toThrow("Acesso negado");
  });

  it("colaborador não pode criar avaliação de campo", async () => {
    const { ctx } = createAuthContext("colaborador");
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.avaliacoesCampo.create({
        empresaId: 1,
        setor: "Produção",
        dataAvaliacao: new Date(),
        tecnicoResponsavelId: ctx.user!.id,
      })
    ).rejects.toThrow("Acesso negado");
  });

  it("admin pode atualizar avaliação de campo", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    // Criar empresa e avaliação primeiro
    const empresa = await caller.empresas.create({
      razaoSocial: "Empresa Teste Update",
      cnpj: "33444555000773",
      grauRisco: 4,
      segmento: "Químico",
      endereco: "Rua Update, 789",
      cidade: "Belo Horizonte",
      estado: "MG",
      cep: "30000-000",
    });

    const avaliacao = await caller.avaliacoesCampo.create({
      empresaId: empresa.id,
      setor: "Laboratório",
      dataAvaliacao: new Date(),
      tecnicoResponsavelId: ctx.user!.id,
      status: "pendente",
    });

    const updated = await caller.avaliacoesCampo.update({
      id: avaliacao.id,
      status: "concluida",
      observacoesTecnicas: "Avaliação finalizada com sucesso",
    });

    expect(updated).toBeDefined();
  });

  it("admin pode listar avaliações de campo", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const avaliacoes = await caller.avaliacoesCampo.list();

    expect(Array.isArray(avaliacoes)).toBe(true);
  });

  it("admin pode excluir avaliação de campo", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    // Criar empresa e avaliação primeiro
    const empresa = await caller.empresas.create({
      razaoSocial: "Empresa Teste Delete",
      cnpj: "44555666000664",
      grauRisco: 1,
      segmento: "Serviços",
      endereco: "Av. Delete, 321",
      cidade: "Curitiba",
      estado: "PR",
      cep: "80000-000",
    });

    const avaliacao = await caller.avaliacoesCampo.create({
      empresaId: empresa.id,
      setor: "Administrativo",
      dataAvaliacao: new Date(),
      tecnicoResponsavelId: ctx.user!.id,
    });

    const result = await caller.avaliacoesCampo.delete({ id: avaliacao.id });

    expect(result).toBeDefined();
  });

  it("técnico de segurança não pode excluir avaliação de campo", async () => {
    const { ctx } = createAuthContext("tecnico_seguranca");
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.avaliacoesCampo.delete({ id: 1 })
    ).rejects.toThrow("Acesso negado");
  });
});
