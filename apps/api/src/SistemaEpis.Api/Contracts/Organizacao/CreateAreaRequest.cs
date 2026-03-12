namespace SistemaEpis.Api.Contracts.Organizacao;

public record CreateAreaRequest(
    string Nome,
    Guid UnidadeId
);
