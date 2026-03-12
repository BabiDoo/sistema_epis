using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaEpis.Domain.Entities;

namespace SistemaEpis.Infrastructure.Persistence.Configurations;

public class CategoriaEpiConfiguration : IEntityTypeConfiguration<CategoriaEpi>
{
    public void Configure(EntityTypeBuilder<CategoriaEpi> builder)
    {
        builder.ToTable("categorias_epi");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Nome)
            .IsRequired()
            .HasMaxLength(120);

        builder.Property(x => x.Descricao)
            .HasMaxLength(500);

        builder.Property(x => x.Ativa)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.UpdatedAt);

        builder.HasIndex(x => x.Nome)
            .IsUnique();
    }
}
