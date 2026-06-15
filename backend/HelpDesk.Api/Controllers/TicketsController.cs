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

        return Ok(MapTicketToResponse(ticket));
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

        _context.ActivityLogs.Add(new ActivityLog
        {
            UserId = request.CreatedByUserId,
            Action = "Ticket Created",
            Description = $"Ticket {ticket.TicketReference} was created."
        });

        await _context.SaveChangesAsync();

        var createdTicket = await _context.Tickets
            .Include(t => t.CreatedByUser)
            .Include(t => t.AssignedToUser)
            .Include(t => t.Category)
            .Include(t => t.Priority)
            .Include(t => t.Status)
            .FirstAsync(t => t.Id == ticket.Id);

        return Ok(MapTicketToResponse(createdTicket));
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

        _context.ActivityLogs.Add(new ActivityLog
        {
            UserId = ticket.CreatedByUserId,
            Action = "Ticket Updated",
            Description = $"Ticket {ticket.TicketReference} was updated."
        });

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

        _context.ActivityLogs.Add(new ActivityLog
        {
            UserId = ticket.CreatedByUserId,
            Action = "Ticket Deleted",
            Description = $"Ticket {ticket.TicketReference} was deleted."
        });

        _context.Tickets.Remove(ticket);
        await _context.SaveChangesAsync();

        return Ok("Ticket deleted successfully.");
    }

    [HttpPut("{id}/assign")]
    public async Task<IActionResult> AssignTicket(int id, AssignTicketDto request)
    {
        var ticket = await _context.Tickets.FindAsync(id);

        if (ticket == null)
        {
            return NotFound("Ticket not found.");
        }

        var assignedToUser = await _context.Users.FindAsync(request.AssignedToUserId);
        var assignedByUser = await _context.Users.FindAsync(request.AssignedByUserId);

        if (assignedToUser == null)
        {
            return BadRequest("Assigned agent does not exist.");
        }

        if (assignedByUser == null)
        {
            return BadRequest("Assigning user does not exist.");
        }

        var oldAssignedUserId = ticket.AssignedToUserId;

        ticket.AssignedToUserId = request.AssignedToUserId;
        ticket.UpdatedAt = DateTime.UtcNow;

        _context.TicketAssignmentHistory.Add(new TicketAssignmentHistory
        {
            TicketId = ticket.Id,
            AssignedFromUserId = oldAssignedUserId,
            AssignedToUserId = request.AssignedToUserId,
            AssignedByUserId = request.AssignedByUserId,
            AssignedAt = DateTime.UtcNow
        });

        _context.ActivityLogs.Add(new ActivityLog
        {
            UserId = request.AssignedByUserId,
            Action = "Ticket Assigned",
            Description = $"Ticket {ticket.TicketReference} was assigned to {assignedToUser.FullName}."
        });

        await _context.SaveChangesAsync();

        return Ok("Ticket assigned successfully.");
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateTicketStatus(int id, UpdateTicketStatusDto request)
    {
        var ticket = await _context.Tickets.FindAsync(id);

        if (ticket == null)
        {
            return NotFound("Ticket not found.");
        }

        var newStatus = await _context.Statuses.FindAsync(request.StatusId);
        var changedByUser = await _context.Users.FindAsync(request.ChangedByUserId);

        if (newStatus == null)
        {
            return BadRequest("Invalid status.");
        }

        if (changedByUser == null)
        {
            return BadRequest("Invalid user.");
        }

        var oldStatusId = ticket.StatusId;

        ticket.StatusId = request.StatusId;
        ticket.UpdatedAt = DateTime.UtcNow;

        if (newStatus.StatusName == "Resolved")
        {
            ticket.ResolvedAt = DateTime.UtcNow;
        }

        if (newStatus.StatusName == "Closed")
        {
            ticket.ClosedAt = DateTime.UtcNow;
        }

        _context.TicketStatusHistory.Add(new TicketStatusHistory
        {
            TicketId = ticket.Id,
            OldStatusId = oldStatusId,
            NewStatusId = request.StatusId,
            ChangedByUserId = request.ChangedByUserId,
            ChangedAt = DateTime.UtcNow
        });

        _context.ActivityLogs.Add(new ActivityLog
        {
            UserId = request.ChangedByUserId,
            Action = "Ticket Status Updated",
            Description = $"Ticket {ticket.TicketReference} status changed to {newStatus.StatusName}."
        });

        await _context.SaveChangesAsync();

        return Ok("Ticket status updated successfully.");
    }

    [HttpPost("{id}/comments")]
    public async Task<IActionResult> AddComment(int id, CreateTicketCommentDto request)
    {
        var ticket = await _context.Tickets.FindAsync(id);
        var user = await _context.Users.FindAsync(request.UserId);

        if (ticket == null)
        {
            return NotFound("Ticket not found.");
        }

        if (user == null)
        {
            return BadRequest("Invalid user.");
        }

        if (string.IsNullOrWhiteSpace(request.CommentText))
        {
            return BadRequest("Comment text is required.");
        }

        var comment = new TicketComment
        {
            TicketId = id,
            UserId = request.UserId,
            CommentText = request.CommentText,
            IsInternal = request.IsInternal,
            CreatedAt = DateTime.UtcNow
        };

        _context.TicketComments.Add(comment);

        _context.ActivityLogs.Add(new ActivityLog
        {
            UserId = request.UserId,
            Action = "Ticket Comment Added",
            Description = $"A comment was added to ticket {ticket.TicketReference}."
        });

        await _context.SaveChangesAsync();

        return Ok("Comment added successfully.");
    }

    [HttpGet("{id}/comments")]
    public async Task<ActionResult<List<TicketCommentResponseDto>>> GetComments(int id)
    {
        var ticketExists = await _context.Tickets.AnyAsync(t => t.Id == id);

        if (!ticketExists)
        {
            return NotFound("Ticket not found.");
        }

        var comments = await _context.TicketComments
            .Include(c => c.User)
            .Where(c => c.TicketId == id)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new TicketCommentResponseDto
            {
                Id = c.Id,
                TicketId = c.TicketId,
                UserFullName = c.User != null ? c.User.FullName : "",
                CommentText = c.CommentText,
                IsInternal = c.IsInternal,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();

        return Ok(comments);
    }

    [HttpGet("{id}/status-history")]
    public async Task<ActionResult<List<TicketStatusHistoryResponseDto>>> GetStatusHistory(int id)
    {
        var ticketExists = await _context.Tickets.AnyAsync(t => t.Id == id);

        if (!ticketExists)
        {
            return NotFound("Ticket not found.");
        }

        var history = await _context.TicketStatusHistory
            .Include(h => h.OldStatus)
            .Include(h => h.NewStatus)
            .Include(h => h.ChangedByUser)
            .Where(h => h.TicketId == id)
            .OrderByDescending(h => h.ChangedAt)
            .Select(h => new TicketStatusHistoryResponseDto
            {
                Id = h.Id,
                TicketId = h.TicketId,
                OldStatus = h.OldStatus != null ? h.OldStatus.StatusName : null,
                NewStatus = h.NewStatus != null ? h.NewStatus.StatusName : "",
                ChangedByUser = h.ChangedByUser != null ? h.ChangedByUser.FullName : "",
                ChangedAt = h.ChangedAt
            })
            .ToListAsync();

        return Ok(history);
    }

    [HttpGet("{id}/assignment-history")]
    public async Task<ActionResult<List<TicketAssignmentHistoryResponseDto>>> GetAssignmentHistory(int id)
    {
        var ticketExists = await _context.Tickets.AnyAsync(t => t.Id == id);

        if (!ticketExists)
        {
            return NotFound("Ticket not found.");
        }

        var history = await _context.TicketAssignmentHistory
            .Include(h => h.AssignedFromUser)
            .Include(h => h.AssignedToUser)
            .Include(h => h.AssignedByUser)
            .Where(h => h.TicketId == id)
            .OrderByDescending(h => h.AssignedAt)
            .Select(h => new TicketAssignmentHistoryResponseDto
            {
                Id = h.Id,
                TicketId = h.TicketId,
                AssignedFromUser = h.AssignedFromUser != null ? h.AssignedFromUser.FullName : null,
                AssignedToUser = h.AssignedToUser != null ? h.AssignedToUser.FullName : "",
                AssignedByUser = h.AssignedByUser != null ? h.AssignedByUser.FullName : "",
                AssignedAt = h.AssignedAt
            })
            .ToListAsync();

        return Ok(history);
    }

    private TicketResponseDto MapTicketToResponse(Ticket ticket)
    {
        return new TicketResponseDto
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
    }

    private string GenerateTicketReference()
    {
        return $"TK-{DateTime.UtcNow:yyyyMMddHHmmss}";
    }
}