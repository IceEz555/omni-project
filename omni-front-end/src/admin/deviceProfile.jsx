import React from "react";
import { deviceProfiles } from "../mock/data.jsx";
import "../css/deviceProfile.css";

export const DeviceProfile = () => {
    
    return (
        <div>
            <div className="device-profile-header">
                <p>Manage device types and data parsing configurations</p>
                <button className="create-profile-btn">
                    <span>+</span> Create Profile
                </button>
            </div>

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
