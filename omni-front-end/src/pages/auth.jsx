import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import logo from "../assets/logo.png";
import "../css/auth.css";

export const AuthPage = () => { // Removed setPage prop
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", {
        email: email,
        password: password,
      });
      console.log("Login Success:", response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Login Successful! 🚀");

      // Role-based redirection
      const role = response.data.user.role?.toLowerCase();

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "supporter") {
        navigate("/support/dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error("Login Failed:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Login Failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={logo} alt="Logo" className="auth-logo" />
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="text"
              placeholder="admin@omni.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="password123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="btn-primary"
            style={{ background: "var(--seafoam-main)", color: "white", border: "none" }}
            type="submit"
          >
            Sign In
          </button>
        </form>

        <button
          className="btn-link"
          style={{
            marginTop: "16px",
            background: "transparent",
            color: "var(--seafoam-main)",
            border: "none",
            width: "100%",
            cursor: "pointer",
            textDecoration: "underline"
          }}
          onClick={() => navigate("/register")}
        >
          Create an Account
        </button>
        <button
          className="btn-secondary"
          style={{
            marginTop: "12px",
            background: "transparent",
            color: "#666",
            border: "1px solid #ddd",
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
          onClick={() => navigate("/admin/dashboard")}
        >
          Login as Admin
        </button>
        <button
          className="btn-secondary"
          style={{
            marginTop: "12px",
            background: "transparent",
            color: "#666",
            border: "1px solid #ddd",
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
          onClick={() => navigate("/support/dashboard")}
        >
          Login as Supporter
        </button>
      </div>
    </div>
  );
};
