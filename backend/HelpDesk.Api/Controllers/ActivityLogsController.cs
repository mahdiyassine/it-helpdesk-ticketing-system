using HelpDesk.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ActivityLogsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ActivityLogsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetActivityLogs()
    {
        var logs = await _context.ActivityLogs
            .Include(log => log.User)
            .OrderByDescending(log => log.CreatedAt)
            .Select(log => new
            {
                log.Id,
                UserFullName = log.User != null ? log.User.FullName : null,
                log.Action,
                log.Description,
                log.CreatedAt
            })
            .ToListAsync();

        return Ok(logs);
    }
}