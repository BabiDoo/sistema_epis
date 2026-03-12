using Microsoft.EntityFrameworkCore;
using SistemaEpis.Domain.Entities;

namespace SistemaEpis.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Unidade> Unidades => Set<Unidade>();
    public DbSet<Area> Areas => Set<Area>();
    public DbSet<Setor> Setores => Set<Setor>();
    public DbSet<Cargo> Cargos => Set<Cargo>();
    public DbSet<Colaborador> Colaboradores => Set<Colaborador>();
    public DbSet<CategoriaEpi> CategoriasEpi => Set<CategoriaEpi>();
    public DbSet<Epi> Epis => Set<Epi>();
    public DbSet<AtributoTecnicoEpi> AtributosTecnicosEpi => Set<AtributoTecnicoEpi>();
    public DbSet<Anexo> Anexos => Set<Anexo>();

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}