using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEpis.Api.Contracts.Epis;
using SistemaEpis.Domain.Entities;
using SistemaEpis.Infrastructure.Persistence;

namespace SistemaEpis.Api.Controllers;

[ApiController]
[Route("api/v1/epis")]
[Authorize]
public class EpisController : ControllerBase
{
    private readonly AppDbContext _context;

    public EpisController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateEpiRequest request,
        CancellationToken cancellationToken)
    {
        var categoriaExiste = await _context.CategoriasEpi
            .AnyAsync(x => x.Id == request.CategoriaEpiId, cancellationToken);

        if (!categoriaExiste)
            return BadRequest("A categoria informada não existe.");

        var duplicado = await _context.Epis
            .AnyAsync(x => x.Ca == request.Ca && x.Fabricante == request.Fabricante, cancellationToken);

        if (duplicado)
            return BadRequest("Já existe um EPI cadastrado com o mesmo CA e fabricante.");

        try
        {
            var epi = new Epi(
                request.Nome,
                request.Fabricante,
                request.FotoUrl,
                request.Ca,
                request.ValidadeCa,
                request.DiasDurabilidadePadrao,
                request.CategoriaEpiId
            );

            _context.Epis.Add(epi);
            await _context.SaveChangesAsync(cancellationToken);

            return CreatedAtAction(nameof(GetById), new { id = epi.Id }, epi);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var epis = await _context.Epis
            .AsNoTracking()
            .Include(x => x.CategoriaEpi)
            .OrderBy(x => x.Nome)
            .ToListAsync(cancellationToken);

        return Ok(epis);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var epi = await _context.Epis
            .AsNoTracking()
            .Include(x => x.CategoriaEpi)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (epi is null)
            return NotFound();

        return Ok(epi);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateEpiRequest request,
        CancellationToken cancellationToken)
    {
        var epi = await _context.Epis
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (epi is null)
            return NotFound();

        var categoriaExiste = await _context.CategoriasEpi
            .AnyAsync(x => x.Id == request.CategoriaEpiId, cancellationToken);

        if (!categoriaExiste)
            return BadRequest("A categoria informada não existe.");

        var duplicado = await _context.Epis
            .AnyAsync(x =>
                x.Id != id &&
                x.Ca == request.Ca &&
                x.Fabricante == request.Fabricante,
                cancellationToken);

        if (duplicado)
            return BadRequest("Já existe outro EPI cadastrado com o mesmo CA e fabricante.");

        try
        {
            epi.Atualizar(
                request.Nome,
                request.Fabricante,
                request.FotoUrl,
                request.Ca,
                request.ValidadeCa,
                request.DiasDurabilidadePadrao,
                request.CategoriaEpiId
            );

            await _context.SaveChangesAsync(cancellationToken);

            return Ok(epi);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("{id:guid}/desativar")]
    public async Task<IActionResult> Desativar(Guid id, CancellationToken cancellationToken)
    {
        var epi = await _context.Epis
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (epi is null)
            return NotFound();

        epi.Desativar();
        await _context.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpPost("{id:guid}/reativar")]
    public async Task<IActionResult> Reativar(Guid id, CancellationToken cancellationToken)
    {
        var epi = await _context.Epis
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (epi is null)
            return NotFound();

        try
        {
            epi.Reativar();
            await _context.SaveChangesAsync(cancellationToken);

            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
