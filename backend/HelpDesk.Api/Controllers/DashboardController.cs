using HelpDesk.Api.Data;
using HelpDesk.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats()
    {
        var totalTickets = await _context.Tickets.CountAsync();

        var openTickets = await _context.Tickets
            .Include(t => t.Status)
            .CountAsync(t => t.Status != null && t.Status.StatusName == "Open");

        var inProgressTickets = await _context.Tickets
            .Include(t => t.Status)
            .CountAsync(t => t.Status != null && t.Status.StatusName == "In Progress");

        var pendingTickets = await _context.Tickets
            .Include(t => t.Status)
            .CountAsync(t => t.Status != null && t.Status.StatusName == "Pending");

        var resolvedTickets = await _context.Tickets
            .Include(t => t.Status)
            .CountAsync(t => t.Status != null && t.Status.StatusName == "Resolved");

        var closedTickets = await _context.Tickets
            .Include(t => t.Status)
            .CountAsync(t => t.Status != null && t.Status.StatusName == "Closed");

        var totalUsers = await _context.Users.CountAsync();
        var totalNotifications = await _context.Notifications.CountAsync();
        var unreadNotifications = await _context.Notifications.CountAsync(n => !n.IsRead);
        var totalAttachments = await _context.TicketAttachments.CountAsync();

        var ticketsByStatus = await _context.Tickets
            .Include(t => t.Status)
            .GroupBy(t => t.Status != null ? t.Status.StatusName : "Unknown")
            .Select(g => new TicketStatusCountDto
            {
                Name = g.Key,
                Count = g.Count()
            })
            .ToListAsync();

        var ticketsByPriority = await _context.Tickets
            .Include(t => t.Priority)
            .GroupBy(t => t.Priority != null ? t.Priority.PriorityName : "Unknown")
            .Select(g => new TicketStatusCountDto
            {
                Name = g.Key,
                Count = g.Count()
            })
            .ToListAsync();

        var stats = new DashboardStatsDto
        {
            TotalTickets = totalTickets,
            OpenTickets = openTickets,
            InProgressTickets = inProgressTickets,
            PendingTickets = pendingTickets,
            ResolvedTickets = resolvedTickets,
            ClosedTickets = closedTickets,
            TotalUsers = totalUsers,
            TotalNotifications = totalNotifications,
            UnreadNotifications = unreadNotifications,
            TotalAttachments = totalAttachments,
            TicketsByStatus = ticketsByStatus,
            TicketsByPriority = ticketsByPriority
        };

        return Ok(stats);
    }
}