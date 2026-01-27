import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import "../css/layout.css";

export const LayoutUser = ({ title }) => { // Removed children, currentPage, setPage
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Live Monitor", path: "/live-monitor" },
    { label: "Sessions", path: "/sessions" }
  ];

  return (
    <div className="layout-container">
      <div className="sidebar">
        <img src={logo} alt="" className="logo" />
        <nav className="nav-menu">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`nav-btn ${location.pathname.startsWith(item.path) ? "active" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button className="nav-logout" onClick={() => navigate("/login")}>Logout</button>
      </div>
      <div className="main-area">
        <header className="top-nav">
          <div>
            <span>John Doe (user)</span>
          </div>
        </header>
        <main className="content-scroll">
          {title && <h1 style={{ marginBottom: "24px" }}>{title}</h1>}
          <Outlet />
        </main>
      </div>
    </div>
  )
};
