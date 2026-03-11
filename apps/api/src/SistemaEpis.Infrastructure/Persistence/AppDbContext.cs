using Microsoft.EntityFrameworkCore;
using SistemaEpis.Domain.Entities;

namespace SistemaEpis.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public DbSet<Usuario> Usuarios => Set<Usuario>();

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.ToTable("usuarios");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Nome)
                .HasColumnName("nome")
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(x => x.Email)
                .HasColumnName("email")
                .HasMaxLength(200)
                .IsRequired();

            entity.HasIndex(x => x.Email).IsUnique();

            entity.Property(x => x.SenhaHash)
                .HasColumnName("senha_hash")
                .IsRequired();

            entity.Property(x => x.Perfil)
                .HasColumnName("perfil")
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(x => x.Ativo)
                .HasColumnName("ativo")
                .IsRequired();

            entity.Property(x => x.CriadoEmUtc)
                .HasColumnName("criado_em_utc")
                .IsRequired();
        });
    }
}