using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEpis.Api.Contracts.Epis;
using SistemaEpis.Domain.Entities;
using SistemaEpis.Infrastructure.Persistence;

namespace SistemaEpis.Api.Controllers;

[ApiController]
[Route("api/v1/atributos-tecnicos-epi")]
[Authorize]
public class AtributosTecnicosEpiController : ControllerBase
{
    private readonly AppDbContext _context;

    public AtributosTecnicosEpiController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateAtributoTecnicoEpiRequest request,
        CancellationToken cancellationToken)
    {
        var epiExiste = await _context.Epis
            .AnyAsync(x => x.Id == request.EpiId, cancellationToken);

        if (!epiExiste)
            return BadRequest("O EPI informado não existe.");

        var duplicado = await _context.AtributosTecnicosEpi
            .AnyAsync(x =>
                x.EpiId == request.EpiId &&
                x.Chave == request.Chave.Trim().ToUpper() &&
                x.Valor == request.Valor.Trim(),
                cancellationToken);

        if (duplicado)
            return BadRequest("Já existe esse atributo técnico para o EPI informado.");

        try
        {
            var atributo = new AtributoTecnicoEpi(
                request.EpiId,
                request.Chave,
                request.Valor
            );

            _context.AtributosTecnicosEpi.Add(atributo);
            await _context.SaveChangesAsync(cancellationToken);

            return CreatedAtAction(nameof(GetById), new { id = atributo.Id }, new AtributoTecnicoEpiResponse(
                atributo.Id,
                atributo.Chave,
                atributo.Valor,
                atributo.CreatedAt,
                atributo.UpdatedAt));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("por-epi/{epiId:guid}")]
    public async Task<IActionResult> GetByEpi(Guid epiId, CancellationToken cancellationToken)
    {
        var atributos = await _context.AtributosTecnicosEpi
            .AsNoTracking()
            .Where(x => x.EpiId == epiId)
            .OrderBy(x => x.Chave)
            .ThenBy(x => x.Valor)
            .Select(x => new AtributoTecnicoEpiResponse(
                x.Id,
                x.Chave,
                x.Valor,
                x.CreatedAt,
                x.UpdatedAt))
            .ToListAsync(cancellationToken);

        return Ok(atributos);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var atributo = await _context.AtributosTecnicosEpi
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new AtributoTecnicoEpiResponse(
                x.Id,
                x.Chave,
                x.Valor,
                x.CreatedAt,
                x.UpdatedAt))
            .FirstOrDefaultAsync(cancellationToken);

        if (atributo is null)
            return NotFound();

        return Ok(atributo);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateAtributoTecnicoEpiRequest request,
        CancellationToken cancellationToken)
    {
        var atributo = await _context.AtributosTecnicosEpi
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (atributo is null)
            return NotFound();

        var chaveNormalizada = request.Chave.Trim().ToUpper();
        var valorNormalizado = request.Valor.Trim();

        var duplicado = await _context.AtributosTecnicosEpi
            .AnyAsync(x =>
                x.Id != id &&
                x.EpiId == atributo.EpiId &&
                x.Chave == chaveNormalizada &&
                x.Valor == valorNormalizado,
                cancellationToken);

        if (duplicado)
            return BadRequest("Já existe esse atributo técnico para o EPI informado.");

        try
        {
            atributo.Atualizar(request.Chave, request.Valor);
            await _context.SaveChangesAsync(cancellationToken);

            return Ok(new AtributoTecnicoEpiResponse(
                atributo.Id,
                atributo.Chave,
                atributo.Valor,
                atributo.CreatedAt,
                atributo.UpdatedAt));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var atributo = await _context.AtributosTecnicosEpi
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (atributo is null)
            return NotFound();

        _context.AtributosTecnicosEpi.Remove(atributo);
        await _context.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}
