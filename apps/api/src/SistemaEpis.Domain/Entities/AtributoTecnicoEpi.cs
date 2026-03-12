namespace SistemaEpis.Domain.Entities;

public class AtributoTecnicoEpi
{
    public Guid Id { get; private set; }
    public Guid EpiId { get; private set; }
    public string Chave { get; private set; } = string.Empty;
    public string Valor { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public Epi Epi { get; private set; } = null!;

    private AtributoTecnicoEpi() { }

    public AtributoTecnicoEpi(Guid epiId, string chave, string valor)
    {
        Id = Guid.NewGuid();
        EpiId = epiId;
        Chave = NormalizarChave(chave);
        Valor = valor.Trim();
        CreatedAt = DateTime.UtcNow;

        Validar();
    }

    public void Atualizar(string chave, string valor)
    {
        Chave = NormalizarChave(chave);
        Valor = valor.Trim();
        UpdatedAt = DateTime.UtcNow;

        Validar();
    }

    private void Validar()
    {
        if (EpiId == Guid.Empty)
            throw new ArgumentException("O EPI é obrigatório.");

        if (string.IsNullOrWhiteSpace(Chave))
            throw new ArgumentException("A chave do atributo técnico é obrigatória.");

        if (string.IsNullOrWhiteSpace(Valor))
            throw new ArgumentException("O valor do atributo técnico é obrigatório.");

        if (Chave.Length > 50)
            throw new ArgumentException("A chave do atributo técnico deve ter no máximo 50 caracteres.");

        if (Valor.Length > 100)
            throw new ArgumentException("O valor do atributo técnico deve ter no máximo 100 caracteres.");
    }

    private static string NormalizarChave(string chave)
        => string.IsNullOrWhiteSpace(chave)
            ? string.Empty
            : chave.Trim().ToUpperInvariant();
}
