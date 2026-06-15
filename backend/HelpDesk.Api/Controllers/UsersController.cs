using HelpDesk.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
            .Include(u => u.Role)
            .Select(u => new
            {
                u.Id,
                u.FullName,
                u.Email,
                RoleName = u.Role != null ? u.Role.RoleName : ""
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("agents")]
    public async Task<IActionResult> GetAgents()
    {
        var agents = await _context.Users
            .Include(u => u.Role)
            .Where(u => u.Role != null && u.Role.RoleName == "IT Support Agent")
            .Select(u => new
            {
                u.Id,
                u.FullName,
                u.Email,
                RoleName = u.Role != null ? u.Role.RoleName : ""
            })
            .ToListAsync();

        return Ok(agents);
    }
}