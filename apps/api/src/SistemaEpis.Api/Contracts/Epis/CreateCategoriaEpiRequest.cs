namespace SistemaEpis.Api.Contracts.Epis;

public record CreateCategoriaEpiRequest(
    string Nome,
    string? Descricao
);
