using System.Text;
using HelpDesk.Api.Data;
using HelpDesk.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReportsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("tickets")]
    public async Task<ActionResult<List<ReportTicketDto>>> GetTicketReport()
    {
        var tickets = await _context.Tickets
            .Include(t => t.Category)
            .Include(t => t.Priority)
            .Include(t => t.Status)
            .Include(t => t.CreatedByUser)
            .Include(t => t.AssignedToUser)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new ReportTicketDto
            {
                Id = t.Id,
                TicketReference = t.TicketReference,
                Title = t.Title,
                Category = t.Category != null ? t.Category.CategoryName : "",
                Priority = t.Priority != null ? t.Priority.PriorityName : "",
                Status = t.Status != null ? t.Status.StatusName : "",
                CreatedByUser = t.CreatedByUser != null ? t.CreatedByUser.FullName : "",
                AssignedToUser = t.AssignedToUser != null ? t.AssignedToUser.FullName : null,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync();

        return Ok(tickets);
    }

    [HttpGet("tickets/export-csv")]
    public async Task<IActionResult> ExportTicketsCsv()
    {
        var tickets = await _context.Tickets
            .Include(t => t.Category)
            .Include(t => t.Priority)
            .Include(t => t.Status)
            .Include(t => t.CreatedByUser)
            .Include(t => t.AssignedToUser)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

        var csv = new StringBuilder();

        csv.AppendLine("Id,TicketReference,Title,Category,Priority,Status,CreatedByUser,AssignedToUser,CreatedAt");

        foreach (var ticket in tickets)
        {
            var row = string.Join(",",
                ticket.Id,
                EscapeCsv(ticket.TicketReference),
                EscapeCsv(ticket.Title),
                EscapeCsv(ticket.Category?.CategoryName ?? ""),
                EscapeCsv(ticket.Priority?.PriorityName ?? ""),
                EscapeCsv(ticket.Status?.StatusName ?? ""),
                EscapeCsv(ticket.CreatedByUser?.FullName ?? ""),
                EscapeCsv(ticket.AssignedToUser?.FullName ?? "Unassigned"),
                ticket.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss")
            );

            csv.AppendLine(row);
        }

        var bytes = Encoding.UTF8.GetBytes(csv.ToString());

        return File(bytes, "text/csv", "tickets-report.csv");
    }

    private string EscapeCsv(string value)
    {
        if (value.Contains(",") || value.Contains("\"") || value.Contains("\n"))
        {
            value = value.Replace("\"", "\"\"");
            return $"\"{value}\"";
        }

        return value;
    }
}