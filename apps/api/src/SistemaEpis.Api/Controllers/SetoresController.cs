using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEpis.Api.Contracts.Organizacao;
using SistemaEpis.Domain.Entities;
using SistemaEpis.Infrastructure.Persistence;

namespace SistemaEpis.Api.Controllers;

[ApiController]
[Route("api/v1/setores")]
[Authorize]
public class SetoresController : ControllerBase
{
    private readonly AppDbContext _context;

    public SetoresController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateSetorRequest request, CancellationToken cancellationToken)
    {
        var setor = new Setor(request.Nome, request.AreaId);

        _context.Setores.Add(setor);
        await _context.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = setor.Id }, setor);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var setores = await _context.Setores
            .AsNoTracking()
            .OrderBy(x => x.Nome)
            .ToListAsync(cancellationToken);

        return Ok(setores);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var setor = await _context.Setores
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (setor is null)
            return NotFound();

        return Ok(setor);
    }
}
