import React, { useState, useEffect } from "react";
import api from "../api/axios";
import "../css/deviceProfile.css";
// import "../css/modal.css"; // Replaced by Common Modal
import { Button } from "../components/common/Button";
import { Input, Select } from "../components/common/Input";
import { Modal } from "../components/common/Modal";

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

    const handleEdit = (profile) => {
        setEditingId(profile.id);
        setFormData({
            profile_id: profile.profile_id,
            name: profile.name,
            type: profile.type || "32x32 Grid",
            dataFormat: profile.dataFormat || "JSON",
            description: profile.description || ""
        });
        setShowCreateForm(true);
    };

    const handleSubmit = async () => {
        try {
            if (!formData.profile_id || !formData.name) {
                alert("Profile ID and Name are required");
                return;
            }

            if (editingId) {
                await api.put(`/admin/update-profile/${editingId}`, formData);
                alert("Profile updated successfully!");
            } else {
                await api.post("/admin/create-profile", formData);
                alert("Profile created successfully!");
            }

            fetchProfiles();
            resetForm();
        } catch (error) {
            console.error("Failed to save profile:", error);
            alert("Failed to save profile: " + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this profile?")) {
            try {
                await api.delete(`/admin/delete-profile/${id}`);
                fetchProfiles();
            } catch (error) {
                console.error("Failed to delete profile:", error);
                alert("Failed to delete profile");
            }
        }
    };

    const resetForm = () => {
        setShowCreateForm(false);
        setEditingId(null);
        setFormData({
            profile_id: "",
            name: "",
            type: "32x32 Grid",
            dataFormat: "",
            description: ""
        });
    }

    return (
        <div>
            <div className="device-profile-header">
                <div>
                    <h1 className="device-profile-title">Device Profiles</h1>
                    <p className="device-profile-subtitle">Manage device types and data parsing configurations</p>
                </div>
                {!showCreateForm && (
                    <Button
                        variant="primary"
                        onClick={() => {
                            resetForm();
                            setShowCreateForm(true);
                        }}
                    >
                        + New Project
                    </Button>
                )}
            </div>

            <Modal
                isOpen={showCreateForm}
                onClose={() => setShowCreateForm(false)}
                title={editingId ? "Edit Project" : "New Project"}
                footer={
                    <>
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                        >
                            {editingId ? "Update Profile" : "Create Profile"}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={resetForm}
                        >
                            Cancel
                        </Button>
                    </>
                }
            >
                <div className="form-row" style={{ display: 'flex', gap: '16px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <Input
                            label="Profile ID (Unique)"
                            name="profile_id"
                            placeholder="e.g., ultrasonic_sensor"
                            value={formData.profile_id}
                            onChange={handleInputChange}
                            disabled={!!editingId}
                        />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <Input
                            label="Device Name (Display)"
                            name="name"
                            placeholder="Device Name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="form-row" style={{ display: 'flex', gap: '16px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <Select
                            label="Device Type"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            options={[
                                { value: "sensor", label: "Sensor (Timeseries)" },
                                { value: "matrix", label: "Matrix (Grid)" },
                                { value: "32x32 Grid", label: "32x32 Grid" },
                                { value: "unknown", label: "Other" }
                            ]}
                        />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <Input
                            label="Data Format"
                            name="dataFormat"
                            placeholder="e.g., JSON"
                            value={formData.dataFormat}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <Input
                        type="textarea"
                        label="Description"
                        name="description"
                        placeholder="Describe the device..."
                        rows={3}
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                </div>
            </Modal>

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
                                    <h3>{profile.name} <span style={{ fontSize: '12px', color: '#888' }}>({profile.profile_id})</span></h3>
                                    <p>{profile.description || "No description"}</p>
                                </div>
                            </div>
                            <div className="card-actions">
                                <Button className="action-btn" onClick={() => handleEdit(profile)} title="Edit" variant="outline" style={{ padding: '4px 8px' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </Button>
                                <Button className="action-btn" onClick={() => handleDelete(profile.id)} variant="outline" style={{ padding: '4px 8px', marginLeft: '4px', color: '#e74c3c' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </Button>
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
