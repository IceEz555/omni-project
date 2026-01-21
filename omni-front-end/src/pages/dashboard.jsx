import React from "react";
import "../css/dashboard.css";

export const Dashboard = ({ setPage }) => {
  return (
    <div>

      <div className="dashboard-stats-grid">
        {[
          { label: "Active Devices", value: "12", color: "#48C9B0" },
          { label: "Devices Online", value: "5", color: "#3498DB" },
          { label: "Alert", value: "0", color: "#E74C3C" },
        ].map((stat, idx) => (
          <div key={idx} className="card" style={{ borderLeft: `4px solid ${stat.color}` }}>
            <p className="stat-card-label">{stat.label}</p>
            <h2 className="stat-card-value">{stat.value}</h2>
          </div>
        ))}
      </div>
      <div className="projects-header">
        <h2 className="projects-title">All Projects</h2>
        <button className="new-project-btn">
          + New Project
        </button>
      </div>
      <div className="card-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card">
            <div className="card-header-row">
              <span className="card-title">Yoga Mat #{i}</span>
              <span className="status-badge">Online</span>
            </div>

            {/* Image Placeholder Box */}
            <div className="device-image-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="#BDC3C7" strokeWidth="2" />
                <circle cx="8.5" cy="8.5" r="1.5" fill="#BDC3C7" />
                <path d="M21 15L16 10L5 21" stroke="#BDC3C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <p className="last-update-text">Last update: 2 mins ago</p>
            <button className="btn-primary" onClick={() => setPage("Live Monitor")}>
              View Live
            </button>
          </div>
        ))}
      </div>
    </div >
  )
};
