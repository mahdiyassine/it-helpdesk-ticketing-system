import { useState } from "react";
import api from "./api/api";
import "./style.css";

function App() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

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

  if (user) {
    return (
      <div className="app-layout">
        <aside className="sidebar">
          <h2>IT Help Desk</h2>
          <nav>
            <span className="active-link">Dashboard</span>
            <span>Tickets</span>
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

          <section className="user-info">
            <h3>Logged In User</h3>
            <p><strong>Name:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.roleName}</p>
          </section>

          <section className="stats-grid">
            <div className="stat-card">
              <h3>Open Tickets</h3>
              <p>0</p>
            </div>

            <div className="stat-card">
              <h3>Pending Tickets</h3>
              <p>0</p>
            </div>

            <div className="stat-card">
              <h3>Resolved Tickets</h3>
              <p>0</p>
            </div>

            <div className="stat-card">
              <h3>Critical Tickets</h3>
              <p>0</p>
            </div>
          </section>

          <section className="dashboard-section">
            <h3>Index Page</h3>
            <p>
              This dashboard is the main index page that appears after a successful login.
              Ticket management features will be added in the next phases.
            </p>
          </section>
        </main>
      </div>
    );
  }

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

        <p className="note">
          Accounts are created by the system administrator.
        </p>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default App;