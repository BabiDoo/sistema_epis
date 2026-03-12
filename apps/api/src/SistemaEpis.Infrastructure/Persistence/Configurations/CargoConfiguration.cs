using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaEpis.Domain.Entities;

namespace SistemaEpis.Infrastructure.Persistence.Configurations;

public class CargoConfiguration : IEntityTypeConfiguration<Cargo>
{
    public void Configure(EntityTypeBuilder<Cargo> builder)
    {
        builder.ToTable("cargos");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Nome)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(x => x.Codigo)
            .HasMaxLength(30);

        builder.HasIndex(x => x.Nome);
        builder.HasIndex(x => x.Codigo).IsUnique();
    }
}
