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
        // Validações básicas de existência
        if (!await _context.Unidades.AnyAsync(x => x.Id == request.UnidadeId, cancellationToken))
            return BadRequest("A unidade informada não existe.");

        if (!await _context.Areas.AnyAsync(x => x.Id == request.AreaId, cancellationToken))
            return BadRequest("A área informada não existe.");

        if (!await _context.Setores.AnyAsync(x => x.Id == request.SetorId, cancellationToken))
            return BadRequest("o setor informado não existe.");

        if (!await _context.Cargos.AnyAsync(x => x.Id == request.CargoId, cancellationToken))
            return BadRequest("O cargo informado não existe.");

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
        // Query otimizada usando .AsNoTracking() como solicitado
        var colaboradores = await _context.Colaboradores
            .AsNoTracking()
            .Include(x => x.Unidade)
            .Include(x => x.Area)
            .Include(x => x.Setor)
            .Include(x => x.Cargo)
            .OrderBy(x => x.NomeCompleto)
            .ToListAsync(cancellationToken);

        return Ok(colaboradores);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var colaborador = await _context.Colaboradores
            .AsNoTracking()
            .Include(x => x.Unidade)
            .Include(x => x.Area)
            .Include(x => x.Setor)
            .Include(x => x.Cargo)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (colaborador is null)
            return NotFound();

        return Ok(colaborador);
    }
}
