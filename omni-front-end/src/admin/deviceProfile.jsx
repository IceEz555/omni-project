import React, { useState } from "react";
import { deviceProfiles } from "../mock/data.jsx";
import "../css/deviceProfile.css";

export const DeviceProfile = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        deviceName: "",
        deviceType: "32x32 Grid",
        dataFormat: "",
        sampleRate: "",
        description: ""
    });

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
                {!showForm && (
                    <button
                        className="create-profile-btn"
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
                        + Create Profile
                    </button>
                )}
            </div>

            {showForm && (
                <div className="create-profile-form-container">
                    <h2 className="create-profile-form-title">Create New Device Profile</h2>

                    <div className="create-profile-form-grid">
                        {/* Device Name */}
                        <div>
                            <label className="form-group-label">Device Name</label>
                            <input
                                type="text"
                                name="deviceName"
                                placeholder="e.g., Smart Insole"
                                value={formData.deviceName}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>

                        {/* Device Type */}
                        <div>
                            <label className="form-group-label">Device Type</label>
                            <select
                                name="deviceType"
                                value={formData.deviceType}
                                onChange={handleInputChange}
                                className="form-select-box"
                            >
                                <option>32x32 Grid</option>
                                <option>16x16 Grid</option>
                                <option>IMU Sensor</option>
                            </select>
                        </div>

                        {/* Data Format */}
                        <div>
                            <label className="form-group-label">Data Format</label>
                            <input
                                type="text"
                                name="dataFormat"
                                placeholder="e.g., JSON, Binary, CSV"
                                value={formData.dataFormat}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>

                        {/* Sample Rate */}
                        <div>
                            <label className="form-group-label">Sample Rate</label>
                            <input
                                type="text"
                                name="sampleRate"
                                placeholder="e.g., 60 Hz"
                                value={formData.sampleRate}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: "24px" }}>
                        <label className="form-group-label">Description</label>
                        <textarea
                            name="description"
                            placeholder="Describe the device and its purpose..."
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="4"
                            className="form-textarea"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="form-actions">
                        <button
                            onClick={handleSubmit}
                            className="submit-btn"
                        >
                            Create Profile
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

            <div className="device-profile-list">
                {deviceProfiles.map((profile) => (
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
                                <button className="action-btn" aria-label="Edit">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                                <button className="action-btn" aria-label="Delete">
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
