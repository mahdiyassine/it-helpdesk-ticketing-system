namespace HelpDesk.Api.DTOs;

public class UpdateTicketStatusDto
{
    public int StatusId { get; set; }
    public int ChangedByUserId { get; set; }
}