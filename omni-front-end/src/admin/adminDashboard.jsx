import React from "react";
import "../css/dashboard.css"; // ใช้ style พื้นฐานร่วมกัน
import "../css/adminDashboard.css";

export const AdminDashboard = () => {
  const stats = [
    { label: "Total Users", value: "147", change: "+12 this month", color: "#48C9B0" },
    { label: "Device Profiles", value: "8", change: "3 active types", color: "#5D6D7E" },
    { label: "Active Sessions", value: "23", change: "Real-time", color: "#3498DB" },
    { label: "System Alerts", value: "2", change: "Needs attention", color: "#E74C3C" },
  ];

  return (
    <div className="admin-container">
      {/* ส่วนบน: Stats Cards */}
      <div className="admin-stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="card" style={{ borderLeft: `4px solid ${stat.color}` }}>
            <p className="stat-card-label">{stat.label}</p>
            <h2 className="stat-card-value">{stat.value}</h2>
            <p className="stat-change-text" style={{ color: stat.label === "System Alerts" ? "#E74C3C" : "#27AE60" }}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="admin-middle-row">
        {/* ส่วนกลางขวา: Quick Actions (Swapped to Left) */}
        <div className="card flex-1">
          <h3 className="section-title">Quick Actions</h3>
          <div className="quick-actions-list">
            {[
              { title: "New Project", desc: "Define a new project" },
              { title: "Add New User", desc: "Create account and assign role" },
              { title: "View System Logs", desc: "Check API performance and errors" }
            ].map((action, idx) => (
              <div key={idx} className="quick-action-item">
                <h4 className="quick-action-title">{action.title}</h4>
                <p className="quick-action-desc">{action.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ส่วนกลางซ้าย: Recent User Activity (Swapped to Right) */}
        <div className="card flex-1">
          <h3 className="section-title">Recent User Activity</h3>
          <div className="user-activity-list">
            {["Sarah Chen", "Dr. Martinez", "John Smith"].map((user, i) => (
              <div key={i} className="user-activity-item">
                <div className="user-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21C20 18.2386 17.7614 16 15 16H9C6.23858 16 4 18.2386 4 21" stroke="#95A5A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="7" r="4" stroke="#95A5A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="activity-text"><strong>{user}</strong> started a new session</p>
                  <p className="activity-time">{i + 2} minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ส่วนล่าง: Project Data Isolation & System Status */}
      <div className="admin-bottom-row">
        <div className="card flex-3">
          <h3 className="section-title">Project Data Isolation</h3>
          <div className="project-grid">
            {["Yoga Research Lab", "Physical Therapy Clinic", "Sports Performance"].map((project, idx) => (
              <div key={idx} className="project-card">
                <h4 className="project-title">{project}</h4>
                <div className="mt-auto">
                  <div className="project-stat-row">
                    <span>Users</span><span className="project-stat-val">{45 + idx * 10}</span>
                  </div>
                  <div className="project-stat-row">
                    <span>Devices</span><span className="project-stat-val">{3 + idx}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status (Moves here) */}
        <div className="card flex-1">
          <h3 className="section-title">System Status</h3>
          <div className="system-status-list">
            {[
              { label: "API Server", status: "Online" },
              { label: "Database", status: "Online" },
              { label: "ML Service", status: "Online" },
              { label: "Storage", status: "78% Used" }
            ].map((item, idx) => (
              <div key={idx} className="system-status-item">
                <span className="status-label">{item.label}</span>
                <div className="status-badge-outline">
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};