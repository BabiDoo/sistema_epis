using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SistemaEpis.Api.Controllers;

[ApiController]
[Route("api/v1/teste")]
public class HealthController : ControllerBase
{
    [HttpGet("publico")]
    public IActionResult Publico()
    {
        return Ok(new { message = "Endpoint público funcionando." });
    }

    [Authorize]
    [HttpGet("protegido")]
    public IActionResult Protegido()
    {
        return Ok(new
        {
            message = "Endpoint protegido funcionando.",
            user = User.Identity?.Name,
            role = User.Claims.FirstOrDefault(c => c.Type.Contains("role"))?.Value
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("somente-admin")]
    public IActionResult SomenteAdmin()
    {
        return Ok(new
        {
            message = "Endpoint exclusivo para administradores funcionando.",
            user = User.Identity?.Name,
            role = User.Claims.FirstOrDefault(c => c.Type.Contains("role"))?.Value
        });
    }

    [HttpGet("erro")]
    public IActionResult Erro()
    {
        throw new Exception("Erro proposital para teste.");
    }
}
