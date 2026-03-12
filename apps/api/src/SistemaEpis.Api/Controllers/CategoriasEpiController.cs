using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEpis.Api.Contracts.Epis;
using SistemaEpis.Domain.Entities;
using SistemaEpis.Infrastructure.Persistence;

namespace SistemaEpis.Api.Controllers;

[ApiController]
[Route("api/v1/categorias-epi")]
[Authorize]
public class CategoriasEpiController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriasEpiController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateCategoriaEpiRequest request,
        CancellationToken cancellationToken)
    {
        var nomeJaExiste = await _context.CategoriasEpi
            .AnyAsync(x => x.Nome == request.Nome, cancellationToken);

        if (nomeJaExiste)
            return BadRequest("Já existe uma categoria de EPI com esse nome.");

        var categoria = new CategoriaEpi(request.Nome, request.Descricao);

        _context.CategoriasEpi.Add(categoria);
        await _context.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = categoria.Id }, categoria);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var categorias = await _context.CategoriasEpi
            .AsNoTracking()
            .OrderBy(x => x.Nome)
            .ToListAsync(cancellationToken);

        return Ok(categorias);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var categoria = await _context.CategoriasEpi
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (categoria is null)
            return NotFound();

        return Ok(categoria);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateCategoriaEpiRequest request,
        CancellationToken cancellationToken)
    {
        var categoria = await _context.CategoriasEpi
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (categoria is null)
            return NotFound();

        categoria.Atualizar(request.Nome, request.Descricao);
        await _context.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var categoria = await _context.CategoriasEpi
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (categoria is null)
            return NotFound();

        // Verificando se existem EPIs vinculados antes de excluir (ou apenas desativar)
        var temEpis = await _context.Epis.AnyAsync(x => x.CategoriaEpiId == id, cancellationToken);
        if (temEpis)
            return BadRequest("Não é possível excluir uma categoria que possui EPIs vinculados.");

        _context.CategoriasEpi.Remove(categoria);
        await _context.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}
