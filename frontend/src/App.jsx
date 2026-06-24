import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "./api/api";
import ReportsAiPanel from "./ReportsAiPanel";
import "./style.css";

function App() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [users, setUsers] = useState([]);

  const [dashboardStats, setDashboardStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [statusHistory, setStatusHistory] = useState([]);
  const [assignmentHistory, setAssignmentHistory] = useState([]);
  const [attachments, setAttachments] = useState([]);

  const [ticketForm, setTicketForm] = useState({
    title: "",
    description: "",
    categoryId: 1,
    priorityId: 1,
  });

  const [editingTicket, setEditingTicket] = useState(null);

  const [commentForm, setCommentForm] = useState({
    commentText: "",
    isInternal: false,
  });

  const [assignForm, setAssignForm] = useState({
    assignedToUserId: 1,
  });

  const [statusForm, setStatusForm] = useState({
    statusId: 1,
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await api.post("/Auth/login", loginData);
      localStorage.setItem("token", response.data.token);
      setUser(response.data);
      setMessage("Login successful.");
    } catch (error) {
      setMessage(error.response?.data || "Login failed.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setSelectedTicket(null);
    setMessage("Logged out.");
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const loadTickets = async () => {
    const response = await api.get("/Tickets");
    setTickets(response.data);
  };

  const loadDropdowns = async () => {
    const categoriesResponse = await api.get("/Categories");
    const prioritiesResponse = await api.get("/Priorities");
    const statusesResponse = await api.get("/Statuses");
    const usersResponse = await api.get("/Users");

    setCategories(categoriesResponse.data);
    setPriorities(prioritiesResponse.data);
    setStatuses(statusesResponse.data);
    setUsers(usersResponse.data);
  };

  const loadDashboardStats = async () => {
    const response = await api.get("/Dashboard/stats");
    setDashboardStats(response.data);
  };

  const loadNotifications = async () => {
    const response = await api.get("/Notifications");
    setNotifications(response.data);
  };

  const loadActivityLogs = async () => {
    const response = await api.get("/ActivityLogs");
    setActivityLogs(response.data);
  };

  const loadAttachments = async (ticketId) => {
    const response = await api.get(`/TicketAttachments/ticket/${ticketId}`);
    setAttachments(response.data);
  };

  const loadTicketDetails = async (ticket) => {
    setSelectedTicket(ticket);

    const commentsResponse = await api.get(`/Tickets/${ticket.id}/comments`);
    const statusHistoryResponse = await api.get(
      `/Tickets/${ticket.id}/status-history`
    );
    const assignmentHistoryResponse = await api.get(
      `/Tickets/${ticket.id}/assignment-history`
    );

    setComments(commentsResponse.data);
    setStatusHistory(statusHistoryResponse.data);
    setAssignmentHistory(assignmentHistoryResponse.data);

    await loadAttachments(ticket.id);

    const currentStatus = statuses.find((s) => s.statusName === ticket.status);

    setStatusForm({
      statusId: currentStatus?.id || 1,
    });

    const assignedUser = users.find((u) => u.fullName === ticket.assignedToUser);

    setAssignForm({
      assignedToUserId: assignedUser?.id || users[0]?.id || 1,
    });

    setTimeout(() => scrollToSection("workflow"), 150);
  };

  const refreshDashboardData = async () => {
    await loadTickets();
    await loadDashboardStats();
    await loadNotifications();
    await loadActivityLogs();
  };

  useEffect(() => {
    if (user) {
      loadTickets();
      loadDropdowns();
      loadDashboardStats();
      loadNotifications();
      loadActivityLogs();
    }
  }, [user]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/Tickets", {
        title: ticketForm.title,
        description: ticketForm.description,
        createdByUserId: 1,
        categoryId: Number(ticketForm.categoryId),
        priorityId: Number(ticketForm.priorityId),
      });

      setTicketForm({
        title: "",
        description: "",
        categoryId: 1,
        priorityId: 1,
      });

      await refreshDashboardData();
      setMessage("Ticket created successfully.");
    } catch (error) {
      setMessage(error.response?.data || "Failed to create ticket.");
    }
  };

  const startEdit = (ticket) => {
    const category = categories.find((c) => c.categoryName === ticket.category);
    const priority = priorities.find((p) => p.priorityName === ticket.priority);
    const status = statuses.find((s) => s.statusName === ticket.status);
    const assignedUser = users.find((u) => u.fullName === ticket.assignedToUser);

    setEditingTicket({
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      categoryId: category?.id || 1,
      priorityId: priority?.id || 1,
      statusId: status?.id || 1,
      assignedToUserId: assignedUser?.id || null,
    });

    setTimeout(() => scrollToSection("edit-ticket"), 150);
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.put(`/Tickets/${editingTicket.id}`, {
        title: editingTicket.title,
        description: editingTicket.description,
        categoryId: Number(editingTicket.categoryId),
        priorityId: Number(editingTicket.priorityId),
        statusId: Number(editingTicket.statusId),
        assignedToUserId: editingTicket.assignedToUserId
          ? Number(editingTicket.assignedToUserId)
          : null,
      });

      setEditingTicket(null);
      await refreshDashboardData();
      setMessage("Ticket updated successfully.");
    } catch (error) {
      setMessage(error.response?.data || "Failed to update ticket.");
    }
  };

  const handleDeleteTicket = async (id) => {
    if (!confirm("Are you sure you want to delete this ticket?")) {
      return;
    }

    try {
      await api.delete(`/Tickets/${id}`);
      await refreshDashboardData();
      setSelectedTicket(null);
      setMessage("Ticket deleted successfully.");
    } catch (error) {
      setMessage(error.response?.data || "Failed to delete ticket.");
    }
  };

  const handleAssignTicket = async (e) => {
    e.preventDefault();

    if (!selectedTicket) return;

    try {
      await api.put(`/Tickets/${selectedTicket.id}/assign`, {
        assignedToUserId: Number(assignForm.assignedToUserId),
        assignedByUserId: 1,
      });

      const refreshedTickets = await api.get("/Tickets");
      const updatedTicket = refreshedTickets.data.find(
        (t) => t.id === selectedTicket.id
      );

      setTickets(refreshedTickets.data);

      if (updatedTicket) {
        await loadTicketDetails(updatedTicket);
      }

      await loadDashboardStats();
      await loadActivityLogs();
      setMessage("Ticket assigned successfully.");
    } catch (error) {
      setMessage(error.response?.data || "Failed to assign ticket.");
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();

    if (!selectedTicket) return;

    try {
      await api.put(`/Tickets/${selectedTicket.id}/status`, {
        statusId: Number(statusForm.statusId),
        changedByUserId: 1,
      });

      const refreshedTickets = await api.get("/Tickets");
      const updatedTicket = refreshedTickets.data.find(
        (t) => t.id === selectedTicket.id
      );

      setTickets(refreshedTickets.data);

      if (updatedTicket) {
        await loadTicketDetails(updatedTicket);
      }

      await loadDashboardStats();
      await loadActivityLogs();
      setMessage("Ticket status updated successfully.");
    } catch (error) {
      setMessage(error.response?.data || "Failed to update status.");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!selectedTicket) return;

    try {
      await api.post(`/Tickets/${selectedTicket.id}/comments`, {
        userId: 1,
        commentText: commentForm.commentText,
        isInternal: commentForm.isInternal,
      });

      setCommentForm({
        commentText: "",
        isInternal: false,
      });

      await loadTicketDetails(selectedTicket);
      await loadActivityLogs();
      setMessage("Comment added successfully.");
    } catch (error) {
      setMessage(error.response?.data || "Failed to add comment.");
    }
  };

  const handleUploadAttachment = async (e) => {
    e.preventDefault();

    if (!selectedTicket || !selectedFile) {
      setMessage("Please select a ticket and file first.");
      return;
    }

    const formData = new FormData();
    formData.append("uploadedByUserId", 1);
    formData.append("file", selectedFile);

    try {
      await api.post(
        `/TicketAttachments/ticket/${selectedTicket.id}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSelectedFile(null);
      await loadAttachments(selectedTicket.id);
      await loadDashboardStats();
      await loadNotifications();
      await loadActivityLogs();
      setMessage("File uploaded successfully.");
    } catch (error) {
      setMessage(error.response?.data || "Failed to upload file.");
    }
  };

  const handleMarkNotificationRead = async (id) => {
    try {
      await api.put(`/Notifications/${id}/read`);
      await loadNotifications();
      await loadDashboardStats();
    } catch (error) {
      setMessage(error.response?.data || "Failed to mark notification as read.");
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await api.put("/Notifications/user/1/read-all");
      await loadNotifications();
      await loadDashboardStats();
      setMessage("All notifications marked as read.");
    } catch (error) {
      setMessage(error.response?.data || "Failed to mark all as read.");
    }
  };

  const downloadAttachment = (id) => {
    window.open(`http://localhost:5291/api/TicketAttachments/${id}/download`);
  };

  const recentTickets = tickets.slice(0, 5);
  const unassignedTickets = tickets.filter((t) => !t.assignedToUser).length;

  if (!user) {
  return (
    <div className="login-page">
      <div className="login-visual">
        <div className="visual-card main-visual-card">
          <div className="visual-top">
            <div>
              <span className="visual-dot"></span>
              <span className="visual-dot"></span>
              <span className="visual-dot"></span>
            </div>
            <span className="visual-badge">Live Dashboard</span>
          </div>

          <h2>Smart IT Support System</h2>
          <p>
            Manage tickets, assign agents, track activity, upload files, export
            reports, and use AI support tools from one dashboard.
          </p>

          <div className="visual-stats">
            <div>
              <strong>24</strong>
              <span>Tickets</span>
            </div>
            <div>
              <strong>8</strong>
              <span>Resolved</span>
            </div>
            <div>
              <strong>5</strong>
              <span>Agents</span>
            </div>
          </div>
        </div>

        <div className="floating-card floating-card-one">
          <span>AI</span>
          <p>Priority detected: High</p>
        </div>

        <div className="floating-card floating-card-two">
          <span>Upload</span>
          <p>Screenshot attached successfully</p>
        </div>

        <div className="floating-card floating-card-three">
          <span>Report</span>
          <p>CSV export ready</p>
        </div>
      </div>

      <div className="login-card">
        <div className="login-logo">✦</div>
        <h1>IT Help Desk</h1>
        <p className="subtitle">Sign in to manage support tickets</p>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            placeholder="mahdi@test.com"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            placeholder="Password123"
            required
          />

          <button type="submit">Login</button>
        </form>

        <p className="note">Accounts are created by the system administrator.</p>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">✦</div>
          <div>
            <h2>IT Help Desk</h2>
            <p>Team command center</p>
          </div>
        </div>

        <nav>
          <span className="active-link" onClick={() => scrollToSection("dashboard")}>
            Dashboard
          </span>
          <span onClick={() => scrollToSection("tickets")}>Tickets</span>
          <span onClick={() => scrollToSection("workflow")}>Workflow</span>
          <span onClick={() => scrollToSection("notifications")}>
            Notifications
          </span>
          <span onClick={() => scrollToSection("reports")}>Reports</span>
          <span onClick={() => scrollToSection("ai-analysis")}>AI Analysis</span>
          <span onClick={() => scrollToSection("ai-assistant")}>AI Assistant</span>
          <span onClick={() => scrollToSection("activity-logs")}>Activity Logs</span>
        </nav>

        <div className="user-card">
          <div>
            <h3>{user.fullName || "System Admin"}</h3>
            <p>{user.email || "admin@helpdesk.com"}</p>
          </div>
          <span>ADMIN</span>
          <button onClick={logout}>Logout</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="hero" id="dashboard">
          <div>
            <p className="eyebrow">Overview</p>
            <h1>Dashboard</h1>
            <p>
              Monitor support requests, manage ticket workflow, and review system
              activity.
            </p>
          </div>

          <div className="hero-actions">
            <div className="admin-pill">
              <span className="status-dot"></span>
              {user.fullName || "System Admin"} · Admin
            </div>
            <small>{new Date().toLocaleDateString()}</small>
          </div>
        </header>

        <section className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-line green"></span>
            <h3>Total Tickets</h3>
            <p>{dashboardStats?.totalTickets ?? tickets.length}</p>
            <small>All visible support requests</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-line yellow"></span>
            <h3>Open Tickets</h3>
            <p>{dashboardStats?.openTickets ?? 0}</p>
            <small>Awaiting review or assignment</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-line teal"></span>
            <h3>In Progress</h3>
            <p>{dashboardStats?.inProgressTickets ?? 0}</p>
            <small>Currently being handled</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-line pink"></span>
            <h3>Resolved</h3>
            <p>{dashboardStats?.resolvedTickets ?? 0}</p>
            <small>Completed support requests</small>
          </div>

          <div className="kpi-card">
            <span className="kpi-line orange"></span>
            <h3>Unassigned</h3>
            <p>{unassignedTickets}</p>
            <small>Waiting for an agent</small>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="panel large-panel">
            <div className="section-header">
              <div>
                <p className="eyebrow">Tickets</p>
                <h2>Recent Tickets</h2>
                <p className="section-subtitle">
                  Latest support requests across the organization.
                </p>
              </div>

              <button
                className="secondary-button"
                onClick={() => scrollToSection("tickets")}
              >
                View All
              </button>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Title</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                  </tr>
                </thead>

                <tbody>
                  {recentTickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>{ticket.ticketReference}</td>
                      <td>{ticket.title}</td>
                      <td>
                        <span className="badge">{ticket.priority}</span>
                      </td>
                      <td>
                        <span className="badge soft">{ticket.status}</span>
                      </td>
                      <td>{ticket.assignedToUser || "Unassigned"}</td>
                    </tr>
                  ))}

                  {recentTickets.length === 0 && (
                    <tr>
                      <td colSpan="5">No recent tickets</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="quick-panel">
            <div className="panel">
              <p className="eyebrow">Shortcuts</p>
              <h2>Quick Actions</h2>

              <div className="quick-actions">
                <button onClick={() => scrollToSection("tickets")}>View Tickets</button>
                <button onClick={() => scrollToSection("workflow")}>Workflow</button>
                <button onClick={() => scrollToSection("reports")}>Reports</button>
                <button onClick={() => scrollToSection("ai-assistant")}>
                  AI Assistant
                </button>
              </div>
            </div>

            <div className="panel mini-stats">
              <p className="eyebrow">System</p>
              <h2>Live Summary</h2>

              <div>
                <span>Unread notifications</span>
                <strong>{dashboardStats?.unreadNotifications ?? 0}</strong>
              </div>

              <div>
                <span>Attachments</span>
                <strong>{dashboardStats?.totalAttachments ?? 0}</strong>
              </div>

              <div>
                <span>Total users</span>
                <strong>{dashboardStats?.totalUsers ?? users.length}</strong>
              </div>
            </div>
          </aside>
        </section>

        <section className="charts-grid">
          <div className="panel">
            <div className="section-header">
              <div>
                <p className="eyebrow">Analytics</p>
                <h2>Tickets by Status</h2>
              </div>
            </div>

            <div className="chart-box">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={dashboardStats?.ticketsByStatus || []}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panel">
            <div className="section-header">
              <div>
                <p className="eyebrow">Analytics</p>
                <h2>Tickets by Priority</h2>
              </div>
            </div>

            <div className="chart-box">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={dashboardStats?.ticketsByPriority || []}
                    dataKey="count"
                    nameKey="name"
                    outerRadius={95}
                    label
                  >
                    {(dashboardStats?.ticketsByPriority || []).map(
                      (entry, index) => (
                        <Cell key={`cell-${index}`} />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="panel" id="notifications">
          <div className="section-header">
            <div>
              <p className="eyebrow">Notifications</p>
              <h2>Notification Center</h2>
              <p className="section-subtitle">
                Track system alerts and ticket updates.
              </p>
            </div>

            <button className="secondary-button" onClick={handleMarkAllNotificationsRead}>
              Mark All as Read
            </button>
          </div>

          <div className="notification-list">
            {notifications.map((notification) => (
              <div
                className={
                  notification.isRead
                    ? "notification-card"
                    : "notification-card unread"
                }
                key={notification.id}
              >
                <div>
                  <h3>{notification.title}</h3>
                  <p>{notification.message}</p>
                  <small>{new Date(notification.createdAt).toLocaleString()}</small>
                </div>

                {!notification.isRead && (
                  <button
                    className="small-button"
                    onClick={() => handleMarkNotificationRead(notification.id)}
                  >
                    Mark Read
                  </button>
                )}
              </div>
            ))}

            {notifications.length === 0 && <p>No notifications found.</p>}
          </div>
        </section>

        <section className="panel">
          <div className="section-header">
            <div>
              <p className="eyebrow">Create</p>
              <h2>Create Ticket</h2>
              <p className="section-subtitle">Submit a new IT support request.</p>
            </div>
          </div>

          <form onSubmit={handleCreateTicket} className="ticket-form compact-form">
            <div>
              <label>Title</label>
              <input
                value={ticketForm.title}
                onChange={(e) =>
                  setTicketForm({ ...ticketForm, title: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label>Description</label>
              <textarea
                value={ticketForm.description}
                onChange={(e) =>
                  setTicketForm({ ...ticketForm, description: e.target.value })
                }
                required
              />
            </div>

            <div className="form-row">
              <div>
                <label>Category</label>
                <select
                  value={ticketForm.categoryId}
                  onChange={(e) =>
                    setTicketForm({ ...ticketForm, categoryId: e.target.value })
                  }
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Priority</label>
                <select
                  value={ticketForm.priorityId}
                  onChange={(e) =>
                    setTicketForm({ ...ticketForm, priorityId: e.target.value })
                  }
                >
                  {priorities.map((priority) => (
                    <option key={priority.id} value={priority.id}>
                      {priority.priorityName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit">Create Ticket</button>
          </form>
        </section>

        {editingTicket && (
          <section className="panel" id="edit-ticket">
            <div className="section-header">
              <div>
                <p className="eyebrow">Edit</p>
                <h2>Edit Ticket</h2>
                <p className="section-subtitle">
                  Update ticket information and status.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateTicket} className="ticket-form compact-form">
              <div>
                <label>Title</label>
                <input
                  value={editingTicket.title}
                  onChange={(e) =>
                    setEditingTicket({
                      ...editingTicket,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <label>Description</label>
                <textarea
                  value={editingTicket.description}
                  onChange={(e) =>
                    setEditingTicket({
                      ...editingTicket,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-row">
                <div>
                  <label>Category</label>
                  <select
                    value={editingTicket.categoryId}
                    onChange={(e) =>
                      setEditingTicket({
                        ...editingTicket,
                        categoryId: e.target.value,
                      })
                    }
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Priority</label>
                  <select
                    value={editingTicket.priorityId}
                    onChange={(e) =>
                      setEditingTicket({
                        ...editingTicket,
                        priorityId: e.target.value,
                      })
                    }
                  >
                    {priorities.map((priority) => (
                      <option key={priority.id} value={priority.id}>
                        {priority.priorityName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Status</label>
                  <select
                    value={editingTicket.statusId}
                    onChange={(e) =>
                      setEditingTicket({
                        ...editingTicket,
                        statusId: e.target.value,
                      })
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.statusName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="button-row">
                <button type="submit">Update Ticket</button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setEditingTicket(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="panel" id="tickets">
          <div className="section-header">
            <div>
              <p className="eyebrow">Manage</p>
              <h2>Ticket List</h2>
              <p className="section-subtitle">
                View, edit, assign, and manage all support tickets.
              </p>
            </div>
          </div>

          {message && <p className="message">{message}</p>}

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>{ticket.ticketReference}</td>
                    <td>{ticket.title}</td>
                    <td>{ticket.category}</td>
                    <td>
                      <span className="badge">{ticket.priority}</span>
                    </td>
                    <td>
                      <span className="badge soft">{ticket.status}</span>
                    </td>
                    <td>{ticket.assignedToUser || "Unassigned"}</td>
                    <td>
                      <div className="button-row">
                        <button
                          className="small-button"
                          onClick={() => loadTicketDetails(ticket)}
                        >
                          View
                        </button>

                        <button
                          className="small-button"
                          onClick={() => startEdit(ticket)}
                        >
                          Edit
                        </button>

                        <button
                          className="danger-button"
                          onClick={() => handleDeleteTicket(ticket.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {tickets.length === 0 && (
                  <tr>
                    <td colSpan="7">No tickets found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {selectedTicket && (
          <section className="panel" id="workflow">
            <div className="section-header">
              <div>
                <p className="eyebrow">Workflow</p>
                <h2>Ticket Workflow & Attachments</h2>
                <p className="section-subtitle">
                  Selected Ticket: {selectedTicket.ticketReference} -{" "}
                  {selectedTicket.title}
                </p>
              </div>
            </div>

            <div className="workflow-grid">
              <form onSubmit={handleAssignTicket}>
                <h3>Assign Ticket</h3>

                <label>Assign To</label>
                <select
                  value={assignForm.assignedToUserId}
                  onChange={(e) =>
                    setAssignForm({
                      ...assignForm,
                      assignedToUserId: e.target.value,
                    })
                  }
                >
                  {users.map((systemUser) => (
                    <option key={systemUser.id} value={systemUser.id}>
                      {systemUser.fullName} ({systemUser.roleName})
                    </option>
                  ))}
                </select>

                <button type="submit">Assign</button>
              </form>

              <form onSubmit={handleStatusUpdate}>
                <h3>Update Status</h3>

                <label>Status</label>
                <select
                  value={statusForm.statusId}
                  onChange={(e) =>
                    setStatusForm({ ...statusForm, statusId: e.target.value })
                  }
                >
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.statusName}
                    </option>
                  ))}
                </select>

                <button type="submit">Update Status</button>
              </form>

              <form onSubmit={handleAddComment}>
                <h3>Add Comment</h3>

                <label>Comment</label>
                <textarea
                  value={commentForm.commentText}
                  onChange={(e) =>
                    setCommentForm({
                      ...commentForm,
                      commentText: e.target.value,
                    })
                  }
                  required
                />

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={commentForm.isInternal}
                    onChange={(e) =>
                      setCommentForm({
                        ...commentForm,
                        isInternal: e.target.checked,
                      })
                    }
                  />
                  Internal Note
                </label>

                <button type="submit">Add Comment</button>
              </form>

              <form onSubmit={handleUploadAttachment}>
                <h3>Upload File</h3>

                <label>Screenshot / Document</label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />

                <button type="submit">Upload File</button>
              </form>
            </div>

            <div className="history-grid">
              <div>
                <h3>Attachments</h3>

                {attachments.map((attachment) => (
                  <div className="history-card" key={attachment.id}>
                    <p>{attachment.fileName}</p>
                    <small>
                      Uploaded by {attachment.uploadedByUser} -{" "}
                      {(attachment.fileSize / 1024).toFixed(1)} KB
                    </small>

                    <button
                      className="small-button"
                      onClick={() => downloadAttachment(attachment.id)}
                    >
                      Download
                    </button>
                  </div>
                ))}

                {attachments.length === 0 && <p>No attachments uploaded.</p>}
              </div>

              <div>
                <h3>Comments</h3>

                {comments.map((comment) => (
                  <div className="history-card" key={comment.id}>
                    <p>{comment.commentText}</p>
                    <small>
                      {comment.userFullName} -{" "}
                      {comment.isInternal ? "Internal" : "Public"}
                    </small>
                  </div>
                ))}

                {comments.length === 0 && <p>No comments yet.</p>}
              </div>

              <div>
                <h3>Status History</h3>

                {statusHistory.map((history) => (
                  <div className="history-card" key={history.id}>
                    <p>
                      {history.oldStatus || "None"} → {history.newStatus}
                    </p>
                    <small>Changed by {history.changedByUser}</small>
                  </div>
                ))}

                {statusHistory.length === 0 && <p>No status history yet.</p>}
              </div>

              <div>
                <h3>Assignment History</h3>

                {assignmentHistory.map((history) => (
                  <div className="history-card" key={history.id}>
                    <p>
                      {history.assignedFromUser || "Unassigned"} →{" "}
                      {history.assignedToUser}
                    </p>
                    <small>Assigned by {history.assignedByUser}</small>
                  </div>
                ))}

                {assignmentHistory.length === 0 && (
                  <p>No assignment history yet.</p>
                )}
              </div>
            </div>
          </section>
        )}

        <ReportsAiPanel />

        <section className="panel" id="activity-logs">
          <div className="section-header">
            <div>
              <p className="eyebrow">Audit Trail</p>
              <h2>Activity Logs</h2>
              <p className="section-subtitle">
                Track important actions performed in the system.
              </p>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Description</th>
                  <th>User</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {activityLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.action}</td>
                    <td>{log.description}</td>
                    <td>{log.userFullName || "System"}</td>
                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}

                {activityLogs.length === 0 && (
                  <tr>
                    <td colSpan="4">No activity logs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;