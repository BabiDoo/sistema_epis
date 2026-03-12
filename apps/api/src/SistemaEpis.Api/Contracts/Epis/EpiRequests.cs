namespace SistemaEpis.Api.Contracts.Epis;

public record CreateEpiRequest(
    string Nome,
    string Fabricante,
    string? FotoUrl,
    string Ca,
    DateOnly ValidadeCa,
    int DiasDurabilidadePadrao,
    Guid CategoriaEpiId
);

public record UpdateEpiRequest(
    string Nome,
    string Fabricante,
    string? FotoUrl,
    string Ca,
    DateOnly ValidadeCa,
    int DiasDurabilidadePadrao,
    Guid CategoriaEpiId
);
