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

  if (!user) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>IT Help Desk</h1>
          <p className="subtitle">Login to access the ticketing system</p>

          <form onSubmit={handleLogin}>
            <label>Email</label>
            <input
              type="email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
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
    <div className="app-layout">
      <aside className="sidebar">
        <h2>IT Help Desk</h2>
        <nav>
          <span className="active-link">Dashboard</span>
          <span>Tickets</span>
          <span>Workflow</span>
          <span>Notifications</span>
          <span>Activity Logs</span>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, {user.fullName}</p>
          </div>
          <button onClick={logout}>Logout</button>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <h3>Total Tickets</h3>
            <p>{dashboardStats?.totalTickets ?? tickets.length}</p>
          </div>

          <div className="stat-card">
            <h3>Open</h3>
            <p>{dashboardStats?.openTickets ?? 0}</p>
          </div>

          <div className="stat-card">
            <h3>In Progress</h3>
            <p>{dashboardStats?.inProgressTickets ?? 0}</p>
          </div>

          <div className="stat-card">
            <h3>Resolved</h3>
            <p>{dashboardStats?.resolvedTickets ?? 0}</p>
          </div>

          <div className="stat-card">
            <h3>Unread Notifications</h3>
            <p>{dashboardStats?.unreadNotifications ?? 0}</p>
          </div>

          <div className="stat-card">
            <h3>Attachments</h3>
            <p>{dashboardStats?.totalAttachments ?? 0}</p>
          </div>
        </section>

        <section className="charts-grid">
          <div className="panel">
            <h2>Tickets by Status</h2>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={dashboardStats?.ticketsByStatus || []}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panel">
            <h2>Tickets by Priority</h2>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={dashboardStats?.ticketsByPriority || []}
                    dataKey="count"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {(dashboardStats?.ticketsByPriority || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="panel">
          <h2>Notification Center</h2>

          <button className="secondary-button" onClick={handleMarkAllNotificationsRead}>
            Mark All as Read
          </button>

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
          <h2>Create Ticket</h2>

          <form onSubmit={handleCreateTicket} className="ticket-form">
            <label>Title</label>
            <input
              value={ticketForm.title}
              onChange={(e) =>
                setTicketForm({ ...ticketForm, title: e.target.value })
              }
              required
            />

            <label>Description</label>
            <textarea
              value={ticketForm.description}
              onChange={(e) =>
                setTicketForm({ ...ticketForm, description: e.target.value })
              }
              required
            />

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
          <section className="panel">
            <h2>Edit Ticket</h2>

            <form onSubmit={handleUpdateTicket} className="ticket-form">
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

        <section className="panel">
          <h2>Ticket List</h2>

          {message && <p className="message">{message}</p>}

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
                  <td>{ticket.priority}</td>
                  <td>{ticket.status}</td>
                  <td>{ticket.assignedToUser || "Unassigned"}</td>
                  <td>
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
        </section>

        {selectedTicket && (
          <section className="panel">
            <h2>Ticket Workflow & Attachments</h2>
            <p>
              <strong>Selected Ticket:</strong> {selectedTicket.ticketReference} -{" "}
              {selectedTicket.title}
            </p>

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

        <section className="panel">
          <h2>Activity Logs</h2>

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
        </section>
      </main>
    </div>
  );
}

export default App;