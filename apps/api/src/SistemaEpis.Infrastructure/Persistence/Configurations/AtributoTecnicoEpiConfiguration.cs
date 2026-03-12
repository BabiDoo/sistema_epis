using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaEpis.Domain.Entities;

namespace SistemaEpis.Infrastructure.Persistence.Configurations;

public class AtributoTecnicoEpiConfiguration : IEntityTypeConfiguration<AtributoTecnicoEpi>
{
    public void Configure(EntityTypeBuilder<AtributoTecnicoEpi> builder)
    {
        builder.ToTable("atributo_tecnico_epi");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Chave)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(x => x.Valor)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.UpdatedAt);

        builder.HasOne(x => x.Epi)
            .WithMany(x => x.AtributosTecnicos)
            .HasForeignKey(x => x.EpiId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => new { x.EpiId, x.Chave, x.Valor }).IsUnique();
    }
}
