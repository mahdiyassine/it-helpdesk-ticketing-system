using HelpDesk.Api.Data;
using HelpDesk.Api.DTOs;
using HelpDesk.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TicketAttachmentsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public TicketAttachmentsController(AppDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    [HttpPost("ticket/{ticketId}/upload")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadAttachment(
        int ticketId,
        [FromForm] UploadTicketAttachmentDto request)
    {
        var uploadedByUserId = request.UploadedByUserId;
        var file = request.File;

        var ticket = await _context.Tickets.FindAsync(ticketId);

        if (ticket == null)
        {
            return NotFound("Ticket not found.");
        }

        var userExists = await _context.Users.AnyAsync(u => u.Id == uploadedByUserId);

        if (!userExists)
        {
            return BadRequest("Invalid user.");
        }

        if (file == null || file.Length == 0)
        {
            return BadRequest("File is required.");
        }

        var allowedContentTypes = new[]
        {
            "image/png",
            "image/jpeg",
            "image/jpg",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        };

        if (!allowedContentTypes.Contains(file.ContentType))
        {
            return BadRequest("Only PNG, JPG, PDF, DOC, and DOCX files are allowed.");
        }

        var uploadsFolder = Path.Combine(_environment.ContentRootPath, "Uploads");

        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var attachment = new TicketAttachment
        {
            TicketId = ticketId,
            UploadedByUserId = uploadedByUserId,
            FileName = file.FileName,
            FilePath = filePath,
            ContentType = file.ContentType,
            FileSize = file.Length,
            UploadedAt = DateTime.UtcNow
        };

        _context.TicketAttachments.Add(attachment);

        _context.ActivityLogs.Add(new ActivityLog
        {
            UserId = uploadedByUserId,
            Action = "File Uploaded",
            Description = $"File {file.FileName} was uploaded to ticket {ticket.TicketReference}."
        });

        _context.Notifications.Add(new Notification
        {
            UserId = ticket.CreatedByUserId,
            Title = "New File Uploaded",
            Message = $"A new file was uploaded to your ticket {ticket.TicketReference}.",
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();

        return Ok("File uploaded successfully.");
    }

    [HttpGet("ticket/{ticketId}")]
    public async Task<ActionResult<List<TicketAttachmentResponseDto>>> GetTicketAttachments(int ticketId)
    {
        var ticketExists = await _context.Tickets.AnyAsync(t => t.Id == ticketId);

        if (!ticketExists)
        {
            return NotFound("Ticket not found.");
        }

        var attachments = await _context.TicketAttachments
            .Include(a => a.UploadedByUser)
            .Where(a => a.TicketId == ticketId)
            .OrderByDescending(a => a.UploadedAt)
            .Select(a => new TicketAttachmentResponseDto
            {
                Id = a.Id,
                TicketId = a.TicketId,
                FileName = a.FileName,
                ContentType = a.ContentType,
                FileSize = a.FileSize,
                UploadedByUser = a.UploadedByUser != null ? a.UploadedByUser.FullName : "",
                UploadedAt = a.UploadedAt
            })
            .ToListAsync();

        return Ok(attachments);
    }

    [HttpGet("{id}/download")]
    public async Task<IActionResult> DownloadAttachment(int id)
    {
        var attachment = await _context.TicketAttachments.FindAsync(id);

        if (attachment == null)
        {
            return NotFound("Attachment not found.");
        }

        if (!System.IO.File.Exists(attachment.FilePath))
        {
            return NotFound("File not found on server.");
        }

        var fileBytes = await System.IO.File.ReadAllBytesAsync(attachment.FilePath);

        return File(fileBytes, attachment.ContentType, attachment.FileName);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAttachment(int id)
    {
        var attachment = await _context.TicketAttachments.FindAsync(id);

        if (attachment == null)
        {
            return NotFound("Attachment not found.");
        }

        if (System.IO.File.Exists(attachment.FilePath))
        {
            System.IO.File.Delete(attachment.FilePath);
        }

        _context.TicketAttachments.Remove(attachment);

        await _context.SaveChangesAsync();

        return Ok("Attachment deleted successfully.");
    }
}