# System Workflows

## Workflow 1: Employee Creates a Ticket

1. Employee logs in.
2. Employee opens the dashboard.
3. Employee clicks "Create Ticket".
4. Employee enters the ticket title, description, category, priority, and optional attachment.
5. Employee submits the ticket.
6. The system validates the required fields.
7. The system generates a unique ticket reference number.
8. The system stores the ticket in the database.
9. The ticket status becomes "Open".
10. The employee can track the ticket from the ticket list.

## Workflow 2: Admin Assigns a Ticket

1. Admin logs in.
2. Admin opens the ticket management dashboard.
3. Admin views all open tickets.
4. Admin filters tickets by category, priority, or status.
5. Admin selects a ticket.
6. Admin assigns the ticket to an IT support agent.
7. The system updates the assigned agent.
8. The system stores the assignment history.
9. The assigned agent receives a notification.

## Workflow 3: IT Support Agent Resolves a Ticket

1. IT Support Agent logs in.
2. Agent views assigned tickets.
3. Agent opens the ticket details page.
4. Agent reviews the issue description and attachments.
5. Agent changes the status to "In Progress".
6. Agent adds a comment or internal note.
7. Agent provides a solution.
8. Agent changes the status to "Resolved".
9. The system updates the ticket history.
10. The employee receives a notification.

## Workflow 4: Ticket Comment and Notification

1. User opens a ticket.
2. User writes a comment.
3. The system stores the comment.
4. The system creates a notification for related users.
5. Related users view the update in the notification center.

## Workflow 5: Report Generation

1. Admin or Manager logs in.
2. User opens the reports page.
3. User selects report filters.
4. The system retrieves ticket data.
5. The system displays charts and statistics.
6. User exports the report to PDF or Excel if needed.
