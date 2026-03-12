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
    public async Task<IActionResult> Create(
        [FromBody] CreateColaboradorRequest request,
        CancellationToken cancellationToken)
    {
        var unidadeExiste = await _context.Unidades
            .AnyAsync(x => x.Id == request.UnidadeId, cancellationToken);

        if (!unidadeExiste)
            return BadRequest("A unidade informada não existe.");

        var area = await _context.Areas
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.AreaId, cancellationToken);

        if (area is null)
            return BadRequest("A área informada não existe.");

        if (area.UnidadeId != request.UnidadeId)
            return BadRequest("A área informada não pertence à unidade selecionada.");

        var setor = await _context.Setores
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.SetorId, cancellationToken);

        if (setor is null)
            return BadRequest("O setor informado não existe.");

        if (setor.AreaId != request.AreaId)
            return BadRequest("O setor informado não pertence à área selecionada.");

        var cargoExiste = await _context.Cargos
            .AnyAsync(x => x.Id == request.CargoId, cancellationToken);

        if (!cargoExiste)
            return BadRequest("O cargo informado não existe.");

        if (request.UsuarioId.HasValue)
        {
            var usuarioExiste = await _context.Usuarios
                .AnyAsync(x => x.Id == request.UsuarioId.Value, cancellationToken);

            if (!usuarioExiste)
                return BadRequest("O usuário informado não existe.");
        }

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

        if (request.UsuarioId.HasValue)
            colaborador.VincularUsuario(request.UsuarioId.Value);

        _context.Colaboradores.Add(colaborador);
        await _context.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = colaborador.Id }, colaborador);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
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

    [HttpPost("{id:guid}/vincular-usuario")]
public async Task<IActionResult> VincularUsuario(
    Guid id,
    [FromBody] VincularUsuarioRequest request,
    CancellationToken cancellationToken)
{
    var colaborador = await _context.Colaboradores
        .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    if (colaborador is null)
        return NotFound("Colaborador não encontrado.");

    var usuarioExiste = await _context.Usuarios
        .AnyAsync(x => x.Id == request.UsuarioId, cancellationToken);

    if (!usuarioExiste)
        return BadRequest("Usuário informado não existe.");

    colaborador.VincularUsuario(request.UsuarioId);

    await _context.SaveChangesAsync(cancellationToken);

    return NoContent();
}
}