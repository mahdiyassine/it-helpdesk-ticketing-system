# IT Help Desk & Ticketing Management System

This project is a full-stack IT Help Desk and Ticketing Management System developed as part of the IDS Academy internship program.

The system allows employees to submit support tickets, IT support agents to manage and resolve tickets, and administrators to monitor activity, assign tickets, view reports, upload attachments, and use AI-assisted support features.

## Student Information

**Student:** Mahdi Yassine
**Organization:** IDS Academy
**Project:** IT Help Desk & Ticketing Management System
**Repository:** https://github.com/mahdiyassine/it-helpdesk-ticketing-system

## Project Overview

The goal of this project is to build an internal help desk platform that improves communication between employees and the IT support team.

The system supports:

* User authentication
* Role-based access
* Ticket creation and management
* Ticket assignment workflow
* Ticket comments and internal notes
* Ticket status tracking
* Ticket history and audit trail
* Notifications
* File attachments
* Dashboard analytics
* Reports and exporting
* AI-assisted ticket analysis
* AI chatbot assistant

## Technologies Used

### Frontend

* React
* Vite
* JavaScript
* CSS
* Axios
* Recharts

### Backend

* ASP.NET Core Web API
* Entity Framework Core
* JWT Authentication
* BCrypt password hashing
* Swagger / OpenAPI

### Database

* PostgreSQL

### Development Tools

* Visual Studio Code
* Git
* GitHub
* Postman / Swagger
* macOS terminal

## User Roles

The system supports the following user roles:

* Admin
* IT Support Agent
* Employee
* Manager

Public user registration is not available. User accounts are created by the system administrator.

## Main Features

### Authentication & User Management

* Login using email and password
* JWT token generation
* Role-based user structure
* Admin-created accounts
* User listing for assignment

### Ticket Management

* Create tickets
* View all tickets
* View ticket details
* Edit tickets
* Delete tickets
* Assign categories
* Assign priorities
* Track ticket status

### Ticket Workflow

* Assign tickets to users
* Update ticket status
* Track assignment history
* Track status history
* Add comments
* Add internal notes
* View full ticket workflow

### Activity Logs

* Track important system actions
* Log ticket creation
* Log ticket updates
* Log ticket assignment
* Log status changes
* Log comments
* Log file uploads
* Log notification creation

### Notifications

* Create notifications
* View notifications
* Mark notification as read
* Mark all notifications as read
* Show unread notification count on dashboard

### File Attachments

* Upload ticket screenshots and documents
* Support PNG, JPG, PDF, DOC, and DOCX files
* View uploaded attachments
* Download uploaded files
* Track uploads in activity logs

### Dashboard Analytics

* Total tickets
* Open tickets
* In progress tickets
* Resolved tickets
* Unassigned tickets
* Total users
* Total notifications
* Unread notifications
* Total attachments
* Tickets by status chart
* Tickets by priority chart

### Reports & Exporting

* Ticket report table
* CSV / Excel export
* PDF export using browser print
* Report summary cards

### AI Features

The project includes local rule-based AI features without requiring a paid external API key.

AI features include:

* AI ticket categorization
* AI priority recommendation
* AI-generated ticket summary
* AI troubleshooting suggestions
* AI chatbot assistant for common IT support questions

## Project Structure

```text
it-helpdesk-ticketing-system
├── backend
│   └── HelpDesk.Api
│       ├── Controllers
│       ├── Data
│       ├── DTOs
│       ├── Migrations
│       ├── Models
│       ├── Services
│       ├── Uploads
│       ├── Program.cs
│       └── appsettings.json
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── App.jsx
│   │   ├── ReportsAiPanel.jsx
│   │   ├── main.jsx
│   │   └── style.css
│   ├── package.json
│   └── vite.config.js
├── docs
│   ├── requirements.md
│   ├── workflows.md
│   ├── database-schema.sql
│   └── screenshots
├── diagrams
│   └── erd.png
├── wireframes
└── README.md
```

## Database Tables

The project database includes the following main tables:

* Users
* Roles
* UserRoles
* Tickets
* Categories
* Priorities
* Statuses
* TicketComments
* TicketAttachments
* TicketStatusHistory
* TicketAssignmentHistory
* ActivityLogs
* Notifications

## API Endpoints

### Authentication

* `POST /api/Auth/login`
* `POST /api/Auth/register`

### Users

* `GET /api/Users`
* `GET /api/Users/agents`

### Roles

* `GET /api/Roles`

### Tickets

* `GET /api/Tickets`
* `GET /api/Tickets/{id}`
* `POST /api/Tickets`
* `PUT /api/Tickets/{id}`
* `DELETE /api/Tickets/{id}`

### Ticket Workflow

* `PUT /api/Tickets/{id}/assign`
* `PUT /api/Tickets/{id}/status`

### Ticket Comments

* `POST /api/Tickets/{id}/comments`
* `GET /api/Tickets/{id}/comments`

### Ticket History

