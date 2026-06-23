# IT Help Desk & Ticketing Management System

## Project Overview

This project is a modern web-based IT Help Desk and Ticketing Management System designed to streamline technical support operations inside a company.

Employees can submit support requests, while IT support agents, administrators, and managers can manage, prioritize, assign, monitor, and resolve tickets through a centralized dashboard.

## Selected Technology Stack

- Frontend: React
- Backend: ASP.NET Core Web API
- Database: PostgreSQL
- Authentication: JWT Authentication
- Source Control: GitHub

## System Users

- Admin
- IT Support Agent
- Employee
- Manager

## Main Features

- Secure user login
- JWT authentication
- Role-based authorization
- User and role management
- Ticket creation and tracking
- Ticket assignment to IT support agents
- Ticket comments and internal notes
- Ticket categories and priorities
- Notifications
- Dashboard and reports
- File attachments
- Activity logs
- Optional AI-powered ticket categorization and priority suggestion

## Week 1 Progress

Week 1 focused on project planning and system design.

### Completed Deliverables

- Requirement gathering
- Workflow documentation
- Workflow diagrams
- UI wireframes
- Database schema
- ERD diagram
- GitHub repository setup

### Week 1 Files

- `docs/requirements.md`
- `docs/workflows.md`
- `docs/database-schema.sql`
- `diagrams/erd.png`
- `diagrams/erd.puml`
- `wireframes/`

## Week 2 Progress

Week 2 focused on project setup, authentication, role management, and creating the basic index page.

### Completed Tasks

- React frontend project setup using Vite
- ASP.NET Core Web API backend setup
- PostgreSQL database connection
- Entity Framework Core setup
- Database migrations
- User and Role models
- JWT authentication setup
- Login API endpoint
- Role management API endpoint
- Basic role-based authorization
- React login page connected to backend
- Basic dashboard/index page after successful login

## Week 2 API Endpoints

### Authentication

- `POST /api/Auth/login`

### Roles

- `GET /api/Roles`
- `GET /api/Roles/admin-only`
- `GET /api/Roles/agent-or-admin`

## Current Frontend Flow

The application starts with a login page. Public registration is not available because user accounts should be created and managed by the system administrator.

After a successful login, the user is redirected to the dashboard/index page. The dashboard currently displays basic user information and ticket summary placeholders.

## Repository Structure

```text
it-helpdesk-ticketing-system/
│
├── backend/
│   └── HelpDesk.Api/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── database/
│
├── diagrams/
│   ├── erd.png
│   ├── erd.puml
│   ├── employee-ticket-workflow.png
│   ├── admin-ticket-assignment-workflow.png
│   └── agent-ticket-resolution-workflow.png
│
├── docs/
│   ├── requirements.md
│   ├── workflows.md
│   ├── database-schema.sql
│   └── screenshots/
│
├── wireframes/
│
└── README.md
```

## Backend Setup

The backend is built using ASP.NET Core Web API.

### Backend Technologies

- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- JWT Bearer Authentication
- BCrypt password hashing
- Swagger API documentation

### Run Backend

```bash
cd backend/HelpDesk.Api
dotnet run
```

Swagger will be available at:

```text
http://localhost:5291/swagger
```

## Frontend Setup

The frontend is built using React and Vite.

### Frontend Technologies

- React
- Vite
- Axios
- CSS

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

## Database Setup

The project uses PostgreSQL with Entity Framework Core migrations.

Database name:

```text
HelpDeskDb
```

Apply migrations:

```bash
cd backend/HelpDesk.Api
dotnet ef database update
```

## Authentication Flow

1. Admin-created user logs in using email and password.
2. Backend validates the user credentials.
3. Backend generates a JWT token.
4. Frontend stores the token in local storage.
5. User is redirected to the dashboard/index page.
6. Role-based authorization controls access to protected backend endpoints.

## Project Status

Week 2: Project setup, authentication, role management, and index page completed.

## Week 3 Progress

