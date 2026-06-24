using HelpDesk.Api.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace HelpDesk.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AiController : ControllerBase
{
    [HttpPost("analyze-ticket")]
    public ActionResult<AiTicketAnalysisDto> AnalyzeTicket(AiTicketRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Title) ||
            string.IsNullOrWhiteSpace(request.Description))
        {
            return BadRequest("Title and description are required.");
        }

        var text = $"{request.Title} {request.Description}".ToLower();

        var suggestedCategory = DetectCategory(text);
        var suggestedPriority = DetectPriority(text);
        var summary = GenerateSummary(request.Title, request.Description);
        var suggestions = GenerateTroubleshootingSuggestions(text, suggestedCategory);

        var result = new AiTicketAnalysisDto
        {
            SuggestedCategory = suggestedCategory,
            SuggestedPriority = suggestedPriority,
            Summary = summary,
            TroubleshootingSuggestions = suggestions
        };

        return Ok(result);
    }

    [HttpPost("chat")]
    public ActionResult<object> Chat(AiChatRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Question))
        {
            return BadRequest("Question is required.");
        }

        var question = request.Question.ToLower();
        string answer;

        if (question.Contains("reset") && question.Contains("password"))
        {
            answer = "To reset a password, confirm the employee identity, reset the password from the admin system, and ask the user to log in again.";
        }
        else if (question.Contains("printer"))
        {
            answer = "For printer issues, check power, paper, network connection, printer queue, and reinstall the printer driver if needed.";
        }
        else if (question.Contains("internet") || question.Contains("network") || question.Contains("wifi"))
        {
            answer = "For network issues, check Wi-Fi connection, restart the router if allowed, verify IP settings, and escalate if multiple users are affected.";
        }
        else if (question.Contains("email") || question.Contains("outlook"))
        {
            answer = "For email issues, check login credentials, mailbox storage, spam settings, internet connection, and Outlook sync status.";
        }
        else if (question.Contains("priority"))
        {
            answer = "Critical priority is used for urgent issues affecting many users or stopping business work. High is used for important issues affecting one user or team.";
        }
        else
        {
            answer = "I can help with common IT support issues such as password reset, printer problems, network issues, email problems, and ticket priority guidance.";
        }

        return Ok(new
        {
            Question = request.Question,
            Answer = answer
        });
    }

    private string DetectCategory(string text)
    {
        if (text.Contains("printer") || text.Contains("laptop") || text.Contains("keyboard") ||
            text.Contains("mouse") || text.Contains("screen") || text.Contains("monitor"))
        {
            return "Hardware";
        }

        if (text.Contains("software") || text.Contains("app") || text.Contains("program") ||
            text.Contains("install") || text.Contains("crash"))
        {
            return "Software";
        }

        if (text.Contains("wifi") || text.Contains("internet") || text.Contains("network") ||
            text.Contains("connection") || text.Contains("router"))
        {
            return "Network";
        }

        if (text.Contains("email") || text.Contains("outlook") || text.Contains("mailbox") ||
            text.Contains("send email") || text.Contains("receive email"))
        {
            return "Email";
        }

        if (text.Contains("access") || text.Contains("permission") || text.Contains("account") ||
            text.Contains("login") || text.Contains("password"))
        {
            return "Access Request";
        }

        return "Other";
    }

    private string DetectPriority(string text)
    {
        if (text.Contains("urgent") || text.Contains("critical") || text.Contains("server down") ||
            text.Contains("all users") || text.Contains("cannot work") || text.Contains("system down"))
        {
            return "Critical";
        }

        if (text.Contains("important") || text.Contains("manager") || text.Contains("deadline") ||
            text.Contains("blocked") || text.Contains("not working"))
        {
            return "High";
        }

        if (text.Contains("slow") || text.Contains("issue") || text.Contains("problem") ||
            text.Contains("sometimes"))
        {
            return "Medium";
        }

        return "Low";
    }

    private string GenerateSummary(string title, string description)
    {
        if (description.Length > 120)
        {
            description = description.Substring(0, 120) + "...";
        }

        return $"Ticket summary: {title}. Main issue: {description}";
    }

    private List<string> GenerateTroubleshootingSuggestions(string text, string category)
    {
        if (category == "Hardware")
        {
            return new List<string>
            {
                "Check if the device is powered on and properly connected.",
                "Restart the device and test again.",
                "Check cables, ports, and drivers.",
                "Escalate to IT support if hardware replacement is needed."
            };
        }

        if (category == "Software")
        {
            return new List<string>
            {
                "Restart the application.",
                "Check if the software is updated.",
                "Reinstall or repair the application if the issue continues.",
                "Check logs or error messages before escalation."
            };
        }

        if (category == "Network")
        {
            return new List<string>
            {
                "Check Wi-Fi or Ethernet connection.",
                "Test if other users are affected.",
                "Restart the connection or network adapter.",
                "Escalate if the issue affects multiple users."
            };
        }

        if (category == "Email")
        {
            return new List<string>
            {
                "Check email login credentials.",
                "Check mailbox storage and spam folder.",
                "Confirm internet connection.",
                "Restart Outlook or email client."
            };
        }

        if (category == "Access Request")
        {
            return new List<string>
            {
                "Verify the user identity.",
                "Confirm the required permission or system access.",
                "Get manager approval if required.",
                "Update access rights from the admin panel."
            };
        }

        return new List<string>
        {
            "Collect more details from the user.",
            "Check recent changes related to the issue.",
            "Try basic troubleshooting steps.",
            "Escalate if the issue cannot be solved."
        };
    }
}