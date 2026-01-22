import React, { useState } from "react";
import "../css/userManagement.css";
import "../css/modal.css";
import { users } from "../mock/data.jsx";

export const UserManagement = () => {
    const [userList, setUserList] = useState(users);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        Username: "", // Matches user request form field name
        email: "",
        role: "Operator",
        project: "Yoga Research Lab"
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = (user) => {
        setFormData({
            Username: user.name, // Mapping 'name' from mock to 'Username' field
            email: user.email,
            role: user.role,
            project: user.project
        });
        setEditingId(user.id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            setUserList(userList.filter(u => u.id !== id));
        }
    };

    const handleSubmit = () => {
        if (editingId) {
            // Update
            setUserList(userList.map(u => u.id === editingId ? {
                ...u,
                name: formData.Username,
                email: formData.email,
                role: formData.role,
                project: formData.project
            } : u));
        } else {
            // Create
            const newUser = {
                id: Date.now(),
                name: formData.Username,
                email: formData.email,
                role: formData.role,
                project: formData.project,
                status: "Active",
                lastActive: "Just now",
                sessions: 0
            };
            setUserList([...userList, newUser]);
        }
        resetForm();
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            Username: "",
            email: "",
            role: "Operator",
            project: "Yoga Research Lab"
        });
    };

    // Filter logic needs to use userList. 
    // The original code had static filters in UI but didn't implement logic. 
    // I will just render userList. If filters need implementation, that's extra scope but I'll stick to displaying userList which includes edits.

    return (
        <div>
            <div className="user-management-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>User Management</h2>
                    <p style={{ margin: "4px 0 0 0", color: "#666" }}>Manage user accounts and role-based access</p>
                </div>
                {!showForm && (
                    <button
                        className="add-user-btn"
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                        style={{
                            backgroundColor: "#0f172a",
                            color: "white",
                            padding: "10px 20px",
                            borderRadius: "6px",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "14px",
                            fontWeight: "500"
                        }}
                    >
                        + Add User
                    </button>
                )}
            </div>

            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2 className="add-user-form-title">{editingId ? "Edit User Account" : "Create New User Account"}</h2>

                        <div className="add-user-form-grid">
                            {/* Full Name */}
                            <div>
                                <label className="form-group-label">Username</label>
                                <input
                                    type="text"
                                    name="Username"
                                    placeholder="e.g., Jane Doe"
                                    value={formData.Username}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="form-group-label">Email</label>
                                <input
                                    type="text"
                                    name="email"
                                    placeholder="jane.doe@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label className="form-group-label">Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="form-select-box"
                                >
                                    <option>User</option>
                                    <option>Admin</option>
                                    <option>Supporter</option>
                                </select>
                            </div>

                            {/* Assign to Project */}
                            <div>
                                <label className="form-group-label">Assign to Project</label>
                                <select
                                    name="project"
                                    value={formData.project}
                                    onChange={handleInputChange}
                                    className="form-select-box"
                                >
                                    <option>Yoga Research Lab</option>
                                    <option>Physical Therapy Clinic</option>
                                    <option>Sports Performance</option>
                                </select>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="form-actions">
                            <button
                                onClick={handleSubmit}
                                className="submit-btn"
                            >
                                {editingId ? "Update User" : "Create User"}
                            </button>
                            <button
                                onClick={resetForm}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                <span className="showing-text">Showing {userList.length} of {userList.length} users</span>
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
                        {userList.map((user) => (
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
                                    </div>
                                </td>
                                <td>{user.sessions}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="table-action-btn"
                                            aria-label="Edit"
                                            onClick={() => handleEdit(user)}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </button>
                                        <button
                                            className="table-action-btn"
                                            aria-label="Delete"
                                            onClick={() => handleDelete(user.id)}
                                        >
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
