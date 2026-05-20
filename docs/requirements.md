# Requirements Document

## Project Title

IT Help Desk & Ticketing Management System

## Project Scope

The system is a web-based IT Help Desk and Ticketing Management System. It allows employees to submit support tickets, while IT support agents, administrators, and managers can manage, prioritize, assign, monitor, and resolve tickets through a centralized dashboard.

## System Users

### Admin

The Admin has full system access.

Admin can:
- Manage users
- Manage roles
- Manage ticket categories
- Manage ticket priorities
- View all tickets
- Assign and reassign tickets
- View reports
- View activity logs
- Manage system settings

### IT Support Agent

The IT Support Agent handles assigned tickets.

IT Support Agent can:
- View assigned tickets
- Update ticket status
- Add comments
- Add internal notes
- Resolve tickets
- View ticket history
- Receive ticket notifications

### Employee

The Employee creates and tracks support requests.

Employee can:
- Register and log in
- Create support tickets
- View own tickets
- Track ticket status
- Add comments
- Upload attachments
- Receive notifications

### Manager

The Manager monitors team tickets and reports.

Manager can:
- View team tickets
- Monitor ticket progress
- View dashboard statistics
- View reports

## Main Functional Requirements

### Authentication and User Management

- Users can register and log in.
- Passwords must be encrypted.
- The system uses JWT authentication.
- The system supports role-based access control.
- Users can manage their profiles.
- The system supports forgot/reset password.
- User activity is logged.

### Ticket Management

- Employees can create support tickets.
- Tickets have a title, description, category, priority, and status.
- The system generates a unique ticket reference number.
- Users can search and filter tickets.
- Authorized users can update ticket details.
- The system tracks ticket history.

### Ticket Assignment and Workflow

- Admins can assign tickets to support agents.
- Tickets can be reassigned.
- Assignment history is stored.
- Ticket status changes are tracked.
- The system supports escalation workflow.

### Communication and Notifications

- Users can comment on tickets.
- Agents and admins can add internal notes.
- The system sends in-app notifications for ticket updates.
- Email notifications may be added later.

### Dashboard and Reporting

- The dashboard shows open tickets.
- The dashboard shows resolved tickets.
- The dashboard shows pending tickets.
- Reports show tickets by category and priority.
- Reports show agent performance.
- Reports may be exported to PDF or Excel.

### File Attachments

- Users can upload screenshots or documents.
- The system validates file size.
- The system validates supported file types.
- Attachments are linked to tickets.

### Optional AI Features

- AI can suggest ticket category.
- AI can suggest ticket priority.
- AI can suggest replies for support agents.
- AI chat assistant can help employees before creating tickets.

## Non-Functional Requirements

- The interface should be responsive and mobile-friendly.
- The system should have protected API routes.
- The system should validate all required fields.
- The system should show loading and error states.
- The database should be relational and normalized.
- The system should be secure and scalable.
