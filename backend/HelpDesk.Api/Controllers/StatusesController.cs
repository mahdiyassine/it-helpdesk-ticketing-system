using HelpDesk.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatusesController : ControllerBase
{
    private readonly AppDbContext _context;

    public StatusesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetStatuses()
    {
        var statuses = await _context.Statuses
            .Select(s => new
            {
                s.Id,
                s.StatusName
            })
            .ToListAsync();

        return Ok(statuses);
    }
}