namespace SistemaEpis.Application.Features.Anexos;

public interface IFileStorageService
{
    Task<string> SalvarAsync(
        Stream stream,
        string nomeArquivo,
        CancellationToken cancellationToken);
}