* `GET /api/Tickets/{id}/status-history`
* `GET /api/Tickets/{id}/assignment-history`

### Categories

* `GET /api/Categories`

### Priorities

* `GET /api/Priorities`

### Statuses

* `GET /api/Statuses`

### Activity Logs

* `GET /api/ActivityLogs`

### Notifications

* `GET /api/Notifications`
* `GET /api/Notifications/user/{userId}`
* `POST /api/Notifications`
* `PUT /api/Notifications/{id}/read`
* `PUT /api/Notifications/user/{userId}/read-all`

### Ticket Attachments

* `POST /api/TicketAttachments/ticket/{ticketId}/upload`
* `GET /api/TicketAttachments/ticket/{ticketId}`
* `GET /api/TicketAttachments/{id}/download`
* `DELETE /api/TicketAttachments/{id}`

### Dashboard

* `GET /api/Dashboard/stats`

### Reports

* `GET /api/Reports/tickets`
* `GET /api/Reports/tickets/export-csv`

### AI

* `POST /api/Ai/analyze-ticket`
* `POST /api/Ai/chat`

## Weekly Progress

## Week 1 Progress

Week 1 focused on project planning, requirements, workflows, wireframes, database design, and ERD creation.

### Completed Tasks

* Defined project scope
* Created requirements document
* Created workflows document
* Created UI wireframes
* Designed database schema
* Created ERD diagram
* Created GitHub repository
* Organized project folders

### Deliverables

* `docs/requirements.md`
* `docs/workflows.md`
* `docs/database-schema.sql`
* `diagrams/erd.png`
* `wireframes/`

## Week 2 Progress

Week 2 focused on project setup, backend setup, frontend setup, authentication, and role-based access foundation.

### Completed Tasks

* Created ASP.NET Core Web API backend
* Created React Vite frontend
* Connected backend to PostgreSQL
* Set up Entity Framework Core
* Created User and Role models
* Created authentication DTOs
* Created JWT service
* Implemented login endpoint
* Implemented registration endpoint for admin usage
* Added Swagger support
* Added role structure
* Removed public registration from frontend flow
* Created initial login page and dashboard page

### Week 2 API Endpoints

* `POST /api/Auth/login`
* `POST /api/Auth/register`
* `GET /api/Roles`

## Week 3 Progress

Week 3 focused on ticket CRUD operations, categories, priorities, statuses, and connecting the React frontend to the ticket APIs.

### Completed Tasks

* Created Category model
* Created Priority model
* Created Status model
* Created Ticket model
* Updated database context
* Added database migration for ticket management
* Seeded categories
* Seeded priorities
* Seeded statuses
* Created ticket DTOs
* Implemented ticket CRUD endpoints
* Implemented categories endpoint
* Implemented priorities endpoint
* Implemented statuses endpoint
* Connected React frontend to ticket APIs
* Added create ticket form
* Added edit ticket form
* Added ticket list
* Added dashboard ticket counters

### Week 3 API Endpoints

* `GET /api/Tickets`
* `GET /api/Tickets/{id}`
* `POST /api/Tickets`
* `PUT /api/Tickets/{id}`
* `DELETE /api/Tickets/{id}`
* `GET /api/Categories`
* `GET /api/Priorities`
* `GET /api/Statuses`

## Week 4 Progress

Week 4 focused on ticket workflow, ticket assignment, comments, history tracking, and activity logs.

### Completed Tasks

* Created TicketComment model
* Created ActivityLog model
* Created TicketStatusHistory model
* Created TicketAssignmentHistory model
* Updated Entity Framework database context
* Added database migration for workflow and history tables
* Implemented ticket assignment endpoint
* Implemented ticket status update endpoint
* Implemented ticket comments endpoints
* Implemented ticket status history endpoint
* Implemented ticket assignment history endpoint
* Implemented activity logs endpoint
* Added users endpoint for assignment dropdown
* Connected React frontend with workflow APIs
* Added ticket assignment UI
* Added ticket status update UI
* Added ticket comments UI
* Added ticket history display
* Added activity logs display

### Week 4 API Endpoints

#### Ticket Workflow

* `PUT /api/Tickets/{id}/assign`
* `PUT /api/Tickets/{id}/status`

#### Ticket Comments

* `POST /api/Tickets/{id}/comments`
* `GET /api/Tickets/{id}/comments`

#### Ticket History

* `GET /api/Tickets/{id}/status-history`
* `GET /api/Tickets/{id}/assignment-history`

#### Activity Logs

* `GET /api/ActivityLogs`

#### Users

* `GET /api/Users`
* `GET /api/Users/agents`

## Week 5 Progress

Week 5 focused on dashboard analytics, notifications, and ticket file attachments.

### Completed Tasks

