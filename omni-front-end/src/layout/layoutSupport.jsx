import React from "react";
import logo from "../assets/logo.png";
import "../css/layout.css";

export const LayoutSupport = ({ children, title, currentPage, setPage }) => {
    return (
        <div className="layout-container">
            <div className="sidebar">
                <img src={logo} alt="" className="logo" />
                <nav className="nav-menu">
                    {["Support Dashboard", "Data Labeling", "Model Training", "Model Evaluation"].map((item) => (
                        <button
                            key={item}
                            onClick={() => setPage(item)}
                            className={`nav-btn ${currentPage === item ? "active" : ""}`}
                        >
                            {item}
                        </button>
                    ))}
                </nav>
                <button className="nav-logout" onClick={() => setPage("Login")}>Logout</button>
            </div>
            <div className="main-area">
                <header className="top-nav">
                    <div>
                        <span>Sarah Chen (supporter)</span>
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
