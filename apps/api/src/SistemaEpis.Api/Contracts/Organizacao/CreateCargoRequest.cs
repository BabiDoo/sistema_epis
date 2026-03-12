namespace SistemaEpis.Api.Contracts.Organizacao;

public record CreateCargoRequest(
    string Nome,
    string? Codigo
);
