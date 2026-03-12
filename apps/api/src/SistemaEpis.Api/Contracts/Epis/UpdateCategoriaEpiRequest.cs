namespace SistemaEpis.Api.Contracts.Epis;

public record UpdateCategoriaEpiRequest(
    string Nome,
    string? Descricao
);
