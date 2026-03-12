using Microsoft.AspNetCore.Http;
using SistemaEpis.Domain.Enums;

namespace SistemaEpis.Api.Contracts.Anexos;

public class UploadAnexoRequest
{
    public TipoAnexo Tipo { get; set; }
    public string EntidadeTipo { get; set; } = string.Empty;
    public Guid EntidadeId { get; set; }
    public IFormFile Arquivo { get; set; } = null!;
}
