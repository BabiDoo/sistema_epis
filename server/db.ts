import { and, desc, eq, gte, lte, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  empresas,
  colaboradores,
  tiposEpi,
  epis,
  movimentacoes,
  avaliacoesCampo,
  setoresAvaliados,
  type Empresa,
  type InsertEmpresa,
  type Colaborador,
  type InsertColaborador,
  type TipoEpi,
  type InsertTipoEpi,
  type Epi,
  type InsertEpi,
  type Movimentacao,
  type InsertMovimentacao,
  type AvaliacaoCampo,
  type InsertAvaliacaoCampo,
  type SetorAvaliado,
  type InsertSetorAvaliado,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== EMPRESAS =====
export async function createEmpresa(data: InsertEmpresa) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(empresas).values(data);
  return result;
}

export async function getEmpresas() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(empresas).orderBy(desc(empresas.createdAt));
}

export async function getEmpresaById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(empresas).where(eq(empresas.id, id)).limit(1);
  return result[0];
}

export async function updateEmpresa(id: number, data: Partial<InsertEmpresa>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(empresas).set(data).where(eq(empresas.id, id));
}

export async function deleteEmpresa(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(empresas).where(eq(empresas.id, id));
}

// ===== COLABORADORES =====
export async function createColaborador(data: InsertColaborador) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(colaboradores).values(data);
  return result;
}

export async function getColaboradores(empresaId?: number) {
  const db = await getDb();
  if (!db) return [];
  if (empresaId) {
    return await db.select().from(colaboradores).where(eq(colaboradores.empresaId, empresaId)).orderBy(desc(colaboradores.createdAt));
  }
  return await db.select().from(colaboradores).orderBy(desc(colaboradores.createdAt));
}

export async function getColaboradorById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(colaboradores).where(eq(colaboradores.id, id)).limit(1);
  return result[0];
}

export async function updateColaborador(id: number, data: Partial<InsertColaborador>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(colaboradores).set(data).where(eq(colaboradores.id, id));
}

export async function deleteColaborador(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(colaboradores).where(eq(colaboradores.id, id));
}

// ===== TIPOS DE EPI =====
export async function createTipoEpi(data: InsertTipoEpi) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(tiposEpi).values(data);
  return result;
}

export async function getTiposEpi() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(tiposEpi).orderBy(desc(tiposEpi.createdAt));
}

export async function getTipoEpiById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(tiposEpi).where(eq(tiposEpi.id, id)).limit(1);
  return result[0];
}

export async function updateTipoEpi(id: number, data: Partial<InsertTipoEpi>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(tiposEpi).set(data).where(eq(tiposEpi.id, id));
}

export async function deleteTipoEpi(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(tiposEpi).where(eq(tiposEpi.id, id));
}

// ===== EPIs =====
export async function createEpi(data: InsertEpi) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(epis).values(data);
  return result;
}

export async function getEpis(status?: string) {
  const db = await getDb();
  if (!db) return [];
  if (status) {
    return await db.select().from(epis).where(eq(epis.status, status as any)).orderBy(desc(epis.createdAt));
  }
  return await db.select().from(epis).orderBy(desc(epis.createdAt));
}

export async function getEpiById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(epis).where(eq(epis.id, id)).limit(1);
  return result[0];
}

export async function getEpiBySku(sku: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(epis).where(eq(epis.sku, sku)).limit(1);
  return result[0];
}

export async function updateEpi(id: number, data: Partial<InsertEpi>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(epis).set(data).where(eq(epis.id, id));
}

export async function deleteEpi(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(epis).where(eq(epis.id, id));
}

export async function getEpisVencidos() {
  const db = await getDb();
  if (!db) return [];
  const now = new Date();
  return await db.select().from(epis).where(
    and(
      lte(epis.dataValidade, now),
      or(eq(epis.status, "disponivel"), eq(epis.status, "em_uso"))
    )
  );
}

