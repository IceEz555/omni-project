import React, { useState, useEffect } from "react";
import api from "../api/axios";
import "../css/userManagement.css";
// import "../css/modal.css"; // Replaced by Common Modal
import { Button } from "../components/common/Button";
import { Input, Select } from "../components/common/Input";
import { Modal } from "../components/common/Modal";

export const UserManagement = () => {
    const [userList, setUserList] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        Username: "", // Matches user request form field name
        email: "",
        password: "",
        role: "User",
        project: "Yoga Research Lab",
        status: "Active"
    });

    const fetchUsers = async () => {
        try {
            const response = await api.get("/admin/get-users");
            setUserList(response.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await api.get("/admin/get-projects");
            setProjectList(response.data);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUsers();
        fetchProjects();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = (user) => {
        setEditingId(user.id);
        // Convert role to Title Case to match select options (e.g., "SUPPORTER" -> "Supporter")
        const titleCaseRole = user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase();

        setFormData({
            Username: user.name,
            email: user.email,
            password: "", // Don't show existing password
            role: titleCaseRole,
            project: user.project,
            status: user.status
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await api.delete(`/admin/delete-user/${id}`);
                fetchUsers();
            } catch (error) {
                console.error("Failed to delete user:", error);
                alert("Failed to delete user");
            }
        }
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                username: formData.Username,
                email: formData.email,
                password: formData.password || "default123", // basic fallback if editing
                role_name: formData.role,
                project_name: formData.project,
                status: formData.status
            };

            if (editingId) {
                // Update
                await api.put(`/admin/update-user/${editingId}`, payload);
                alert("User updated successfully!");
            } else {
                // Create
                if (!formData.Username || !formData.email || !formData.password) {
                    alert("Please fill in all required fields (Username, Email, Password)");
                    return;
                }
                await api.post("/admin/create-user", payload);
                alert("User created successfully!");
            }
            resetForm();
            fetchUsers();
        } catch (error) {
            console.error("Failed to save user:", error);
            alert("Failed to save user: " + (error.response?.data?.message || error.message));
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            Username: "",
            email: "",
            password: "",
            role: "User",
            project: "Yoga Research Lab",
            status: "Active"
        });
    };

    return (
        <div>
            <div className="user-management-header">
                <div>
                    <h2 className="user-management-title">User Management</h2>
                    <p className="user-management-subtitle">Manage user accounts and role-based access</p>
                </div>
                {!showForm && (
                    <Button
                        className="add-user-btn"
                        onClick={() => {
                            setEditingId(null);
                            setFormData({
                                Username: "",
                                email: "",
                                role: "Operator",
                                project: "Yoga Research Lab"
                            });
                            setShowForm(true);
                        }}
                    >
                        + Add User
                    </Button>
                )}
            </div>

            <Modal
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                title={editingId ? "Edit User Account" : "Create New User Account"}
                footer={
                    <>
                        <Button
                            onClick={handleSubmit}
                            variant="primary"
                            className="color-btn"
                        >
                            {editingId ? "Update User" : "Create User"}
                        </Button>
                        <Button
                            onClick={resetForm}
                            variant="secondary"
                        >
                            Cancel
                        </Button>
                    </>
                }
            >
                <div className="add-user-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {/* Full Name */}
                    <div>
                        <Input
                            label="Username"
                            name="Username"
                            placeholder="e.g., Jane Doe"
                            value={formData.Username}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <Input
                            label="Email"
                            name="email"
                            placeholder="jane.doe@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <Select
                            label="Role"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            options={[
                                { value: "User", label: "User" },
                                { value: "Admin", label: "Admin" },
                                { value: "Supporter", label: "Supporter" }
                            ]}
                        />
                    </div>

                    {/* Assign to Project */}
                    <div>
                        <Select
                            label="Assign to Project"
                            name="project"
                            value={formData.project}
                            onChange={handleInputChange}
                            options={[
                                { value: "", label: "Select Project" },
                                ...projectList.map(project => ({
                                    value: project.name,
                                    label: project.name
                                }))
                            ]}
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <Select
                            label="Status"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            options={[
                                { value: "Active", label: "Active" },
                                { value: "Inactive", label: "Inactive" },
                                { value: "Banned", label: "Banned" }
                            ]}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ marginTop: "0" }}> {/* margin handled by grid gap typically, or Input wrapper */}
                        <Input
                            type="password"
                            label="Password"
                            name="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </Modal>

            <div className="filters-bar">
                <div className="filter-group">
                    <label>Filter by Role</label>
                    <select className="filter-select">
                        <option>All Roles</option>
                        <option>User</option>
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
                                        <span className="last-active-time">{user.lastActive}</span>
                                    </div>
                                </td>
                                <td>{user.sessions}</td>
                                <td>
                                    <div className="action-buttons">
                                        <Button
                                            className="table-action-btn"
                                            aria-label="Edit"
                                            onClick={() => handleEdit(user)}
                                            variant="outline"
                                            style={{ marginRight: '8px', padding: '4px 8px' }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </Button>
                                        <Button
                                            className="table-action-btn"
                                            aria-label="Delete"
                                            onClick={() => handleDelete(user.id)}
                                            variant="outline"
                                            style={{ padding: '4px 8px', color: '#e74c3c' }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            </svg>
                                        </Button>
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
