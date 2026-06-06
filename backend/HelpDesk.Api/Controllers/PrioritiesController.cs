using HelpDesk.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PrioritiesController : ControllerBase
{
    private readonly AppDbContext _context;

    public PrioritiesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetPriorities()
    {
        var priorities = await _context.Priorities
            .Select(p => new
            {
                p.Id,
                p.PriorityName
            })
            .ToListAsync();

        return Ok(priorities);
    }
}