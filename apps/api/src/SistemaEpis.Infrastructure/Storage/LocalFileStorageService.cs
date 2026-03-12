using Microsoft.AspNetCore.Hosting;
using SistemaEpis.Application.Features.Anexos;

namespace SistemaEpis.Infrastructure.Storage;

public class LocalFileStorageService : IFileStorageService
{
    private readonly IWebHostEnvironment _environment;

    public LocalFileStorageService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<string> SalvarAsync(
        Stream stream,
        string nomeArquivo,
        CancellationToken cancellationToken)
    {
        var uploadsPath = Path.Combine(_environment.ContentRootPath, "uploads");

        if (!Directory.Exists(uploadsPath))
            Directory.CreateDirectory(uploadsPath);

        var nomeSeguro = $"{Guid.NewGuid()}_{nomeArquivo}";
        var caminhoFisico = Path.Combine(uploadsPath, nomeSeguro);

        await using var fileStream = new FileStream(caminhoFisico, FileMode.CreateNew);
        await stream.CopyToAsync(fileStream, cancellationToken);

        return $"/uploads/{nomeSeguro}";
    }
}
