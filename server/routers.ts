import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Middleware para verificar perfis de acesso
  empresas: router({
    list: protectedProcedure.query(async () => {
      return await db.getEmpresas();
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getEmpresaById(input.id);
      }),
    create: protectedProcedure
      .input(
        z.object({
          razaoSocial: z.string(),
          cnpj: z.string(),
          grauRisco: z.number(),
          endereco: z.string().optional(),
          municipio: z.string().optional(),
          uf: z.string().optional(),
          cep: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "almoxarife") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
        }
        return await db.createEmpresa(input);
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          razaoSocial: z.string().optional(),
          cnpj: z.string().optional(),
          grauRisco: z.number().optional(),
          endereco: z.string().optional(),
          municipio: z.string().optional(),
          uf: z.string().optional(),
          cep: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "almoxarife") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
        }
        const { id, ...data } = input;
        return await db.updateEmpresa(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
        }
        return await db.deleteEmpresa(input.id);
      }),
  }),

  colaboradores: router({
    list: protectedProcedure
      .input(z.object({ empresaId: z.number().optional() }).optional())
      .query(async ({ input, ctx }) => {
        if (ctx.user.role === "colaborador") {
          if (!ctx.user.colaboradorId) {
            throw new TRPCError({ code: "FORBIDDEN", message: "Colaborador não vinculado" });
          }
          const colaborador = await db.getColaboradorById(ctx.user.colaboradorId);
          return colaborador ? [colaborador] : [];
        }
        return await db.getColaboradores(input?.empresaId);
      }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role === "colaborador" && ctx.user.colaboradorId !== input.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
        }
        return await db.getColaboradorById(input.id);
      }),
    create: protectedProcedure
      .input(
        z.object({
          empresaId: z.number(),
          nome: z.string(),
          funcao: z.string(),
          setor: z.string(),
          dataAdmissao: z.date(),
          dataDemissao: z.date().optional(),
          status: z.enum(["ativo", "inativo"]).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "almoxarife") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
        }
        return await db.createColaborador(input);
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          empresaId: z.number().optional(),
          nome: z.string().optional(),
          funcao: z.string().optional(),
          setor: z.string().optional(),
          dataAdmissao: z.date().optional(),
          dataDemissao: z.date().optional(),
          status: z.enum(["ativo", "inativo"]).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "almoxarife") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
        }
        const { id, ...data } = input;
        return await db.updateColaborador(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
        }
        return await db.deleteColaborador(input.id);
      }),
  }),

  tiposEpi: router({
    list: protectedProcedure.query(async () => {
      return await db.getTiposEpi();
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getTipoEpiById(input.id);
      }),
    create: protectedProcedure
      .input(
        z.object({
          nome: z.string(),
          categoria: z.string(),
          ca: z.string(),
          fabricante: z.string().optional(),
          orientacoesUso: z.string().optional(),
          vidaUtilPadrao: z.number(),
          observacoesTecnicas: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "almoxarife") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
        }
        return await db.createTipoEpi(input);
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          nome: z.string().optional(),
          categoria: z.string().optional(),
          ca: z.string().optional(),
          fabricante: z.string().optional(),
          orientacoesUso: z.string().optional(),
          vidaUtilPadrao: z.number().optional(),
          observacoesTecnicas: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "almoxarife") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
        }
        const { id, ...data } = input;
        return await db.updateTipoEpi(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
        }
        return await db.deleteTipoEpi(input.id);
      }),
  }),

  epis: router({
    list: protectedProcedure
      .input(z.object({ status: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getEpis(input?.status);
      }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getEpiById(input.id);
      }),
    getBySku: protectedProcedure
      .input(z.object({ sku: z.string() }))
      .query(async ({ input }) => {
        return await db.getEpiBySku(input.sku);
      }),
    create: protectedProcedure
      .input(
        z.object({
          tipoEpiId: z.number(),
          sku: z.string(),
          dataCompra: z.date(),
          dataValidade: z.date(),
          status: z.enum(["disponivel", "em_uso", "vencido", "descartado"]).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "almoxarife") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
        }
        return await db.createEpi(input);
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          tipoEpiId: z.number().optional(),
          sku: z.string().optional(),
          dataCompra: z.date().optional(),
          dataValidade: z.date().optional(),
          status: z.enum(["disponivel", "em_uso", "vencido", "descartado"]).optional(),
          colaboradorAtualId: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "almoxarife") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
        }
        const { id, ...data } = input;
        return await db.updateEpi(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
        }
        return await db.deleteEpi(input.id);
      }),
    vencidos: protectedProcedure.query(async () => {
      return await db.getEpisVencidos();
    }),
    proximosVencimento: protectedProcedure
      .input(z.object({ dias: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getEpisProximosVencimento(input?.dias);
      }),
  }),

  movimentacoes: router({
    list: protectedProcedure
      .input(
        z
          .object({
            epiId: z.number().optional(),
            colaboradorId: z.number().optional(),
          })
          .optional()
      )
      .query(async ({ input, ctx }) => {
        if (ctx.user.role === "colaborador") {
          if (!ctx.user.colaboradorId) {
            throw new TRPCError({ code: "FORBIDDEN", message: "Colaborador não vinculado" });
          }
          return await db.getMovimentacoes(undefined, ctx.user.colaboradorId);
        }
        return await db.getMovimentacoes(input?.epiId, input?.colaboradorId);
      }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getMovimentacaoById(input.id);
      }),
    create: protectedProcedure
      .input(
        z.object({
          epiId: z.number(),
          colaboradorId: z.number(),
          tipo: z.enum(["emprestimo", "troca", "devolucao"]),
          motivo: z.string().optional(),
          dataMovimentacao: z.date().optional(),
          assinaturaUrl: z.string().optional(),
          observacoes: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "almoxarife") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
        }
        return await db.createMovimentacao({
          ...input,
          usuarioResponsavelId: ctx.user.id,
        });
      }),
  }),

  avaliacoesCampo: router({
    list: protectedProcedure
      .input(z.object({ empresaId: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getAvaliacoesCampo(input?.empresaId);
      }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getAvaliacaoCampoById(input.id);
      }),
    create: protectedProcedure
      .input(
        z.object({
          empresaId: z.number(),
          local: z.string(),
          dataAvaliacao: z.date(),
          observacoesGerais: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "tecnico_seguranca") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
        }
        return await db.createAvaliacaoCampo({
          ...input,
          tecnicoResponsavelId: ctx.user.id,
        });
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          empresaId: z.number().optional(),
          local: z.string().optional(),
          dataAvaliacao: z.date().optional(),
          observacoesGerais: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "tecnico_seguranca") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
        }
        const { id, ...data } = input;
        return await db.updateAvaliacaoCampo(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
        }
        return await db.deleteAvaliacaoCampo(input.id);
      }),
  }),

  setoresAvaliados: router({
    list: protectedProcedure
      .input(z.object({ avaliacaoCampoId: z.number() }))
      .query(async ({ input }) => {
        return await db.getSetoresAvaliados(input.avaliacaoCampoId);
      }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getSetorAvaliadoById(input.id);
      }),
    create: protectedProcedure
      .input(
        z.object({
          avaliacaoCampoId: z.number(),
          nomeSetor: z.string(),
          funcoesCargos: z.string(),
          nomeServidor: z.string().optional(),
          riscosFisicos: z.string().optional(),
          riscosQuimicos: z.string().optional(),
          riscosBiologicos: z.string().optional(),
          observacoes: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "tecnico_seguranca") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
        }
        return await db.createSetorAvaliado(input);
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          nomeSetor: z.string().optional(),
          funcoesCargos: z.string().optional(),
          nomeServidor: z.string().optional(),
          riscosFisicos: z.string().optional(),
          riscosQuimicos: z.string().optional(),
          riscosBiologicos: z.string().optional(),
          observacoes: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "tecnico_seguranca") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
        }
        const { id, ...data } = input;
        return await db.updateSetorAvaliado(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
        }
        return await db.deleteSetorAvaliado(input.id);
      }),
  }),

  dashboard: router({
    stats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role === "colaborador") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
      }
      return await db.getDashboardStats();
    }),
  }),
});

export type AppRouter = typeof appRouter;
