import React from "react";
import "../css/userManagement.css";
import { users } from "../mock/data.jsx";

export const UserManagement = () => {

    return (
        <div>
            <div className="user-management-header">
                <div>
                    <h2>User Management</h2>
                    <p>Manage user accounts and role-based access</p>
                </div>
                <button className="add-user-btn">
                    + Add User
                </button>
            </div>

            <div className="filters-bar">
                <div className="filter-group">
                    <label>Filter by Role</label>
                    <select className="filter-select">
                        <option>All Roles</option>
                        <option>Operator</option>
                        <option>Supporter</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>Filter by Project</label>
                    <select className="filter-select">
                        <option>All Projects</option>
                        <option>Yoga Research Lab</option>
                        <option>Physical Therapy Clinic</option>
                        <option>Sports Performance</option>
                    </select>
                </div>
                <span className="showing-text">Showing {users.length} of {users.length} users</span>
            </div>

            <div className="user-table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Project</th>
                            <th>Status</th>
                            <th>Last Active</th>
                            <th>Sessions</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-cell">
                                        <div className="user-avatar">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="12" cy="7" r="4"></circle>
                                            </svg>
                                        </div>
                                        <div className="user-details">
                                            <span className="user-name">{user.name}</span>
                                            <span className="user-email">{user.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>{user.project}</td>
                                <td>
                                    <span className={`status-badge ${user.status}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="last-active">
                                        <span className="last-active-time">{user.lastActive.split(" ago")[0] + " ago"}</span>
                                        {/* Simplified splitting for demo, normally would use actual dates */}
                                    </div>
                                </td>
                                <td>{user.sessions}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="table-action-btn" aria-label="Edit">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </button>
                                        <button className="table-action-btn" aria-label="Delete">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
