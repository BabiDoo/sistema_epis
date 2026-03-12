using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEpis.Api.Contracts.Anexos;
using SistemaEpis.Application.Features.Anexos;
using SistemaEpis.Domain.Entities;
using SistemaEpis.Infrastructure.Persistence;

namespace SistemaEpis.Api.Controllers;

[ApiController]
[Route("api/v1/anexos")]
[Authorize]
public class AnexosController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IFileStorageService _fileStorageService;

    public AnexosController(
        AppDbContext context,
        IFileStorageService fileStorageService)
    {
        _context = context;
        _fileStorageService = fileStorageService;
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Upload(
        [FromForm] UploadAnexoRequest request,
        CancellationToken cancellationToken)
    {
        if (request.Arquivo is null || request.Arquivo.Length == 0)
            return BadRequest("Arquivo não enviado ou vazio.");

        if (string.IsNullOrWhiteSpace(request.EntidadeTipo))
            return BadRequest("EntidadeTipo é obrigatório.");

        if (request.EntidadeId == Guid.Empty)
            return BadRequest("EntidadeId é obrigatório.");

        if (request.Arquivo.Length > 10 * 1024 * 1024)
            return BadRequest("O arquivo deve ter no máximo 10 MB.");

        var contentTypesPermitidos = new[]
        {
            "application/pdf",
            "image/png",
            "image/jpeg",
            "image/jpg"
        };

        if (!contentTypesPermitidos.Contains(request.Arquivo.ContentType.ToLowerInvariant()))
            return BadRequest("Tipo de arquivo não permitido. Use PDF, PNG ou JPG.");

        var extensao = Path.GetExtension(request.Arquivo.FileName);
        var nomeBase = Path.GetFileNameWithoutExtension(request.Arquivo.FileName);
        var nomeSeguro = $"{nomeBase}{extensao}";

        await using var stream = request.Arquivo.OpenReadStream();
        var urlStorage = await _fileStorageService.SalvarAsync(
            stream,
            nomeSeguro,
            cancellationToken);

        Guid? usuarioId = null;

        var userIdClaim = User.Claims.FirstOrDefault(x => x.Type == "sub")?.Value;
        if (Guid.TryParse(userIdClaim, out var parsedUserId))
        {
            var usuarioExiste = await _context.Usuarios
                .AnyAsync(x => x.Id == parsedUserId, cancellationToken);

            if (usuarioExiste)
                usuarioId = parsedUserId;
        }

        try
        {
            var anexo = new Anexo(
                request.Tipo,
                urlStorage,
                request.EntidadeTipo,
                request.EntidadeId,
                usuarioId,
                request.Arquivo.FileName,
                request.Arquivo.ContentType,
                request.Arquivo.Length
            );

            _context.Anexos.Add(anexo);
            await _context.SaveChangesAsync(cancellationToken);

            return CreatedAtAction(nameof(GetById), new { id = anexo.Id }, anexo);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var anexo = await _context.Anexos
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (anexo is null)
            return NotFound();

        return Ok(anexo);
    }

    [HttpGet]
    public async Task<IActionResult> GetByEntidade(
        [FromQuery] string entidadeTipo,
        [FromQuery] Guid entidadeId,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(entidadeTipo) || entidadeId == Guid.Empty)
            return BadRequest("Informe entidadeTipo e entidadeId.");

        var anexos = await _context.Anexos
            .AsNoTracking()
            .Where(x => x.EntidadeTipo == entidadeTipo.Trim().ToUpper() && x.EntidadeId == entidadeId)
            .OrderByDescending(x => x.DataCriacao)
            .ToListAsync(cancellationToken);

        return Ok(anexos);
    }
}
