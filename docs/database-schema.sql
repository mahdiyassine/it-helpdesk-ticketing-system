CREATE TABLE Roles (
    Id SERIAL PRIMARY KEY,
    RoleName VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Users (
    Id SERIAL PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(150) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    RoleId INT NOT NULL,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RoleId) REFERENCES Roles(Id)
);

CREATE TABLE Categories (
    Id SERIAL PRIMARY KEY,
    CategoryName VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE Priorities (
    Id SERIAL PRIMARY KEY,
    PriorityName VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Statuses (
    Id SERIAL PRIMARY KEY,
    StatusName VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Tickets (
    Id SERIAL PRIMARY KEY,
    TicketReference VARCHAR(50) UNIQUE NOT NULL,
    Title VARCHAR(150) NOT NULL,
    Description TEXT NOT NULL,
    CreatedByUserId INT NOT NULL,
    AssignedToUserId INT,
    CategoryId INT NOT NULL,
    PriorityId INT NOT NULL,
    StatusId INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ResolvedAt TIMESTAMP,
    ClosedAt TIMESTAMP,
    FOREIGN KEY (CreatedByUserId) REFERENCES Users(Id),
    FOREIGN KEY (AssignedToUserId) REFERENCES Users(Id),
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id),
    FOREIGN KEY (PriorityId) REFERENCES Priorities(Id),
    FOREIGN KEY (StatusId) REFERENCES Statuses(Id)
);

CREATE TABLE TicketComments (
    Id SERIAL PRIMARY KEY,
    TicketId INT NOT NULL,
    UserId INT NOT NULL,
    CommentText TEXT NOT NULL,
    IsInternal BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (TicketId) REFERENCES Tickets(Id),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE TABLE TicketAttachments (
    Id SERIAL PRIMARY KEY,
    TicketId INT NOT NULL,
    UploadedByUserId INT NOT NULL,
    FileName VARCHAR(255) NOT NULL,
    FilePath VARCHAR(255) NOT NULL,
    FileType VARCHAR(100),
    FileSize INT,
    UploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (TicketId) REFERENCES Tickets(Id),
    FOREIGN KEY (UploadedByUserId) REFERENCES Users(Id)
);

CREATE TABLE Notifications (
    Id SERIAL PRIMARY KEY,
    UserId INT NOT NULL,
    TicketId INT,
    Message TEXT NOT NULL,
    IsRead BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (TicketId) REFERENCES Tickets(Id)
);

CREATE TABLE TicketAssignmentHistory (
    Id SERIAL PRIMARY KEY,
    TicketId INT NOT NULL,
    AssignedFromUserId INT,
    AssignedToUserId INT NOT NULL,
    AssignedByUserId INT NOT NULL,
    AssignedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (TicketId) REFERENCES Tickets(Id),
    FOREIGN KEY (AssignedFromUserId) REFERENCES Users(Id),
    FOREIGN KEY (AssignedToUserId) REFERENCES Users(Id),
    FOREIGN KEY (AssignedByUserId) REFERENCES Users(Id)
);

CREATE TABLE TicketStatusHistory (
    Id SERIAL PRIMARY KEY,
    TicketId INT NOT NULL,
    OldStatusId INT,
    NewStatusId INT NOT NULL,
    ChangedByUserId INT NOT NULL,
    ChangedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (TicketId) REFERENCES Tickets(Id),
    FOREIGN KEY (OldStatusId) REFERENCES Statuses(Id),
    FOREIGN KEY (NewStatusId) REFERENCES Statuses(Id),
    FOREIGN KEY (ChangedByUserId) REFERENCES Users(Id)
);

CREATE TABLE ActivityLogs (
    Id SERIAL PRIMARY KEY,
    UserId INT,
    Action VARCHAR(150) NOT NULL,
    Description TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

INSERT INTO Roles (RoleName) VALUES
('Admin'),
('IT Support Agent'),
('Employee'),
('Manager');

INSERT INTO Categories (CategoryName) VALUES
('Hardware'),
('Software'),
('Network'),
('Email'),
('Access Request'),
('Other');

INSERT INTO Priorities (PriorityName) VALUES
('Low'),
('Medium'),
('High'),
('Critical');

INSERT INTO Statuses (StatusName) VALUES
('Open'),
('In Progress'),
('Pending'),
('Resolved'),
('Closed');
