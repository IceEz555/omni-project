import React from "react";
import "../css/dashboard.css";

export const Dashboard = ({ setPage }) => {
  return (
  <div>
    <div className="stats-box">
      <div className="box"><p>Active Devices</p><h3>12</h3></div>
      <div className="box"><p>Devices Online</p><h3>5</h3></div>
      <div className="box"><p>Alert</p><h3>0</h3></div>
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
