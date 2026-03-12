using Microsoft.AspNetCore.Http;

namespace SistemaEpis.Application.Features.Importacoes.Colaboradores;

public interface IImportadorColaboradoresExcel
{
    Task<ImportarColaboradoresResult> ImportarAsync(
        IFormFile arquivo,
        CancellationToken cancellationToken);
}
