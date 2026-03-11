using Microsoft.EntityFrameworkCore;
using SistemaEpis.Domain.Entities;

namespace SistemaEpis.Infrastructure.Persistence;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        await context.Database.MigrateAsync();

        if (await context.Usuarios.AnyAsync())
            return;

        var admin = new Usuario(
            nome: "Administrador",
            email: "admin@sistemaepis.com",
            senhaHash: "TEMP_123456",
            perfil: "Admin"
        );

        context.Usuarios.Add(admin);
        await context.SaveChangesAsync();
    }
}
