using ClosedXML.Excel;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SistemaEpis.Application.Features.Importacoes.Colaboradores;
using SistemaEpis.Domain.Entities;
using SistemaEpis.Infrastructure.Persistence;

namespace SistemaEpis.Infrastructure.Integrations.Excel;

public class ImportadorColaboradoresExcel : IImportadorColaboradoresExcel
{
    private readonly AppDbContext _context;

    public ImportadorColaboradoresExcel(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ImportarColaboradoresResult> ImportarAsync(
        IFormFile arquivo,
        CancellationToken cancellationToken)
    {
        var resultado = new ImportarColaboradoresResult();

        if (arquivo is null || arquivo.Length == 0)
        {
            resultado.AdicionarErro(0, "Arquivo não enviado ou vazio.");
            return resultado;
        }

        using var stream = arquivo.OpenReadStream();
        using var workbook = new XLWorkbook(stream);
        var worksheet = workbook.Worksheet(1);

        var ultimaLinha = worksheet.LastRowUsed()?.RowNumber() ?? 0;

        if (ultimaLinha < 2)
        {
            resultado.AdicionarErro(0, "A planilha não possui linhas de dados.");
            return resultado;
        }

        ValidarCabecalhos(worksheet, resultado);

        if (resultado.Erros.Count > 0)
            return resultado;

        // Recriando para garantir contagem limpa após validação de cabeçalho
        var importacaoResult = new ImportarColaboradoresResult
        {
            TotalLinhas = ultimaLinha - 1
        };

        for (int linha = 2; linha <= ultimaLinha; linha++)
        {
            try
            {
                var nomeCompleto = worksheet.Cell(linha, 1).GetString().Trim();
                var matricula = worksheet.Cell(linha, 2).GetString().Trim();
                var cpf = worksheet.Cell(linha, 3).GetString().Trim();
                var email = worksheet.Cell(linha, 4).GetString().Trim();
                var nomeUnidade = worksheet.Cell(linha, 5).GetString().Trim();
                var nomeArea = worksheet.Cell(linha, 6).GetString().Trim();
                var nomeSetor = worksheet.Cell(linha, 7).GetString().Trim();
                var nomeCargo = worksheet.Cell(linha, 8).GetString().Trim();

                if (string.IsNullOrWhiteSpace(nomeCompleto))
                {
                    importacaoResult.AdicionarErro(linha, "NomeCompleto é obrigatório.");
                    continue;
                }

                if (string.IsNullOrWhiteSpace(matricula))
                {
                    importacaoResult.AdicionarErro(linha, "Matricula é obrigatória.");
                    continue;
                }

                if (string.IsNullOrWhiteSpace(nomeUnidade) ||
                    string.IsNullOrWhiteSpace(nomeArea) ||
                    string.IsNullOrWhiteSpace(nomeSetor) ||
                    string.IsNullOrWhiteSpace(nomeCargo))
                {
                    importacaoResult.AdicionarErro(linha, "Unidade, Area, Setor e Cargo são obrigatórios.");
                    continue;
                }

                var matriculaJaExiste = await _context.Colaboradores
                    .AnyAsync(x => x.Matricula == matricula, cancellationToken);

                if (matriculaJaExiste)
                {
                    importacaoResult.AdicionarErro(linha, $"Já existe colaborador com matrícula {matricula}.");
                    continue;
                }

                var unidade = await ObterOuCriarUnidadeAsync(nomeUnidade, cancellationToken);
                var area = await ObterOuCriarAreaAsync(nomeArea, unidade.Id, cancellationToken);
                var setor = await ObterOuCriarSetorAsync(nomeSetor, area.Id, cancellationToken);
                var cargo = await ObterOuCriarCargoAsync(nomeCargo, cancellationToken);

                var colaborador = new Colaborador(
                    nomeCompleto,
                    matricula,
                    string.IsNullOrWhiteSpace(cpf) ? null : cpf,
                    string.IsNullOrWhiteSpace(email) ? null : email,
                    unidade.Id,
                    area.Id,
                    setor.Id,
                    cargo.Id
                );

                _context.Colaboradores.Add(colaborador);
                await _context.SaveChangesAsync(cancellationToken);

                importacaoResult.AdicionarSucesso();
            }
            catch (ArgumentException ex)
            {
                importacaoResult.AdicionarErro(linha, ex.Message);
            }
            catch (Exception ex)
            {
                importacaoResult.AdicionarErro(linha, $"Erro inesperado: {ex.Message}");
            }
        }

        return importacaoResult;
    }

    private static void ValidarCabecalhos(IXLWorksheet worksheet, ImportarColaboradoresResult resultado)
    {
        var cabecalhosEsperados = new[]
        {
            "NomeCompleto", "Matricula", "Cpf", "Email", "Unidade", "Area", "Setor", "Cargo"
        };

        for (int i = 0; i < cabecalhosEsperados.Length; i++)
        {
            var valor = worksheet.Cell(1, i + 1).GetString().Trim();

            if (!string.Equals(valor, cabecalhosEsperados[i], StringComparison.OrdinalIgnoreCase))
            {
                resultado.AdicionarErro(
                    1,
                    $"Cabeçalho inválido na coluna {i + 1}. Esperado: {cabecalhosEsperados[i]}.");
            }
        }
    }

    private async Task<Unidade> ObterOuCriarUnidadeAsync(string nome, CancellationToken cancellationToken)
    {
        var unidade = await _context.Unidades
            .FirstOrDefaultAsync(x => x.Nome == nome, cancellationToken);

        if (unidade is not null)
            return unidade;

        unidade = new Unidade(nome, null);
        _context.Unidades.Add(unidade);
        await _context.SaveChangesAsync(cancellationToken);

        return unidade;
    }

    private async Task<Area> ObterOuCriarAreaAsync(string nome, Guid unidadeId, CancellationToken cancellationToken)
    {
        var area = await _context.Areas
            .FirstOrDefaultAsync(x => x.Nome == nome && x.UnidadeId == unidadeId, cancellationToken);

        if (area is not null)
            return area;

        area = new Area(nome, unidadeId);
        _context.Areas.Add(area);
        await _context.SaveChangesAsync(cancellationToken);

        return area;
    }

    private async Task<Setor> ObterOuCriarSetorAsync(string nome, Guid areaId, CancellationToken cancellationToken)
    {
        var setor = await _context.Setores
            .FirstOrDefaultAsync(x => x.Nome == nome && x.AreaId == areaId, cancellationToken);

        if (setor is not null)
            return setor;

        setor = new Setor(nome, areaId);
        _context.Setores.Add(setor);
        await _context.SaveChangesAsync(cancellationToken);

        return setor;
    }

    private async Task<Cargo> ObterOuCriarCargoAsync(string nome, CancellationToken cancellationToken)
    {
        var cargo = await _context.Cargos
            .FirstOrDefaultAsync(x => x.Nome == nome, cancellationToken);

        if (cargo is not null)
            return cargo;

        cargo = new Cargo(nome, null);
        _context.Cargos.Add(cargo);
        await _context.SaveChangesAsync(cancellationToken);

        return cargo;
    }
}
