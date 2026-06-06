namespace HelpDesk.Api.Models;

public class Ticket
{
    public int Id { get; set; }
    public string TicketReference { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public int CreatedByUserId { get; set; }
    public int? AssignedToUserId { get; set; }

    public int CategoryId { get; set; }
    public int PriorityId { get; set; }
    public int StatusId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ResolvedAt { get; set; }
    public DateTime? ClosedAt { get; set; }

    public User? CreatedByUser { get; set; }
    public User? AssignedToUser { get; set; }
    public Category? Category { get; set; }
    public Priority? Priority { get; set; }
    public Status? Status { get; set; }
}