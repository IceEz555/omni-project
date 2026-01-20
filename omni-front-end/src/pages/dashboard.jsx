import React from "react";
import "../css/dashboard.css";

export const Dashboard = ({ setPage }) => {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "32px" }}>
        {[
          { label: "Active Devices", value: "12", color: "#48C9B0" },
          { label: "Devices Online", value: "5", color: "#3498DB" },
          { label: "Alert", value: "0", color: "#E74C3C" },
        ].map((stat, idx) => (
          <div key={idx} className="card" style={{ borderLeft: `4px solid ${stat.color}` }}>
            <p style={{ fontSize: "14px", color: "#888", marginBottom: "8px" }}>{stat.label}</p>
            <h2 style={{ margin: "0", fontSize: "24px" }}>{stat.value}</h2>
          </div>
        ))}
      </div>
      <div className="card-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
              <span style={{ fontWeight: "bold" }}>Yoga Mat #{i}</span>
              <span className="status-badge">Online</span>
            </div>
            <p style={{ fontSize: "14px", color: "#666" }}>Last update: 2 mins ago</p>
            <button className="btn-primary" onClick={() => setPage("Live Monitor")}>
              View Live
            </button>
          </div>
        ))}
      </div>
    </div>
  )
};