export async function getEpisProximosVencimento(dias: number = 30) {
  const db = await getDb();
  if (!db) return [];
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + dias);
  return await db.select().from(epis).where(
    and(
      gte(epis.dataValidade, now),
      lte(epis.dataValidade, futureDate),
      or(eq(epis.status, "disponivel"), eq(epis.status, "em_uso"))
    )
  );
}

// ===== MOVIMENTAÇÕES =====
export async function createMovimentacao(data: InsertMovimentacao) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(movimentacoes).values(data);
  return result;
}

export async function getMovimentacoes(epiId?: number, colaboradorId?: number) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(movimentacoes);
  if (epiId) {
    query = query.where(eq(movimentacoes.epiId, epiId)) as any;
  } else if (colaboradorId) {
    query = query.where(eq(movimentacoes.colaboradorId, colaboradorId)) as any;
  }
  return await query.orderBy(desc(movimentacoes.dataMovimentacao));
}

export async function getMovimentacaoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(movimentacoes).where(eq(movimentacoes.id, id)).limit(1);
  return result[0];
}

// ===== AVALIAÇÕES DE CAMPO =====
export async function createAvaliacaoCampo(data: InsertAvaliacaoCampo) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(avaliacoesCampo).values(data);
  return result;
}

export async function getAvaliacoesCampo(empresaId?: number) {
  const db = await getDb();
  if (!db) return [];
  if (empresaId) {
    return await db.select().from(avaliacoesCampo).where(eq(avaliacoesCampo.empresaId, empresaId)).orderBy(desc(avaliacoesCampo.dataAvaliacao));
  }
  return await db.select().from(avaliacoesCampo).orderBy(desc(avaliacoesCampo.dataAvaliacao));
}

export async function getAvaliacaoCampoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(avaliacoesCampo).where(eq(avaliacoesCampo.id, id)).limit(1);
  return result[0];
}

export async function updateAvaliacaoCampo(id: number, data: Partial<InsertAvaliacaoCampo>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(avaliacoesCampo).set(data).where(eq(avaliacoesCampo.id, id));
}

export async function deleteAvaliacaoCampo(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(avaliacoesCampo).where(eq(avaliacoesCampo.id, id));
}

// ===== SETORES AVALIADOS =====
export async function createSetorAvaliado(data: InsertSetorAvaliado) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(setoresAvaliados).values(data);
  return result;
}

export async function getSetoresAvaliados(avaliacaoCampoId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(setoresAvaliados).where(eq(setoresAvaliados.avaliacaoCampoId, avaliacaoCampoId)).orderBy(desc(setoresAvaliados.createdAt));
}

export async function getSetorAvaliadoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(setoresAvaliados).where(eq(setoresAvaliados.id, id)).limit(1);
  return result[0];
}

export async function updateSetorAvaliado(id: number, data: Partial<InsertSetorAvaliado>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(setoresAvaliados).set(data).where(eq(setoresAvaliados.id, id));
}

export async function deleteSetorAvaliado(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(setoresAvaliados).where(eq(setoresAvaliados.id, id));
}

// ===== DASHBOARD & STATS =====
export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return null;
  
  const [totalEpis] = await db.select({ count: sql<number>`count(*)` }).from(epis);
  const [episDisponiveis] = await db.select({ count: sql<number>`count(*)` }).from(epis).where(eq(epis.status, "disponivel"));
  const [episEmUso] = await db.select({ count: sql<number>`count(*)` }).from(epis).where(eq(epis.status, "em_uso"));
  const [episVencidos] = await db.select({ count: sql<number>`count(*)` }).from(epis).where(eq(epis.status, "vencido"));
  const [totalColaboradores] = await db.select({ count: sql<number>`count(*)` }).from(colaboradores).where(eq(colaboradores.status, "ativo"));
  
  return {
    totalEpis: totalEpis?.count || 0,
    episDisponiveis: episDisponiveis?.count || 0,
    episEmUso: episEmUso?.count || 0,
    episVencidos: episVencidos?.count || 0,
    totalColaboradores: totalColaboradores?.count || 0,
  };
}
