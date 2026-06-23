namespace HelpDesk.Api.DTOs;

public class UploadTicketAttachmentDto
{
    public int UploadedByUserId { get; set; }
    public IFormFile? File { get; set; }
}