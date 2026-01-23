/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import api from "../api/axios";
import "../css/userManagement.css";


export const UserManagement = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        role: "Operator",
        project: "Yoga Research Lab"
    });

    const [users, setUsers] = useState([]);
    // Add useEffect to fetch data
    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchUsers();
    }, []);
    const fetchUsers = async () => {
        try {
            const response = await api.get("/admin/get-users");
            setUsers(response.data); 
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.fullName || !formData.email || !formData.password) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const payload = {
                username: formData.fullName,
                email: formData.email,
                password: formData.password,
                role_name: formData.role,
                project_name: formData.project
            };

            await api.post("/admin/create-user", payload);
            alert("User created successfully!");
            setShowForm(false);
            setFormData({
                fullName: "",
                email: "",
                password: "",
                role: "user",
                project: "Yoga Research Lab"
            });
            fetchUsers(); // Refresh list
        } catch (error) {
            console.error("Failed to create user:", error);
            alert("Failed to create user: " + (error.response?.data?.message || error.message));
        }
    };

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
                        onClick={() => setShowForm(true)}
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
                <div className="add-user-form-container">
                    <h2 className="add-user-form-title">Create New User Account</h2>

                    <div className="add-user-form-grid">
                        {/* Full Name */}
                        <div>
                            <label className="form-group-label">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="e.g., Jane Doe"
                                value={formData.fullName}
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

                        {/* Password */}
                        <div>
                            <label className="form-group-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                value={formData.password}
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
                                <option>Operator</option>
                                <option>Admin</option>
                                <option>Viewer</option>
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
                            Create User
                        </button>
                        <button
                            onClick={() => setShowForm(false)}
                            className="cancel-btn"
                        >
                            Cancel
                        </button>
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
                                        <span className="last-active-time">{user.lastActive}</span>
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
