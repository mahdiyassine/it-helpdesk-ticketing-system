# IT Help Desk & Ticketing Management System

## Project Overview

This project is a modern web-based IT Help Desk and Ticketing Management System designed to streamline technical support operations inside a company.

Employees can submit support requests, while IT support agents and administrators can manage, prioritize, assign, and resolve tickets through a centralized dashboard.

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

## Week 1 Deliverables

- Requirement gathering
- Workflow diagrams
- UI wireframes
- Database schema
- ERD diagram
- GitHub repository setup

## Project Status

Week 1: Planning and design phase.

## Week 2 Progress

The project setup for frontend and backend has been completed.

### Completed Tasks

- React frontend project setup using Vite
- ASP.NET Core Web API backend setup
- PostgreSQL database connection
- Entity Framework Core setup
- User and Role models
- Database migrations
- JWT authentication
- Register API endpoint
- Login API endpoint
- Role management API endpoint
- Basic role-based authorization
- React login/register page connected to backend

### Week 2 API Endpoints

#### Authentication

- POST /api/Auth/register
- POST /api/Auth/login

#### Roles

- GET /api/Roles
- GET /api/Roles/admin-only
- GET /api/Roles/agent-or-admin
