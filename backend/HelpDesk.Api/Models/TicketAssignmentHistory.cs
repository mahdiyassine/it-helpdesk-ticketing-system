namespace HelpDesk.Api.Models;

public class TicketAssignmentHistory
{
    public int Id { get; set; }

    public int TicketId { get; set; }
    public int? AssignedFromUserId { get; set; }
    public int AssignedToUserId { get; set; }
    public int AssignedByUserId { get; set; }

    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

    public Ticket? Ticket { get; set; }
    public User? AssignedFromUser { get; set; }
    public User? AssignedToUser { get; set; }
    public User? AssignedByUser { get; set; }
}