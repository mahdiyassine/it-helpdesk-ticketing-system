namespace HelpDesk.Api.DTOs;

public class TicketCommentResponseDto
{
    public int Id { get; set; }
    public int TicketId { get; set; }
    public string UserFullName { get; set; } = string.Empty;
    public string CommentText { get; set; } = string.Empty;
    public bool IsInternal { get; set; }
    public DateTime CreatedAt { get; set; }
}