Week 3 focused on ticket CRUD operations, ticket categories, ticket priorities, and connecting the React frontend with the backend APIs.

### Completed Tasks

- Created Ticket model
- Created Category model
- Created Priority model
- Created Status model
- Updated Entity Framework database context
- Added database migration for ticket management
- Implemented ticket CRUD API endpoints
- Implemented categories API endpoint
- Implemented priorities API endpoint
- Implemented statuses API endpoint
- Connected React frontend with ticket APIs
- Created ticket form in React
- Displayed ticket list in React
- Added edit/update ticket functionality
- Added delete ticket functionality
- Displayed dashboard ticket counters

### Week 3 API Endpoints

#### Tickets

- `GET /api/Tickets`
- `GET /api/Tickets/{id}`
- `POST /api/Tickets`
- `PUT /api/Tickets/{id}`
- `DELETE /api/Tickets/{id}`

#### Categories

- `GET /api/Categories`

#### Priorities

- `GET /api/Priorities`

#### Statuses

- `GET /api/Statuses`

## Project Status

Week 3: Ticket CRUD operations, categories, priorities, and frontend API connection completed.

## Week 4 Progress

Week 4 focused on ticket assignment workflow, ticket status updates, comments, activity logs, and ticket history tracking.

### Completed Tasks

- Created TicketComment model
- Created ActivityLog model
- Created TicketStatusHistory model
- Created TicketAssignmentHistory model
- Updated Entity Framework database context
- Added database migration for workflow and history tables
- Implemented ticket assignment endpoint
- Implemented ticket status update endpoint
- Implemented ticket comments endpoints
- Implemented ticket status history endpoint
- Implemented ticket assignment history endpoint
- Implemented activity logs endpoint
- Added users endpoint for assignment dropdown
- Connected React frontend with workflow APIs
- Added ticket assignment UI
- Added ticket status update UI
- Added ticket comments UI
- Added ticket history display
- Added activity logs display

### Week 4 API Endpoints

#### Ticket Workflow

- `PUT /api/Tickets/{id}/assign`
- `PUT /api/Tickets/{id}/status`

#### Ticket Comments

- `POST /api/Tickets/{id}/comments`
- `GET /api/Tickets/{id}/comments`

#### Ticket History

- `GET /api/Tickets/{id}/status-history`
- `GET /api/Tickets/{id}/assignment-history`

#### Activity Logs

- `GET /api/ActivityLogs`

#### Users

- `GET /api/Users`
- `GET /api/Users/agents`

## Project Status

Week 4: Ticket assignment workflow, comments, status updates, activity logs, and history tracking completed.

## Week 5 Progress

Week 5 focused on dashboard analytics, notifications, and ticket file attachments.

### Completed Tasks

- Created Notification model
- Created TicketAttachment model
- Updated database context
- Added migration for notifications and attachments
- Implemented dashboard analytics endpoint
- Implemented notification center endpoints
- Implemented ticket file upload endpoint
- Implemented attachment listing and download endpoints
- Added KPI cards to React dashboard
- Added charts using Recharts
- Added notification center to frontend
- Added file upload section to ticket workflow
- Added attachment list and download button
- Updated activity logs for notification and upload actions

### Week 5 API Endpoints

#### Dashboard

- `GET /api/Dashboard/stats`

#### Notifications

- `GET /api/Notifications`
- `GET /api/Notifications/user/{userId}`
- `POST /api/Notifications`
- `PUT /api/Notifications/{id}/read`
- `PUT /api/Notifications/user/{userId}/read-all`

#### Ticket Attachments

- `POST /api/TicketAttachments/ticket/{ticketId}/upload`
- `GET /api/TicketAttachments/ticket/{ticketId}`
- `GET /api/TicketAttachments/{id}/download`
- `DELETE /api/TicketAttachments/{id}`

## Project Status

Week 5: Dashboard analytics, notifications, ticket attachments, charts, and upload functionality completed.