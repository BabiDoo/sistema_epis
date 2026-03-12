using System.Text.RegularExpressions;

namespace SistemaEpis.Domain.Entities;

public class Epi
{
    private static readonly Regex CaRegex = new(@"^\d{1,20}$", RegexOptions.Compiled);

    public Guid Id { get; private set; }
    public string Nome { get; private set; } = string.Empty;
    public string Fabricante { get; private set; } = string.Empty;
    public string? FotoUrl { get; private set; }
    public string Ca { get; private set; } = string.Empty;
    public DateOnly ValidadeCa { get; private set; }
    public int DiasDurabilidadePadrao { get; private set; }
    public Guid CategoriaEpiId { get; private set; }
    public bool Ativo { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public CategoriaEpi CategoriaEpi { get; private set; } = null!;
    public ICollection<AtributoTecnicoEpi> AtributosTecnicos { get; private set; } = new List<AtributoTecnicoEpi>();

    private Epi() { }

    public Epi(
        string nome,
        string fabricante,
        string? fotoUrl,
        string ca,
        DateOnly validadeCa,
        int diasDurabilidadePadrao,
        Guid categoriaEpiId)
    {
        Id = Guid.NewGuid();
        Nome = nome.Trim();
        Fabricante = fabricante.Trim();
        FotoUrl = string.IsNullOrWhiteSpace(fotoUrl) ? null : fotoUrl.Trim();
        Ca = NormalizarCa(ca);
        ValidadeCa = validadeCa;
        DiasDurabilidadePadrao = diasDurabilidadePadrao;
        CategoriaEpiId = categoriaEpiId;
        Ativo = true;
        CreatedAt = DateTime.UtcNow;

        Validar();
    }

    public void Atualizar(
        string nome,
        string fabricante,
        string? fotoUrl,
        string ca,
        DateOnly validadeCa,
        int diasDurabilidadePadrao,
        Guid categoriaEpiId)
    {
        Nome = nome.Trim();
        Fabricante = fabricante.Trim();
        FotoUrl = string.IsNullOrWhiteSpace(fotoUrl) ? null : fotoUrl.Trim();
        Ca = NormalizarCa(ca);
        ValidadeCa = validadeCa;
        DiasDurabilidadePadrao = diasDurabilidadePadrao;
        CategoriaEpiId = categoriaEpiId;
        UpdatedAt = DateTime.UtcNow;

        Validar();
    }

    public void Desativar()
    {
        Ativo = false;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Reativar()
    {
        Ativo = true;
        UpdatedAt = DateTime.UtcNow;

        Validar();
    }

    private void Validar()
    {
        if (string.IsNullOrWhiteSpace(Nome))
            throw new ArgumentException("O nome do EPI é obrigatório.");

        if (Nome.Length > 150)
            throw new ArgumentException("O nome do EPI deve ter no máximo 150 caracteres.");

        if (string.IsNullOrWhiteSpace(Fabricante))
            throw new ArgumentException("O fabricante do EPI é obrigatório.");

        if (Fabricante.Length > 150)
            throw new ArgumentException("O fabricante do EPI deve ter no máximo 150 caracteres.");

        if (string.IsNullOrWhiteSpace(Ca))
            throw new ArgumentException("O CA do EPI é obrigatório.");

        if (!CaRegex.IsMatch(Ca))
            throw new ArgumentException("O CA do EPI deve conter apenas números.");

        if (ValidadeCa < DateOnly.FromDateTime(DateTime.UtcNow.Date))
            throw new ArgumentException("Não é permitido cadastrar ou ativar um EPI com CA vencido.");

        if (DiasDurabilidadePadrao <= 0)
            throw new ArgumentException("A durabilidade padrão do EPI deve ser maior que zero.");

        if (DiasDurabilidadePadrao > 3650)
            throw new ArgumentException("A durabilidade padrão do EPI deve ser de no máximo 3650 dias.");

        if (CategoriaEpiId == Guid.Empty)
            throw new ArgumentException("A categoria do EPI é obrigatória.");

        if (FotoUrl is not null && FotoUrl.Length > 500)
            throw new ArgumentException("A URL da foto do EPI deve ter no máximo 500 caracteres.");
    }

    private static string NormalizarCa(string ca)
    {
        if (string.IsNullOrWhiteSpace(ca))
            return string.Empty;

        return ca.Trim();
    }
}
