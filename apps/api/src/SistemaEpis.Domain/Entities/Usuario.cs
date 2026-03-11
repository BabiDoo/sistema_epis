namespace SistemaEpis.Domain.Entities;

public class Usuario
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public string Nome { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string SenhaHash { get; private set; } = string.Empty;
    public string Perfil { get; private set; } = "Admin";
    public bool Ativo { get; private set; } = true;
    public DateTime CriadoEmUtc { get; private set; } = DateTime.UtcNow;

    private Usuario() { }

    public Usuario(string nome, string email, string senhaHash, string perfil)
    {
        Nome = nome;
        Email = email;
        SenhaHash = senhaHash;
        Perfil = perfil;
    }
}