using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaEpis.Domain.Entities;

namespace SistemaEpis.Infrastructure.Persistence.Configurations;

public class EpiConfiguration : IEntityTypeConfiguration<Epi>
{
    public void Configure(EntityTypeBuilder<Epi> builder)
    {
        builder.ToTable("epi");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Nome)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(x => x.Fabricante)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(x => x.Ca)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(x => x.ValidadeCa)
            .IsRequired();

        builder.Property(x => x.DiasDurabilidadePadrao)
            .IsRequired();

        builder.Property(x => x.FotoUrl)
            .HasMaxLength(500);

        builder.Property(x => x.Ativo)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.UpdatedAt);

        builder.HasOne(x => x.CategoriaEpi)
            .WithMany(x => x.Epis)
            .HasForeignKey(x => x.CategoriaEpiId)
            .OnDelete(DeleteBehavior.Restrict);

        // Unicidade de CA por Fabricante
        builder.HasIndex(x => new { x.Ca, x.Fabricante }).IsUnique();
        builder.HasIndex(x => x.Nome);
    }
}
