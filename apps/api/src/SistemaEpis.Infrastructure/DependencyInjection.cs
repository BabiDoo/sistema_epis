using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SistemaEpis.Infrastructure.Persistence;

namespace SistemaEpis.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<SistemaEpis.Infrastructure.Auth.JwtTokenGenerator>();

        services.AddScoped<SistemaEpis.Application.Features.Importacoes.Colaboradores.IImportadorColaboradoresExcel, 
            SistemaEpis.Infrastructure.Integrations.Excel.ImportadorColaboradoresExcel>();

        services.AddScoped<SistemaEpis.Application.Features.Anexos.IFileStorageService, 
            SistemaEpis.Infrastructure.Storage.LocalFileStorageService>();

        return services;
    }
}