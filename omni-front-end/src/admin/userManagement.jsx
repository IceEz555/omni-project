import React from "react";
import "../css/userManagement.css";
// import "../css/modal.css"; // Replaced by Common Modal
import { Button } from "../components/common/Button";
import { Input, Select } from "../components/common/Input";
import { Modal } from "../components/common/Modal";
import { useUserManagement } from "../hooks/useUserManagement.jsx";

export const UserManagement = () => {
    const {
        userList,
        projectList,
        showForm,
        setShowForm,
        editingId,
        setEditingId,
        formData,
        setFormData,
        handleInputChange,
        handleEdit,
        handleDelete,
        handleSubmit,
        resetForm,
        filteredUserList,
        filterRole,
        setFilterRole,
        filterProject,
        setFilterProject
    } = useUserManagement();

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
                <div className="add-user-form-grid">
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
                    <div className="form-group-no-margin"> {/* margin handled by grid gap typically, or Input wrapper */}
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
                    <select
                        className="filter-select"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <option value="All Roles">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                        <option value="Supporter">Supporter</option>
                        <option value="Operator">Operator</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>Filter by Project</label>
                    <select
                        className="filter-select"
                        value={filterProject}
                        onChange={(e) => setFilterProject(e.target.value)}
                    >
                        <option value="All Projects">All Projects</option>
                        {projectList.map(project => (
                            <option key={project.id || project.name} value={project.name}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                </div>
                <span className="showing-text">Showing {filteredUserList.length} of {userList.length} users</span>
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
                        {filteredUserList.map((user) => (
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
                                            aria-label="Edit"
                                            onClick={() => handleEdit(user)}
                                            variant="outline"
                                            className="table-action-btn btn-edit-action"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </Button>
                                        <Button
                                            className="table-action-btn btn-delete-action"
                                            aria-label="Delete"
                                            onClick={() => handleDelete(user.id)}
                                            variant="outline"
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
