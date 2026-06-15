namespace HelpDesk.Api.DTOs;

public class TicketAssignmentHistoryResponseDto
{
    public int Id { get; set; }
    public int TicketId { get; set; }
    public string? AssignedFromUser { get; set; }
    public string AssignedToUser { get; set; } = string.Empty;
    public string AssignedByUser { get; set; } = string.Empty;
    public DateTime AssignedAt { get; set; }
}