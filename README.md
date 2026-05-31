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