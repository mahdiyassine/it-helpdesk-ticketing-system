namespace HelpDesk.Api.DTOs;

public class CreateTicketCommentDto
{
    public int UserId { get; set; }
    public string CommentText { get; set; } = string.Empty;
    public bool IsInternal { get; set; } = false;
}