using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaEpis.Domain.Entities;

namespace SistemaEpis.Infrastructure.Persistence.Configurations;

public class AnexoConfiguration : IEntityTypeConfiguration<Anexo>
{
    public void Configure(EntityTypeBuilder<Anexo> builder)
    {
        builder.ToTable("anexo");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Tipo)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(x => x.UrlStorage)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(x => x.EntidadeTipo)
            .IsRequired()
            .HasMaxLength(80);

        builder.Property(x => x.EntidadeId)
            .IsRequired();

        builder.Property(x => x.NomeOriginal)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(x => x.ContentType)
            .IsRequired()
            .HasMaxLength(120);

        builder.Property(x => x.TamanhoBytes)
            .IsRequired();

        builder.Property(x => x.DataCriacao)
            .IsRequired();

        builder.HasOne(x => x.Usuario)
            .WithMany()
            .HasForeignKey(x => x.UsuarioId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => new { x.EntidadeTipo, x.EntidadeId });
        builder.HasIndex(x => x.Tipo);
    }
}
