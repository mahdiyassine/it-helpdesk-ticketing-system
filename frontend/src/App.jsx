import { useState } from "react";
import api from "./api/api";
import "./style.css";

function App() {
  const [mode, setMode] = useState("login");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    roleId: 3,
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await api.post("/Auth/register", registerData);

      localStorage.setItem("token", response.data.token);
      setUser(response.data);
      setMessage("Registration successful.");
    } catch (error) {
      setMessage(error.response?.data || "Registration failed.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setMessage("Logged out.");
  };

  if (user) {
    return (
      <div className="page">
        <div className="card">
          <h1>IT Help Desk</h1>
          <h2>Welcome, {user.fullName}</h2>
          <p>Email: {user.email}</p>
          <p>Role: {user.roleName}</p>

          <div className="dashboard-box">
            <h3>Protected Dashboard</h3>
            <p>You are logged in using JWT authentication.</p>
          </div>

          <button onClick={logout}>Logout</button>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card">
        <h1>IT Help Desk</h1>
        <p className="subtitle">Authentication Portal</p>

        <div className="tabs">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>

          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        {mode === "login" ? (
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
        ) : (
          <form onSubmit={handleRegister}>
            <label>Full Name</label>
            <input
              type="text"
              value={registerData.fullName}
              onChange={(e) =>
                setRegisterData({ ...registerData, fullName: e.target.value })
              }
              required
            />

            <label>Email</label>
            <input
              type="email"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
              required
            />

            <label>Role</label>
            <select
              value={registerData.roleId}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  roleId: Number(e.target.value),
                })
              }
            >
              <option value={1}>Admin</option>
              <option value={2}>IT Support Agent</option>
              <option value={3}>Employee</option>
              <option value={4}>Manager</option>
            </select>

            <button type="submit">Register</button>
          </form>
        )}

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default App;