using HelpDesk.Api.Data;
using HelpDesk.Api.DTOs;
using HelpDesk.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TicketsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TicketsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<TicketResponseDto>>> GetTickets()
    {
        var tickets = await _context.Tickets
            .Include(t => t.CreatedByUser)
            .Include(t => t.AssignedToUser)
            .Include(t => t.Category)
            .Include(t => t.Priority)
            .Include(t => t.Status)
            .Select(t => new TicketResponseDto
            {
                Id = t.Id,
                TicketReference = t.TicketReference,
                Title = t.Title,
                Description = t.Description,
                CreatedByUser = t.CreatedByUser != null ? t.CreatedByUser.FullName : "",
                AssignedToUser = t.AssignedToUser != null ? t.AssignedToUser.FullName : null,
                Category = t.Category != null ? t.Category.CategoryName : "",
                Priority = t.Priority != null ? t.Priority.PriorityName : "",
                Status = t.Status != null ? t.Status.StatusName : "",
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt
            })
            .ToListAsync();

        return Ok(tickets);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TicketResponseDto>> GetTicketById(int id)
    {
        var ticket = await _context.Tickets
            .Include(t => t.CreatedByUser)
            .Include(t => t.AssignedToUser)
            .Include(t => t.Category)
            .Include(t => t.Priority)
            .Include(t => t.Status)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (ticket == null)
        {
            return NotFound("Ticket not found.");
        }

        var response = new TicketResponseDto
        {
            Id = ticket.Id,
            TicketReference = ticket.TicketReference,
            Title = ticket.Title,
            Description = ticket.Description,
            CreatedByUser = ticket.CreatedByUser != null ? ticket.CreatedByUser.FullName : "",
            AssignedToUser = ticket.AssignedToUser != null ? ticket.AssignedToUser.FullName : null,
            Category = ticket.Category != null ? ticket.Category.CategoryName : "",
            Priority = ticket.Priority != null ? ticket.Priority.PriorityName : "",
            Status = ticket.Status != null ? ticket.Status.StatusName : "",
            CreatedAt = ticket.CreatedAt,
            UpdatedAt = ticket.UpdatedAt
        };

        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<TicketResponseDto>> CreateTicket(CreateTicketDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Title) ||
            string.IsNullOrWhiteSpace(request.Description))
        {
            return BadRequest("Title and description are required.");
        }

        var userExists = await _context.Users.AnyAsync(u => u.Id == request.CreatedByUserId);
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
        var priorityExists = await _context.Priorities.AnyAsync(p => p.Id == request.PriorityId);

        if (!userExists)
        {
            return BadRequest("Invalid user.");
        }

        if (!categoryExists)
        {
            return BadRequest("Invalid category.");
        }

        if (!priorityExists)
        {
            return BadRequest("Invalid priority.");
        }

        var ticket = new Ticket
        {
            TicketReference = GenerateTicketReference(),
            Title = request.Title,
            Description = request.Description,
            CreatedByUserId = request.CreatedByUserId,
            CategoryId = request.CategoryId,
            PriorityId = request.PriorityId,
            StatusId = 1,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Tickets.Add(ticket);
        await _context.SaveChangesAsync();

        return await GetTicketById(ticket.Id);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTicket(int id, UpdateTicketDto request)
    {
        var ticket = await _context.Tickets.FindAsync(id);

        if (ticket == null)
        {
            return NotFound("Ticket not found.");
        }

        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
        var priorityExists = await _context.Priorities.AnyAsync(p => p.Id == request.PriorityId);
        var statusExists = await _context.Statuses.AnyAsync(s => s.Id == request.StatusId);

        if (!categoryExists)
        {
            return BadRequest("Invalid category.");
        }

        if (!priorityExists)
        {
            return BadRequest("Invalid priority.");
        }

        if (!statusExists)
        {
            return BadRequest("Invalid status.");
        }

        if (request.AssignedToUserId != null)
        {
            var assignedUserExists = await _context.Users.AnyAsync(u => u.Id == request.AssignedToUserId);

            if (!assignedUserExists)
            {
                return BadRequest("Invalid assigned user.");
            }
        }

        ticket.Title = request.Title;
        ticket.Description = request.Description;
        ticket.CategoryId = request.CategoryId;
        ticket.PriorityId = request.PriorityId;
        ticket.StatusId = request.StatusId;
        ticket.AssignedToUserId = request.AssignedToUserId;
        ticket.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok("Ticket updated successfully.");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTicket(int id)
    {
        var ticket = await _context.Tickets.FindAsync(id);

        if (ticket == null)
        {
            return NotFound("Ticket not found.");
        }

        _context.Tickets.Remove(ticket);
        await _context.SaveChangesAsync();

        return Ok("Ticket deleted successfully.");
    }

    private string GenerateTicketReference()
    {
        return $"TK-{DateTime.UtcNow:yyyyMMddHHmmss}";
    }
}