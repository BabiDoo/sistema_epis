import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["admin", "tecnico_seguranca", "almoxarife", "colaborador"]).default("colaborador").notNull(),
  colaboradorId: int("colaboradorId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tabela de Empresas
export const empresas = mysqlTable("empresas", {
  id: int("id").autoincrement().primaryKey(),
  razaoSocial: varchar("razaoSocial", { length: 255 }).notNull(),
  cnpj: varchar("cnpj", { length: 18 }).notNull().unique(),
  segmento: varchar("segmento", { length: 100 }),
  grauRisco: int("grauRisco").notNull(),
  endereco: text("endereco"),
  municipio: varchar("municipio", { length: 100 }),
  uf: varchar("uf", { length: 2 }),
  cep: varchar("cep", { length: 10 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Empresa = typeof empresas.$inferSelect;
export type InsertEmpresa = typeof empresas.$inferInsert;

// Tabela de Colaboradores
export const colaboradores = mysqlTable("colaboradores", {
  id: int("id").autoincrement().primaryKey(),
  empresaId: int("empresaId").notNull(),
  nome: varchar("nome", { length: 255 }).notNull(),
  cpf: varchar("cpf", { length: 14 }).unique(),
  email: varchar("email", { length: 320 }),
  telefone: varchar("telefone", { length: 20 }),
  fotoUrl: text("fotoUrl"),
  funcao: varchar("funcao", { length: 100 }).notNull(),
  setor: varchar("setor", { length: 100 }).notNull(),
  dataAdmissao: timestamp("dataAdmissao").notNull(),
  dataDemissao: timestamp("dataDemissao"),
  status: mysqlEnum("status", ["ativo", "inativo"]).default("ativo").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Colaborador = typeof colaboradores.$inferSelect;
export type InsertColaborador = typeof colaboradores.$inferInsert;

// Tabela de Tipos de EPI
export const tiposEpi = mysqlTable("tiposEpi", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  categoria: varchar("categoria", { length: 100 }).notNull(),
  ca: varchar("ca", { length: 50 }).notNull(),
  fabricante: varchar("fabricante", { length: 255 }),
  orientacoesUso: text("orientacoesUso"),
  vidaUtilPadrao: int("vidaUtilPadrao").notNull(),
  observacoesTecnicas: text("observacoesTecnicas"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TipoEpi = typeof tiposEpi.$inferSelect;
export type InsertTipoEpi = typeof tiposEpi.$inferInsert;

// Tabela de EPIs Individuais
export const epis = mysqlTable("epis", {
  id: int("id").autoincrement().primaryKey(),
  tipoEpiId: int("tipoEpiId").notNull(),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  dataCompra: timestamp("dataCompra").notNull(),
  dataValidade: timestamp("dataValidade").notNull(),
  status: mysqlEnum("status", ["disponivel", "em_uso", "vencido", "descartado"]).default("disponivel").notNull(),
  colaboradorAtualId: int("colaboradorAtualId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Epi = typeof epis.$inferSelect;
export type InsertEpi = typeof epis.$inferInsert;

// Tabela de Movimentações de EPIs
export const movimentacoes = mysqlTable("movimentacoes", {
  id: int("id").autoincrement().primaryKey(),
  epiId: int("epiId").notNull(),
  colaboradorId: int("colaboradorId").notNull(),
  tipo: mysqlEnum("tipo", ["emprestimo", "troca", "devolucao"]).notNull(),
  motivo: text("motivo"),
  dataMovimentacao: timestamp("dataMovimentacao").defaultNow().notNull(),
  usuarioResponsavelId: int("usuarioResponsavelId").notNull(),
  assinaturaUrl: text("assinaturaUrl"),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Movimentacao = typeof movimentacoes.$inferSelect;
export type InsertMovimentacao = typeof movimentacoes.$inferInsert;

// Tabela de Avaliações de Campo
export const avaliacoesCampo = mysqlTable("avaliacoesCampo", {
  id: int("id").autoincrement().primaryKey(),
  empresaId: int("empresaId").notNull(),
  local: varchar("local", { length: 255 }).notNull(),
  dataAvaliacao: timestamp("dataAvaliacao").notNull(),
  tecnicoResponsavelId: int("tecnicoResponsavelId").notNull(),
  observacoesGerais: text("observacoesGerais"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AvaliacaoCampo = typeof avaliacoesCampo.$inferSelect;
export type InsertAvaliacaoCampo = typeof avaliacoesCampo.$inferInsert;

// Tabela de Setores Avaliados
export const setoresAvaliados = mysqlTable("setoresAvaliados", {
  id: int("id").autoincrement().primaryKey(),
  avaliacaoCampoId: int("avaliacaoCampoId").notNull(),
  nomeSetor: varchar("nomeSetor", { length: 255 }).notNull(),
  funcoesCargos: text("funcoesCargos").notNull(),
  nomeServidor: varchar("nomeServidor", { length: 255 }),
  riscosFisicos: text("riscosFisicos"),
  riscosQuimicos: text("riscosQuimicos"),
  riscosBiologicos: text("riscosBiologicos"),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SetorAvaliado = typeof setoresAvaliados.$inferSelect;
export type InsertSetorAvaliado = typeof setoresAvaliados.$inferInsert;