* Created Notification model
* Created TicketAttachment model
* Updated database context
* Added migration for notifications and attachments
* Implemented dashboard analytics endpoint
* Implemented notification center endpoints
* Implemented ticket file upload endpoint
* Implemented attachment listing and download endpoints
* Added KPI cards to React dashboard
* Added charts using Recharts
* Added notification center to frontend
* Added file upload section to ticket workflow
* Added attachment list and download button
* Updated activity logs for notification and upload actions
* Improved dashboard UI

### Week 5 API Endpoints

#### Dashboard

* `GET /api/Dashboard/stats`

#### Notifications

* `GET /api/Notifications`
* `GET /api/Notifications/user/{userId}`
* `POST /api/Notifications`
* `PUT /api/Notifications/{id}/read`
* `PUT /api/Notifications/user/{userId}/read-all`

#### Ticket Attachments

* `POST /api/TicketAttachments/ticket/{ticketId}/upload`
* `GET /api/TicketAttachments/ticket/{ticketId}`
* `GET /api/TicketAttachments/{id}/download`
* `DELETE /api/TicketAttachments/{id}`

## Week 6 Progress

Week 6 focused on reports, exporting, and optional AI integration.

### Completed Tasks

* Created reports API endpoint
* Added ticket report table
* Added CSV / Excel export
* Added PDF export using browser print
* Added AI ticket categorization
* Added AI priority recommendation
* Added AI-generated ticket summary
* Added AI troubleshooting suggestions
* Added AI chatbot assistant
* Connected reports and AI features to the React frontend
* Added improved reports UI
* Added AI analysis UI
* Added AI chatbot assistant UI

### Week 6 API Endpoints

#### Reports

* `GET /api/Reports/tickets`
* `GET /api/Reports/tickets/export-csv`

#### AI

* `POST /api/Ai/analyze-ticket`
* `POST /api/Ai/chat`

## Final Phase: Deployment, Documentation & Presentation

The final phase focuses on preparing the project for submission, deployment, documentation, and demo.

### Completed Tasks

* Finalized frontend UI design
* Improved login page design
* Improved dashboard layout
* Added clickable sidebar navigation
* Prepared backend and frontend run instructions
* Updated documentation
* Prepared project for deployment/demo
* Prepared screenshots for presentation
* Prepared final README documentation
* Organized project for GitHub submission

### Deployment Notes

The project can be deployed using:

* Frontend: Vercel or Netlify
* Backend: Render, Railway, or Azure App Service
* Database: PostgreSQL hosted on Render, Railway, or Supabase

For local demo, the backend runs on:

```text
http://localhost:5291
```

The frontend runs on:

```text
http://localhost:5173
```

## How to Run the Project Locally

### Requirements

Install the following before running the project:

* .NET SDK
* Node.js
* npm
* PostgreSQL
* Git

## Backend Setup

Go to the backend folder:

```bash
cd backend/HelpDesk.Api
```

Restore dependencies:

```bash
dotnet restore
```

Apply database migrations:

```bash
dotnet ef database update
```

Run the backend:

```bash
dotnet run
```

Backend URL:

```text
http://localhost:5291
```

Swagger URL:

```text
http://localhost:5291/swagger
```

## Frontend Setup

Go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Local Demo Login

Use the following local test account:

```text
Email: mahdi@test.com
Password: Password123
```

## Screenshots

Screenshots are saved in:

```text
docs/screenshots/
```

Recommended screenshots for final submission:

* Login page
* Dashboard analytics
* Ticket list
* Ticket workflow and attachments
* Notification center
* Reports and exporting
* AI ticket analysis
* AI chatbot assistant
* Activity logs
* Swagger API endpoints

## Demo Flow

A suggested demo flow for the final presentation:

1. Login to the system
2. Show dashboard KPI cards and charts
3. Create a new ticket
4. View the ticket list
5. Assign a ticket to a user
6. Update ticket status
7. Add a comment or internal note
8. Upload an attachment
9. Show ticket history
10. Show notification center
11. Show activity logs
12. Show reports
13. Export CSV / Excel report
14. Export PDF using browser print
15. Test AI ticket analysis
16. Test AI chatbot assistant
17. Show Swagger API documentation
18. Show GitHub repository structure

## Notes About AI Integration

The AI features are implemented locally using rule-based logic. This allows the system to demonstrate AI-assisted support without requiring external API keys, billing, or third-party service setup.

The AI module is prepared to be upgraded later using services such as:

* OpenAI API
* Azure OpenAI Service
* Ollama local models

Current AI capabilities include:

* Category recommendation
* Priority recommendation
* Summary generation
* Troubleshooting suggestions
* Chatbot-style support guidance

## Notes About File Uploads

Uploaded files are stored locally inside the backend project under the `Uploads` folder.

Supported file types:

* PNG
* JPG
* JPEG
* PDF
* DOC
* DOCX

## Final Project Status

Final version completed.

The project includes authentication, ticket CRUD, workflow management, comments, internal notes, history tracking, activity logs, notifications, file attachments, dashboard analytics, charts, reports, exports, AI assistant features, improved UI, documentation, and final demo preparation.
