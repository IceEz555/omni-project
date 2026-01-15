import React from "react";
import logo from "../assets/logo.png";
import "../css/layout.css";

export const Layout = ({ children, title, currentPage, setPage }) => (
  <div className="layout-container">
    <div className="sidebar">
      <img src={logo} alt="" className="logo"/>
      <nav className="nav-menu">
        {["Dashboard", "Live Monitor", "Sessions"].map((item) => (
          <button
            key={item}
            onClick={() => setPage(item)}
            className={`nav-btn ${currentPage === item ? "active" : ""}`}
          >
            {item}
          </button>
        ))}
      </nav>
    </div>
    <div className="main-area">
      <header className="top-nav">
        <select><option>Project Alpha</option><option>Project Beta</option></select>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span>John Doe (Supporter)</span>
          <button onClick={() => setPage("Login")}>Logout</button>
        </div>
      </header>
      <main className="content-scroll">
        <h1 style={{ marginBottom: "24px" }}>{title}</h1>
        {children}
      </main>
    </div>
  </div>
);
