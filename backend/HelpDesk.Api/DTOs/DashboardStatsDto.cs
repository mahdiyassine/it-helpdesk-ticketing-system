namespace HelpDesk.Api.DTOs;

public class DashboardStatsDto
{
    public int TotalTickets { get; set; }
    public int OpenTickets { get; set; }
    public int InProgressTickets { get; set; }
    public int PendingTickets { get; set; }
    public int ResolvedTickets { get; set; }
    public int ClosedTickets { get; set; }

    public int TotalUsers { get; set; }
    public int TotalNotifications { get; set; }
    public int UnreadNotifications { get; set; }
    public int TotalAttachments { get; set; }

    public List<TicketStatusCountDto> TicketsByStatus { get; set; } = new();
    public List<TicketStatusCountDto> TicketsByPriority { get; set; } = new();
}