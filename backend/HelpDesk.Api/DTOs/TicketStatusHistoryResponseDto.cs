namespace HelpDesk.Api.DTOs;

public class TicketStatusHistoryResponseDto
{
    public int Id { get; set; }
    public int TicketId { get; set; }
    public string? OldStatus { get; set; }
    public string NewStatus { get; set; } = string.Empty;
    public string ChangedByUser { get; set; } = string.Empty;
    public DateTime ChangedAt { get; set; }
}