namespace SistemaEpis.Domain.Entities;

public class Colaborador
{
    public Guid Id { get; private set; }
    public string NomeCompleto { get; private set; } = string.Empty;
    public string Matricula { get; private set; } = string.Empty;
    public string? Cpf { get; private set; }
    public string? Email { get; private set; }
    public bool Ativo { get; private set; }
    public Guid UnidadeId { get; private set; }
    public Guid AreaId { get; private set; }
    public Guid SetorId { get; private set; }
    public Guid CargoId { get; private set; }
    public Guid? UsuarioId { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public Unidade Unidade { get; private set; } = null!;
    public Area Area { get; private set; } = null!;
    public Setor Setor { get; private set; } = null!;
    public Cargo Cargo { get; private set; } = null!;
    public Usuario? Usuario { get; private set; }

    private Colaborador() { }

    public Colaborador(
        string nomeCompleto,
        string matricula,
        string? cpf,
        string? email,
        Guid unidadeId,
        Guid areaId,
        Guid setorId,
        Guid cargoId)
    {
        Id = Guid.NewGuid();
        NomeCompleto = nomeCompleto.Trim();
        Matricula = matricula.Trim();
        Cpf = string.IsNullOrWhiteSpace(cpf) ? null : cpf.Trim();
        Email = string.IsNullOrWhiteSpace(email) ? null : email.Trim().ToLowerInvariant();
        UnidadeId = unidadeId;
        AreaId = areaId;
        SetorId = setorId;
        CargoId = cargoId;
        Ativo = true;
        CreatedAt = DateTime.UtcNow;

        Validar();
    }

    public void VincularUsuario(Guid usuarioId)
    {
        UsuarioId = usuarioId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AtualizarLotacao(Guid unidadeId, Guid areaId, Guid setorId, Guid cargoId)
    {
        UnidadeId = unidadeId;
        AreaId = areaId;
        SetorId = setorId;
        CargoId = cargoId;
        UpdatedAt = DateTime.UtcNow;
    }

    private void Validar()
    {
        if (string.IsNullOrWhiteSpace(NomeCompleto))
            throw new ArgumentException("O nome completo é obrigatório.");

        if (string.IsNullOrWhiteSpace(Matricula))
            throw new ArgumentException("A matrícula é obrigatória.");

        if (NomeCompleto.Length > 200)
            throw new ArgumentException("O nome completo deve ter no máximo 200 caracteres.");

        if (Matricula.Length > 50)
            throw new ArgumentException("A matrícula deve ter no máximo 50 caracteres.");
    }
}
