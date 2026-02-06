import React from "react";
import "../css/adminDashboard.css";
import { Card } from "../components/common/Card";

export const AdminDashboard = () => {
  /* Stats with Icons */
  const stats = [
    {
      label: "Total Users",
      value: "147",
      change: "+12 this month",
      trendClass: "trend-up",
      iconClass: "icon-blue",
      borderClass: "border-blue",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      label: "Device Profiles",
      value: "8",
      change: "3 active types",
      trendClass: "trend-neutral",
      iconClass: "icon-teal",
      borderClass: "border-teal",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      )
    },
    {
      label: "Active Sessions",
      value: "23",
      change: "Real-time",
      trendClass: "trend-up",
      iconClass: "icon-green",
      borderClass: "border-green",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      )
    },
    {
      label: "System Alerts",
      value: "2",
      change: "Needs attention",
      trendClass: "trend-down",
      iconClass: "icon-red",
      borderClass: "border-red",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      )
    },
  ];

  return (
    <div className="admin-container">
      {/* 1. Stats Grid */}
      <div className="admin-stats-grid">
        {stats.map((stat, idx) => (
          <Card key={idx} className={`metric-card ${stat.borderClass}`}>
            <div className={`metric-icon ${stat.iconClass}`}>
              {stat.icon}
            </div>
            <span className="metric-label">{stat.label}</span>
            <h3 className="metric-value">{stat.value}</h3>
            <span className={`metric-trend ${stat.trendClass}`}>
              {stat.change}
            </span>
          </Card>
        ))}
      </div>

      {/* 2. Middle Section: Quick Actions & Recent Activity (Split 50/50 via Grid) */}
      <div className="dashboard-sections-grid">
        {/* Left: Quick Actions */}
        <Card className="section-card" title="Quick Actions" titleClassName="section-title">
          <div className="quick-actions-list">
            <div className="quick-action-item">
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                  <path d="M12 2a10 10 0 0 1 10 10H12V2z"></path>
                </svg>
              </div>
              <div className="action-content">
                <h4>New Project</h4>
                <p>Define a new project</p>
              </div>
            </div>

            <div className="quick-action-item">
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
              </div>
              <div className="action-content">
                <h4>Add New User</h4>
                <p>Create account and assign role</p>
              </div>
            </div>

            <div className="quick-action-item">
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <div className="action-content">
                <h4>View System Logs</h4>
                <p>Check API performance and errors</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Right: Recent User Activity */}
        <Card className="section-card" title="Recent User Activity" titleClassName="section-title">
          <div className="user-activity-list">
            {["Sarah Chen", "Dr. Martinez", "John Smith"].map((user, i) => (
              <div key={i} className="user-activity-item">
                <div className="user-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21C20 18.2386 17.7614 16 15 16H9C6.23858 16 4 18.2386 4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="activity-text"><strong>{user}</strong> started a new session</p>
                  <p className="activity-time">{i + 2} minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>



      {/* 4. Bottom Section: Project Data Isolation (Full Width) */}
      <div className="projects-section">
        <h3 className="section-title">Project Data Isolation</h3>
        <div className="projects-grid">
          {["Yoga Research Lab", "Physical Therapy Clinic", "Sports Performance", "Rehab Center"].map((project, idx) => (
            <div key={idx} className="project-card">
              <h4 className="project-title">{project}</h4>
              <div className="mt-auto">
                <div className="project-stat-row">
                  <span>Users</span><span className="project-stat-val">{45 + idx * 10}</span>
                </div>
                <div className="project-stat-row">
                  <span>Devices</span><span className="project-stat-val">{3 + idx}</span>
                </div>
                <div className="project-stat-row">
                  <span>Storage</span><span className="project-stat-val">2{idx} GB</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};