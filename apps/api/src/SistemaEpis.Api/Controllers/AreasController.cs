using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEpis.Api.Contracts.Organizacao;
using SistemaEpis.Domain.Entities;
using SistemaEpis.Infrastructure.Persistence;

namespace SistemaEpis.Api.Controllers;

[ApiController]
[Route("api/v1/areas")]
[Authorize]
public class AreasController : ControllerBase
{
    private readonly AppDbContext _context;

    public AreasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateAreaRequest request, CancellationToken cancellationToken)
    {
        var unidadeExiste = await _context.Unidades.AnyAsync(x => x.Id == request.UnidadeId, cancellationToken);
        if (!unidadeExiste)
            return BadRequest("A unidade informada não existe.");

        var area = new Area(request.Nome, request.UnidadeId);

        _context.Areas.Add(area);
        await _context.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = area.Id }, area);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var areas = await _context.Areas
            .AsNoTracking()
            .OrderBy(x => x.Nome)
            .ToListAsync(cancellationToken);

        return Ok(areas);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var area = await _context.Areas
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (area is null)
            return NotFound();

        return Ok(area);
    }
}
