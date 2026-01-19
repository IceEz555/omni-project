import React from "react";
import logo from "../assets/logo.png";
import "../css/auth.css";

export const AuthPage = ({ setPage }) => {

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={logo} alt="Logo" className="auth-logo" />
        <div className="input-group">
          <label>Email</label>
          <input type="text" placeholder="email@domain.com" />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" />
        </div>
        <button
          className="btn-primary"
          style={{ background: "var(--seafoam-main)", color: "white", border: "none" }}
          onClick={() => setPage("Dashboard")}
        >
          Sign In
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
          onClick={() => setPage("AdminDashboard")}
        >
          Login as Admin
        </button>
      </div>
    </div>
  )
};
