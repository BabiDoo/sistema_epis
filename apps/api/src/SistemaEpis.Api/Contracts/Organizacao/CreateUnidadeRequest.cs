namespace SistemaEpis.Api.Contracts.Organizacao;

public record CreateUnidadeRequest(
    string Nome,
    string? Codigo
);
