namespace SistemaEpis.Api.Contracts.Epis;

public record AtributoTecnicoEpiResponse(
    Guid Id,
    string Chave,
    string Valor,
    DateTime CreatedAt,
    DateTime? UpdatedAt);
