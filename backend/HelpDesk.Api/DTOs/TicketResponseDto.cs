namespace HelpDesk.Api.DTOs;

public class TicketResponseDto
{
    public int Id { get; set; }
    public string TicketReference { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CreatedByUser { get; set; } = string.Empty;
    public string? AssignedToUser { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}