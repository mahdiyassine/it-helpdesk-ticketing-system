namespace HelpDesk.Api.DTOs;

public class AssignTicketDto
{
    public int AssignedToUserId { get; set; }
    public int AssignedByUserId { get; set; }
}