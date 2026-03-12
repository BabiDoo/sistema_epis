namespace SistemaEpis.Domain.Entities;

public class Unidade
{
    public Guid Id { get; private set; }
    public string Nome { get; private set; } = string.Empty;
    public string? Codigo { get; private set; }
    public bool Ativa { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public ICollection<Area> Areas { get; private set; } = new List<Area>();
    public ICollection<Colaborador> Colaboradores { get; private set; } = new List<Colaborador>();

    private Unidade() { }

    public Unidade(string nome, string? codigo)
    {
        Id = Guid.NewGuid();
        Nome = nome.Trim();
        Codigo = string.IsNullOrWhiteSpace(codigo) ? null : codigo.Trim();
        Ativa = true;
        CreatedAt = DateTime.UtcNow;

        Validar();
    }

    public void Atualizar(string nome, string? codigo)
    {
        Nome = nome.Trim();
        Codigo = string.IsNullOrWhiteSpace(codigo) ? null : codigo.Trim();
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
            throw new ArgumentException("O nome da unidade é obrigatório.");

        if (Nome.Length > 150)
            throw new ArgumentException("O nome da unidade deve ter no máximo 150 caracteres.");

        if (Codigo is not null && Codigo.Length > 30)
            throw new ArgumentException("O código da unidade deve ter no máximo 30 caracteres.");
    }
}
