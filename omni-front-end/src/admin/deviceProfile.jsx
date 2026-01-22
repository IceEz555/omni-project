import React, { useState } from "react";
import { deviceProfiles } from "../mock/data.jsx";
import "../css/deviceProfile.css";
import "../css/modal.css";

export const DeviceProfile = () => {
    const [profiles, setProfiles] = useState(deviceProfiles);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showForm, setShowForm] = useState(false); // Keeps existing state var if used elsewhere, but mainly using showCreateForm
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: "", // Changed from deviceName to match mock data structure usually, or need mapping
        type: "32x32 Grid",
        dataFormat: "",
        // sampleRate: "", // Mock data might not have this, but I'll keep it in form
        description: ""
    });

    // Check mock data keys. `deviceProfiles` usually has: id, name, description, type, dataFormat, status, icon.
    // I will align formData with these keys.

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = (profile) => {
        setFormData({
            name: profile.name,
            type: profile.type,
            dataFormat: profile.dataFormat,
            description: profile.description
        });
        setEditingId(profile.id);
        setShowCreateForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this profile?")) {
            setProfiles(profiles.filter(p => p.id !== id));
        }
    };

    const handleSubmit = () => {
        if (editingId) {
            // Update
            setProfiles(profiles.map(p => p.id === editingId ? { ...p, ...formData } : p));
        } else {
            // Create
            const newProfile = {
                id: Date.now(),
                ...formData,
                status: "Active", // Default
                activeDevices: 0,
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
            };
            setProfiles([...profiles, newProfile]);
        }
        setShowCreateForm(false);
        setEditingId(null);
        setFormData({
            name: "",
            type: "32x32 Grid",
            dataFormat: "",
            description: ""
        });
    };

    const resetForm = () => {
        setShowCreateForm(false);
        setEditingId(null);
        setFormData({
            name: "",
            type: "32x32 Grid",
            dataFormat: "",
            description: ""
        });
    }

    return (
        <div>
            <div className="device-profile-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                    <h1 style={{ margin: "0 0 8px 0", fontSize: "24px", fontWeight: "bold" }}>Device Profiles</h1>
                    <p style={{ margin: 0, color: "#666" }}>Manage device types and data parsing configurations</p>
                </div>
                {!showCreateForm && (
                    <button
                        className="create-profile-btn"
                        onClick={() => {
                            setEditingId(null);
                            setFormData({ name: "", type: "32x32 Grid", dataFormat: "", description: "" });
                            setShowCreateForm(true);
                        }}
                    >
                        + Create Profile
                    </button>
                )}
            </div>

            {showCreateForm && (
                <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3 className="form-title">{editingId ? "Edit Device Profile" : "Create New Device Profile"}</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Device Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="e.g., Smart Insole"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Device Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                >
                                    <option>32x32 Grid</option>
                                    <option>16x16 Grid</option>
                                    <option>Pressure Mat</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Data Format</label>
                                <input
                                    type="text"
                                    name="dataFormat"
                                    placeholder="e.g., JSON, Binary, CSV"
                                    value={formData.dataFormat}
                                    onChange={handleInputChange}
                                />
                            </div>
                            {/* Sample Rate was in original form but not mock data, keeping generic or removing if not needed. I'll omit to match mock data for now or keep visual only. */}
                            <div className="form-group">
                                <label>Sample Rate</label>
                                <input type="text" placeholder="e.g., 60 Hz" disabled />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                placeholder="Describe the device and its purpose..."
                                rows="3"
                                value={formData.description}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>

                        <div className="form-actions">
                            <button
                                className="btn-create"
                                onClick={handleSubmit}
                            >
                                {editingId ? "Update Profile" : "Create Profile"}
                            </button>
                            <button
                                className="btn-cancel"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="device-profile-list">
                {profiles.map((profile) => (
                    <div key={profile.id} className="device-card">
                        <div className="card-header">
                            <div className="card-title-group">
                                <div className="device-icon">
                                    {profile.icon}
                                </div>
                                <div className="device-info">
                                    <h3>{profile.name}</h3>
                                    <p>{profile.description}</p>
                                </div>
                            </div>
                            <div className="card-actions">
                                <button
                                    className="action-btn"
                                    aria-label="Edit"
                                    onClick={() => handleEdit(profile)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                                <button
                                    className="action-btn"
                                    aria-label="Delete"
                                    onClick={() => handleDelete(profile.id)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="card-stats">
                            <div className="stat-item">
                                <span className="stat-label">Type</span>
                                <span className="stat-value">{profile.type}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Data Format</span>
                                <span className="stat-value">{profile.dataFormat}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Active Devices</span>
                                <span className="stat-value">{profile.activeDevices}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Status</span>
                                <div>
                                    <span className={`status-badge ${profile.status}`}>
                                        {profile.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
