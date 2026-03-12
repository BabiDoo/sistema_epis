using SistemaEpis.Domain.Enums;

namespace SistemaEpis.Domain.Entities;

public class Anexo
{
    public Guid Id { get; private set; }
    public TipoAnexo Tipo { get; private set; }
    public string UrlStorage { get; private set; } = string.Empty;
    public string EntidadeTipo { get; private set; } = string.Empty;
    public Guid EntidadeId { get; private set; }
    public Guid? UsuarioId { get; private set; }
    public string NomeOriginal { get; private set; } = string.Empty;
    public string ContentType { get; private set; } = string.Empty;
    public long TamanhoBytes { get; private set; }
    public DateTime DataCriacao { get; private set; }

    public Usuario? Usuario { get; private set; }

    private Anexo() { }

    public Anexo(
        TipoAnexo tipo,
        string urlStorage,
        string entidadeTipo,
        Guid entidadeId,
        Guid? usuarioId,
        string nomeOriginal,
        string contentType,
        long tamanhoBytes)
    {
        Id = Guid.NewGuid();
        Tipo = tipo;
        UrlStorage = urlStorage.Trim();
        EntidadeTipo = entidadeTipo.Trim().ToUpperInvariant();
        EntidadeId = entidadeId;
        UsuarioId = usuarioId;
        NomeOriginal = nomeOriginal.Trim();
        ContentType = contentType.Trim();
        TamanhoBytes = tamanhoBytes;
        DataCriacao = DateTime.UtcNow;

        Validar();
    }

    private void Validar()
    {
        if (string.IsNullOrWhiteSpace(UrlStorage))
            throw new ArgumentException("A URL do storage é obrigatória.");

        if (string.IsNullOrWhiteSpace(EntidadeTipo))
            throw new ArgumentException("O tipo da entidade é obrigatório.");

        if (EntidadeId == Guid.Empty)
            throw new ArgumentException("O identificador da entidade é obrigatório.");

        if (string.IsNullOrWhiteSpace(NomeOriginal))
            throw new ArgumentException("O nome original do arquivo é obrigatório.");

        if (string.IsNullOrWhiteSpace(ContentType))
            throw new ArgumentException("O content type do arquivo é obrigatório.");

        if (TamanhoBytes <= 0)
            throw new ArgumentException("O tamanho do arquivo deve ser maior que zero.");

        if (UrlStorage.Length > 500)
            throw new ArgumentException("A URL do storage deve ter no máximo 500 caracteres.");

        if (EntidadeTipo.Length > 80)
            throw new ArgumentException("O tipo da entidade deve ter no máximo 80 caracteres.");

        if (NomeOriginal.Length > 255)
            throw new ArgumentException("O nome original do arquivo deve ter no máximo 255 caracteres.");

        if (ContentType.Length > 120)
            throw new ArgumentException("O content type deve ter no máximo 120 caracteres.");
    }
}
