namespace SistemaEpis.Api.Contracts.Epis;

public record CreateAtributoTecnicoEpiRequest(
    Guid EpiId,
    string Chave,
    string Valor);
