namespace HelpDesk.Api.DTOs;

public class TicketAttachmentResponseDto
{
    public int Id { get; set; }

    public int TicketId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;

    public long FileSize { get; set; }

    public string UploadedByUser { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }
}