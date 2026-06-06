import { useEffect, useState } from "react";
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

  const [ticketForm, setTicketForm] = useState({
    title: "",
    description: "",
    categoryId: 1,
    priorityId: 1,
  });

  const [editingTicket, setEditingTicket] = useState(null);

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

    setCategories(categoriesResponse.data);
    setPriorities(prioritiesResponse.data);
    setStatuses(statusesResponse.data);
  };

  useEffect(() => {
    if (user) {
      loadTickets();
      loadDropdowns();
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

      await loadTickets();
      setMessage("Ticket created successfully.");
    } catch (error) {
      setMessage(error.response?.data || "Failed to create ticket.");
    }
  };

  const startEdit = (ticket) => {
    const category = categories.find((c) => c.categoryName === ticket.category);
    const priority = priorities.find((p) => p.priorityName === ticket.priority);
    const status = statuses.find((s) => s.statusName === ticket.status);

    setEditingTicket({
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      categoryId: category?.id || 1,
      priorityId: priority?.id || 1,
      statusId: status?.id || 1,
      assignedToUserId: null,
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
        assignedToUserId: editingTicket.assignedToUserId,
      });

      setEditingTicket(null);
      await loadTickets();
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
      await loadTickets();
      setMessage("Ticket deleted successfully.");
    } catch (error) {
      setMessage(error.response?.data || "Failed to delete ticket.");
    }
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
          <span>Create Ticket</span>
          <span>Reports</span>
          <span>Profile</span>
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
            <p>{tickets.length}</p>
          </div>

          <div className="stat-card">
            <h3>Open Tickets</h3>
            <p>{tickets.filter((t) => t.status === "Open").length}</p>
          </div>

          <div className="stat-card">
            <h3>Pending Tickets</h3>
            <p>{tickets.filter((t) => t.status === "Pending").length}</p>
          </div>

          <div className="stat-card">
            <h3>Resolved Tickets</h3>
            <p>{tickets.filter((t) => t.status === "Resolved").length}</p>
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
                <th>Created By</th>
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
                  <td>{ticket.createdByUser}</td>
                  <td>
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
      </main>
    </div>
  );
}

export default App;