namespace SistemaEpis.Api.Contracts.Colaboradores;

public record CreateColaboradorRequest(
    string NomeCompleto,
    string Matricula,
    string? Cpf,
    string? Email,
    Guid UnidadeId,
    Guid AreaId,
    Guid SetorId,
    Guid CargoId,
    Guid? UsuarioId
);