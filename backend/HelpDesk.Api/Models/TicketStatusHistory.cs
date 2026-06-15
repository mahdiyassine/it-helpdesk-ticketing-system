namespace HelpDesk.Api.Models;

public class TicketStatusHistory
{
    public int Id { get; set; }

    public int TicketId { get; set; }
    public int? OldStatusId { get; set; }
    public int NewStatusId { get; set; }
    public int ChangedByUserId { get; set; }

    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

    public Ticket? Ticket { get; set; }
    public Status? OldStatus { get; set; }
    public Status? NewStatus { get; set; }
    public User? ChangedByUser { get; set; }
}