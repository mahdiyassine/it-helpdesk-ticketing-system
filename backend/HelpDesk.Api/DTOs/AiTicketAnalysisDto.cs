namespace HelpDesk.Api.DTOs;

public class AiTicketAnalysisDto
{
    public string SuggestedCategory { get; set; } = string.Empty;
    public string SuggestedPriority { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public List<string> TroubleshootingSuggestions { get; set; } = new();
}