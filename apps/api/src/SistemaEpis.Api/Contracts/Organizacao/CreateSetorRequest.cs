namespace SistemaEpis.Api.Contracts.Organizacao;

public record CreateSetorRequest(
    string Nome,
    Guid AreaId
);
