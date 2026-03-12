namespace SistemaEpis.Domain.Entities;

public class Cargo
{
    public Guid Id { get; private set; }
    public string Nome { get; private set; } = string.Empty;
    public string? Codigo { get; private set; }
    public bool Ativo { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public ICollection<Colaborador> Colaboradores { get; private set; } = new List<Colaborador>();

    private Cargo() { }

    public Cargo(string nome, string? codigo)
    {
        Id = Guid.NewGuid();
        Nome = nome.Trim();
        Codigo = string.IsNullOrWhiteSpace(codigo) ? null : codigo.Trim();
        Ativo = true;
        CreatedAt = DateTime.UtcNow;

        if (string.IsNullOrWhiteSpace(Nome))
            throw new ArgumentException("O nome do cargo é obrigatório.");
    }
}
