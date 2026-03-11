using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEpis.Api.Contracts.Auth;
using SistemaEpis.Infrastructure.Auth;
using SistemaEpis.Infrastructure.Persistence;

namespace SistemaEpis.Api.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly JwtTokenGenerator _tokenGenerator;

    public AuthController(AppDbContext context, JwtTokenGenerator tokenGenerator)
    {
        _context = context;
        _tokenGenerator = tokenGenerator;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(x => x.Email == request.Email && x.Ativo);

        if (usuario is null)
            return Unauthorized("Usuário ou senha inválidos.");

        // Temporário para Fase 1:
        // depois substituímos por hash real com BCrypt/PasswordHasher.
        if (request.Senha != "123456")
            return Unauthorized("Usuário ou senha inválidos.");

        var token = _tokenGenerator.Generate(usuario);

        return Ok(new LoginResponse(token));
    }
}
