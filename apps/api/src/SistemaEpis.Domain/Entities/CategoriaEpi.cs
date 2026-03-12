namespace SistemaEpis.Domain.Entities;

public class CategoriaEpi
{
    public Guid Id { get; private set; }
    public string Nome { get; private set; } = string.Empty;
    public string? Descricao { get; private set; }
    public bool Ativa { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public ICollection<Epi> Epis { get; private set; } = new List<Epi>();

    private CategoriaEpi() { }

    public CategoriaEpi(string nome, string? descricao)
    {
        Id = Guid.NewGuid();
        Nome = nome.Trim();
        Descricao = string.IsNullOrWhiteSpace(descricao) ? null : descricao.Trim();
        Ativa = true;
        CreatedAt = DateTime.UtcNow;

        Validar();
    }

    public void Atualizar(string nome, string? descricao)
    {
        Nome = nome.Trim();
        Descricao = string.IsNullOrWhiteSpace(descricao) ? null : descricao.Trim();
        UpdatedAt = DateTime.UtcNow;

        Validar();
    }

    public void Desativar()
    {
        Ativa = false;
        UpdatedAt = DateTime.UtcNow;
    }

    private void Validar()
    {
        if (string.IsNullOrWhiteSpace(Nome))
            throw new ArgumentException("O nome da categoria de EPI é obrigatório.");

        if (Nome.Length > 120)
            throw new ArgumentException("O nome da categoria de EPI deve ter no máximo 120 caracteres.");

        if (Descricao is not null && Descricao.Length > 500)
            throw new ArgumentException("A descrição da categoria de EPI deve ter no máximo 500 caracteres.");
    }
}
