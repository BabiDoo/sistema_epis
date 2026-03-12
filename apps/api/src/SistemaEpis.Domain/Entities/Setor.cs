namespace SistemaEpis.Domain.Entities;

public class Setor
{
    public Guid Id { get; private set; }
    public string Nome { get; private set; } = string.Empty;
    public bool Ativo { get; private set; }
    public Guid AreaId { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public Area Area { get; private set; } = null!;
    public ICollection<Colaborador> Colaboradores { get; private set; } = new List<Colaborador>();

    private Setor() { }

    public Setor(string nome, Guid areaId)
    {
        Id = Guid.NewGuid();
        Nome = nome.Trim();
        AreaId = areaId;
        Ativo = true;
        CreatedAt = DateTime.UtcNow;

        if (string.IsNullOrWhiteSpace(Nome))
            throw new ArgumentException("O nome do setor é obrigatório.");
    }
}
