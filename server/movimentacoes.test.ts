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
    res: {} as TrpcContext["res"],
  };
}

function createAlmoxarifeContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "almoxarife-user",
    email: "almoxarife@example.com",
    name: "Almoxarife User",
    loginMethod: "manus",
    role: "almoxarife",
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
    res: {} as TrpcContext["res"],
  };
}

describe("movimentacoes", () => {
  it("admin pode criar movimentação de entrega", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Criar empresa
    const empresa = await caller.empresas.create({
      razaoSocial: "Empresa Mov Test",
      cnpj: "12345678000191",
      segmento: "Construção",
      grauRisco: 3,
      endereco: "Rua Test",
      municipio: "São Paulo",
      uf: "SP",
      cep: "01000-000",
    });

    // Criar colaborador
    const colaborador = await caller.colaboradores.create({
      empresaId: empresa.id,
      nome: "João Silva",
      cpf: "12345678901",
      funcao: "Operador",
      setor: "Produção",
      dataAdmissao: new Date(),
      status: "ativo",
    });

    // Criar tipo de EPI
    const tipoEpi = await caller.tiposEpi.create({
      nome: "Capacete de Segurança",
      categoria: "Proteção da Cabeça",
      ca: "12345",
      fabricante: "Fabricante Test",
      orientacoes: "Usar sempre",
      vidaUtilPadrao: 12,
    });

    // Criar EPI
    const epi = await caller.epis.create({
      tipoEpiId: tipoEpi.id,
      sku: "EPI-TEST-001",
      dataCompra: new Date(),
      dataValidade: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      status: "disponivel",
    });

    // Criar movimentação de entrega
    const movimentacao = await caller.movimentacoes.create({
      epiId: epi.id,
      colaboradorId: colaborador.id,
      tipo: "entrega",
      motivo: "Primeira entrega",
      dataMovimentacao: new Date(),
      assinaturaUrl: "data:image/png;base64,test",
      observacoes: "Teste de entrega",
    });

    expect(movimentacao).toBeDefined();

    // Verificar se o status do EPI foi atualizado para "em_uso"
    const epiAtualizado = await caller.epis.getById({ id: epi.id });
    expect(epiAtualizado?.status).toBe("em_uso");
  });

  it("almoxarife pode criar movimentação de devolução", async () => {
    const ctx = createAlmoxarifeContext();
    const caller = appRouter.createCaller(ctx);

    // Criar empresa
    const empresa = await caller.empresas.create({
      razaoSocial: "Empresa Dev Test",
      cnpj: "98765432000182",
      segmento: "Indústria",
      grauRisco: 2,
      endereco: "Av Test",
      municipio: "Rio de Janeiro",
      uf: "RJ",
      cep: "20000-000",
    });

    // Criar colaborador
    const colaborador = await caller.colaboradores.create({
      empresaId: empresa.id,
      nome: "Maria Santos",
      cpf: "98765432109",
      funcao: "Técnica",
      setor: "Manutenção",
      dataAdmissao: new Date(),
      status: "ativo",
    });

    // Criar tipo de EPI
    const tipoEpi = await caller.tiposEpi.create({
      nome: "Luva de Segurança",
      categoria: "Proteção das Mãos",
      ca: "54321",
      fabricante: "Fabricante Test 2",
      orientacoes: "Trocar regularmente",
      vidaUtilPadrao: 6,
    });

    // Criar EPI em uso
    const epi = await caller.epis.create({
      tipoEpiId: tipoEpi.id,
      sku: "EPI-TEST-002",
      dataCompra: new Date(),
      dataValidade: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      status: "em_uso",
    });

    // Criar movimentação de devolução
    const movimentacao = await caller.movimentacoes.create({
      epiId: epi.id,
      colaboradorId: colaborador.id,
      tipo: "devolucao",
      motivo: "Fim de uso",
      dataMovimentacao: new Date(),
      assinaturaUrl: "data:image/png;base64,test2",
    });

    expect(movimentacao).toBeDefined();

    // Verificar se o status do EPI foi atualizado para "disponivel"
    const epiAtualizado = await caller.epis.getById({ id: epi.id });
    expect(epiAtualizado?.status).toBe("disponivel");
  });

  it("movimentação de perda atualiza status para descartado", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Criar empresa
    const empresa = await caller.empresas.create({
      razaoSocial: "Empresa Perda Test",
      cnpj: "11122233000143",
      segmento: "Logística",
      grauRisco: 1,
      endereco: "Rua Perda",
      municipio: "Curitiba",
      uf: "PR",
      cep: "80000-000",
    });

    // Criar colaborador
    const colaborador = await caller.colaboradores.create({
      empresaId: empresa.id,
      nome: "Carlos Oliveira",
      cpf: "11122233344",
      funcao: "Motorista",
      setor: "Transporte",
      dataAdmissao: new Date(),
      status: "ativo",
    });

    // Criar tipo de EPI
    const tipoEpi = await caller.tiposEpi.create({
      nome: "Óculos de Proteção",
      categoria: "Proteção dos Olhos",
      ca: "99999",
      fabricante: "Fabricante Test 3",
      orientacoes: "Limpar após uso",
      vidaUtilPadrao: 24,
    });

    // Criar EPI
    const epi = await caller.epis.create({
      tipoEpiId: tipoEpi.id,
      sku: "EPI-TEST-003",
      dataCompra: new Date(),
      dataValidade: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000),
      status: "em_uso",
    });

    // Criar movimentação de perda
    const movimentacao = await caller.movimentacoes.create({
      epiId: epi.id,
      colaboradorId: colaborador.id,
      tipo: "perda",
      motivo: "Extraviado",
      dataMovimentacao: new Date(),
      assinaturaUrl: "data:image/png;base64,test3",
      observacoes: "EPI perdido durante transporte",
    });

    expect(movimentacao).toBeDefined();

    // Verificar se o status do EPI foi atualizado para "descartado"
    const epiAtualizado = await caller.epis.getById({ id: epi.id });
    expect(epiAtualizado?.status).toBe("descartado");
  });

  it("listar movimentações por colaborador", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Criar empresa
    const empresa = await caller.empresas.create({
      razaoSocial: "Empresa Lista Test",
      cnpj: "55566677000151",
      segmento: "Serviços",
      grauRisco: 2,
      endereco: "Av Lista",
      municipio: "Porto Alegre",
      uf: "RS",
      cep: "90000-000",
    });

    // Criar colaborador
    const colaborador = await caller.colaboradores.create({
      empresaId: empresa.id,
      nome: "Ana Paula",
      cpf: "55566677788",
      funcao: "Analista",
      setor: "Administrativo",
      dataAdmissao: new Date(),
      status: "ativo",
    });

    // Criar tipo de EPI
    const tipoEpi = await caller.tiposEpi.create({
      nome: "Protetor Auricular",
      categoria: "Proteção Auditiva",
      ca: "77777",
      fabricante: "Fabricante Test 4",
      orientacoes: "Higienizar semanalmente",
      vidaUtilPadrao: 3,
    });

    // Criar EPI
    const epi = await caller.epis.create({
      tipoEpiId: tipoEpi.id,
      sku: "EPI-TEST-004",
      dataCompra: new Date(),
      dataValidade: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      status: "disponivel",
    });

    // Criar movimentação
    await caller.movimentacoes.create({
      epiId: epi.id,
      colaboradorId: colaborador.id,
      tipo: "entrega",
      motivo: "Entrega inicial",
      dataMovimentacao: new Date(),
      assinaturaUrl: "data:image/png;base64,test4",
    });

    // Listar movimentações do colaborador
    const movimentacoes = await caller.movimentacoes.list({
      colaboradorId: colaborador.id,
    });

    expect(movimentacoes.length).toBeGreaterThan(0);
    expect(movimentacoes[0].colaboradorId).toBe(colaborador.id);
  });
});
