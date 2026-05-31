using HelpDesk.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RolesController : ControllerBase
{
    private readonly AppDbContext _context;

    public RolesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetRoles()
    {
        var roles = await _context.Roles
            .Select(r => new
            {
                r.Id,
                r.RoleName
            })
            .ToListAsync();

        return Ok(roles);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin-only")]
    public IActionResult AdminOnly()
    {
        return Ok("You are authorized as Admin.");
    }

    [Authorize(Roles = "IT Support Agent,Admin")]
    [HttpGet("agent-or-admin")]
    public IActionResult AgentOrAdmin()
    {
        return Ok("You are authorized as IT Support Agent or Admin.");
    }
}