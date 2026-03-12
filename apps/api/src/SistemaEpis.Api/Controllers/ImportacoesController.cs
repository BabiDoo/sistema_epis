using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaEpis.Application.Features.Importacoes.Colaboradores;

namespace SistemaEpis.Api.Controllers;

[ApiController]
[Route("api/v1/importacoes")]
[Authorize]
public class ImportacoesController : ControllerBase
{
    private readonly IImportadorColaboradoresExcel _importadorColaboradoresExcel;

    public ImportacoesController(IImportadorColaboradoresExcel importadorColaboradoresExcel)
    {
        _importadorColaboradoresExcel = importadorColaboradoresExcel;
    }

    [HttpPost("colaboradores/excel")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> ImportarColaboradoresExcel(
        IFormFile arquivo,
        CancellationToken cancellationToken)
    {
        var resultado = await _importadorColaboradoresExcel
            .ImportarAsync(arquivo, cancellationToken);

        return Ok(resultado);
    }
}
