using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaEpis.Domain.Entities;

namespace SistemaEpis.Infrastructure.Persistence.Configurations;

public class ColaboradorConfiguration : IEntityTypeConfiguration<Colaborador>
{
    public void Configure(EntityTypeBuilder<Colaborador> builder)
    {
        builder.ToTable("colaboradores");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.NomeCompleto)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Matricula)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(x => x.Cpf)
            .HasMaxLength(14);

        builder.Property(x => x.Email)
            .HasMaxLength(150);

        builder.HasIndex(x => x.Matricula).IsUnique();
        builder.HasIndex(x => x.Cpf).IsUnique();

        builder.HasOne(x => x.Unidade)
            .WithMany(x => x.Colaboradores)
            .HasForeignKey(x => x.UnidadeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Area)
            .WithMany(x => x.Colaboradores)
            .HasForeignKey(x => x.AreaId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Setor)
            .WithMany(x => x.Colaboradores)
            .HasForeignKey(x => x.SetorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Cargo)
            .WithMany(x => x.Colaboradores)
            .HasForeignKey(x => x.CargoId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Usuario)
            .WithMany()
            .HasForeignKey(x => x.UsuarioId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
