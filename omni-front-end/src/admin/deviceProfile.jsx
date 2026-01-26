import React, { useState, useEffect } from "react";
import api from "../api/axios";
import "../css/deviceProfile.css";
import "../css/modal.css";

export const DeviceProfile = () => {
    const [profiles, setProfiles] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        profile_id: "",
        name: "", 
        type: "32x32 Grid",
        dataFormat: "",
        description: ""
    });

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/admin/get-profiles");
            setProfiles(response.data);
        } catch (error) {
            console.error("Failed to fetch profiles:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        console.log("Creating profile:", formData);
        setShowForm(false);
    };

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
                            resetForm();
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
                            <input type="text" placeholder="e.g., Smart Insole" />
                        </div>
                        <div className="form-group">
                            <label>Device Type</label>
                            <select>
                                <option>32x32 Grid</option>
                                <option>16x16 Grid</option>
                                <option>Pressure Mat</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Data Format</label>
                            <input type="text" placeholder="e.g., JSON, Binary, CSV" />
                        </div>

                        <div className="form-group">
                            <label>Sample Rate</label>
                            <input type="text" placeholder="e.g., 60 Hz" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea placeholder="Describe the device and its purpose..." rows="3"></textarea>
                    </div>

                    <div className="form-actions">
                        <button
                            className="btn-create"
                            onClick={() => setShowCreateForm(false)}
                        >
                            Create Profile
                        </button>
                        <button
                            className="btn-cancel"
                            onClick={() => setShowCreateForm(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="device-profile-list">
                {isLoading && <p>Loading profiles...</p>}
                {!isLoading && profiles.map((profile) => (
                    <div key={profile.id} className="device-card">
                        <div className="card-header">
                            <div className="card-title-group">
                                <div className="device-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line></svg>
                                </div>
                                <div className="device-info">
                                    <h3>{profile.name} <span style={{fontSize: '12px', color: '#888'}}>({profile.profile_id})</span></h3>
                                    <p>{profile.description || "No description"}</p>
                                </div>
                            </div>
                            <div className="card-actions">
                                {/* <button className="action-btn" onClick={() => handleEdit(profile)}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button> */}
                                <button className="action-btn" onClick={() => handleDelete(profile.id)}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
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
                                <span className="stat-value">{profile.activeDevices || 0}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
