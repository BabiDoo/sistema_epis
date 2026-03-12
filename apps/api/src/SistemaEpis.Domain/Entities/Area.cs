namespace SistemaEpis.Domain.Entities;

public class Area
{
    public Guid Id { get; private set; }
    public string Nome { get; private set; } = string.Empty;
    public bool Ativa { get; private set; }
    public Guid UnidadeId { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public Unidade Unidade { get; private set; } = null!;
    public ICollection<Setor> Setores { get; private set; } = new List<Setor>();
    public ICollection<Colaborador> Colaboradores { get; private set; } = new List<Colaborador>();

    private Area() { }

    public Area(string nome, Guid unidadeId)
    {
        Id = Guid.NewGuid();
        Nome = nome.Trim();
        UnidadeId = unidadeId;
        Ativa = true;
        CreatedAt = DateTime.UtcNow;

        if (string.IsNullOrWhiteSpace(Nome))
            throw new ArgumentException("O nome da área é obrigatório.");
    }
}
