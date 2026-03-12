using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaEpis.Domain.Entities;

namespace SistemaEpis.Infrastructure.Persistence.Configurations;

public class AreaConfiguration : IEntityTypeConfiguration<Area>
{
    public void Configure(EntityTypeBuilder<Area> builder)
    {
        builder.ToTable("areas");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Nome)
            .IsRequired()
            .HasMaxLength(150);

        builder.HasOne(x => x.Unidade)
            .WithMany(x => x.Areas)
            .HasForeignKey(x => x.UnidadeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => new { x.UnidadeId, x.Nome }).IsUnique();
    }
}
