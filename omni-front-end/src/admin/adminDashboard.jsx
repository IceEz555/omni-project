import React from "react";
import "../css/dashboard.css"; // ใช้ style พื้นฐานร่วมกัน

export const AdminDashboard = () => {
  const stats = [
    { label: "Total Users", value: "147", change: "+12 this month", color: "#48C9B0" },
    { label: "Device Profiles", value: "8", change: "3 active types", color: "#5D6D7E" },
    { label: "Active Sessions", value: "23", change: "Real-time", color: "#3498DB" },
    { label: "System Alerts", value: "2", change: "Needs attention", color: "#E74C3C" },
  ];

  return (
    <div className="admin-container" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* ส่วนบน: Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="card" style={{ borderLeft: `4px solid ${stat.color}` }}>
            <p style={{ fontSize: "12px", color: "#888", marginBottom: "8px" }}>{stat.label}</p>
            <h2 style={{ margin: "0" }}>{stat.value}</h2>
            <p style={{ fontSize: "11px", color: stat.label === "System Alerts" ? "#E74C3C" : "#27AE60", marginTop: "8px" }}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "24px" }}>
        {/* ส่วนกลางซ้าย: Recent User Activity */}
        <div className="card" style={{ flex: 2 }}>
          <h3 style={{ marginBottom: "20px" }}>Recent User Activity</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {["Sarah Chen", "Dr. Martinez", "John Smith"].map((user, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", paddingBottom: "12px", borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#eee" }}></div>
                <div>
                  <p style={{ fontSize: "14px", margin: 0 }}><strong>{user}</strong> started a new session</p>
                  <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>{i + 2} minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ส่วนกลางขวา: Quick Actions */}
        <div className="card" style={{ flex: 1 }}>
          <h3 style={{ marginBottom: "20px" }}>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button className="btn-primary" style={{ textAlign: "left", fontSize: "14px" }}>+ Create New Device Profile</button>
            <button className="btn-primary" style={{ textAlign: "left", fontSize: "14px" }}>+ Add New User</button>
            <button className="btn-primary" style={{ textAlign: "left", fontSize: "14px", borderColor: "#333", color: "#333" }}>View System Logs</button>
          </div>
        </div>
      </div>

      {/* ส่วนล่าง: Project Data Isolation */}
      <div className="card">
        <h3 style={{ marginBottom: "20px" }}>Project Data Isolation</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {["Yoga Research Lab", "Physical Therapy Clinic", "Sports Performance"].map((project, idx) => (
            <div key={idx} style={{ padding: "16px", borderRadius: "8px", border: "1px solid #eee", background: "#fcfcfc", display: "flex", flexDirection: "column" }}>
              <h4 style={{ margin: "0 0 12px 0" }}>{project}</h4>
              <div style={{ marginTop: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#666" }}>
                  <span>Users</span><span style={{ color: "#333", fontWeight: "500" }}>{45 + idx * 10}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#666", marginTop: "4px" }}>
                  <span>Devices</span><span style={{ color: "#333", fontWeight: "500" }}>{3 + idx}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};