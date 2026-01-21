import React from "react";
import logo from "../assets/logo.png";
import "../css/layout.css";

export const AdminLayout = ({ children, title, currentPage, setPage }) => {
    return (
        <div className="layout-container">
            <div className="sidebar">
                <img src={logo} alt="" className="logo" />
                <nav className="nav-menu">
                    {["AdminDashboard", "Device Profile", "User Management"].map((item) => (
                        <button
                            key={item}
                            onClick={() => setPage(item)}
                            className={`nav-btn ${currentPage === item ? "active" : ""}`}
                        >
                            {item === "AdminDashboard" ? "Dashboard" : item}
                        </button>
                    ))}
                </nav>
                <button className="nav-logout" onClick={() => setPage("Login")}>Logout</button>
            </div>
            <div className="main-area">
                <header className="top-nav">
                    <div>
                        <span>John Doe (admin)</span>
                    </div>
                </header>
                <main className="content-scroll">
                    <h1 style={{ marginBottom: "24px" }}>{title}</h1>
                    {children}
                </main>
            </div>
        </div>
    )
};
