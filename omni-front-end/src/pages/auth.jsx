import React from "react";
import "../css/auth.css";

export const AuthPage = ({ setPage }) => (
  <div className="auth-container">
    <div className="auth-card">
      <h2 style={{ textAlign: "center", color: "var(--seafoam-main)" }}>WELCOME</h2>
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
    </div>
  </div>
);
