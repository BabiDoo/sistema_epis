using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEpis.Api.Contracts.Colaboradores;
using SistemaEpis.Domain.Entities;
using SistemaEpis.Infrastructure.Persistence;

namespace SistemaEpis.Api.Controllers;

[ApiController]
[Route("api/v1/colaboradores")]
[Authorize]
public class ColaboradoresController : ControllerBase
{
    private readonly AppDbContext _context;

    public ColaboradoresController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateColaboradorRequest request, CancellationToken cancellationToken)
    {
        var colaborador = new Colaborador(
            request.NomeCompleto,
            request.Matricula,
            request.Cpf,
            request.Email,
            request.UnidadeId,
            request.AreaId,
            request.SetorId,
            request.CargoId
        );

        _context.Colaboradores.Add(colaborador);
        await _context.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = colaborador.Id }, colaborador);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var colaboradores = await _context.Colaboradores
            .AsNoTracking()
            .OrderBy(x => x.NomeCompleto)
            .ToListAsync(cancellationToken);

        return Ok(colaboradores);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var colaborador = await _context.Colaboradores
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (colaborador is null)
            return NotFound();

        return Ok(colaborador);
    }
}
