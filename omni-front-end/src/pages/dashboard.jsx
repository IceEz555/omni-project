import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/dashboard.css";
// import "../css/modal.css"; // Replaced by Common Modal
import { Button } from "../components/common/Button";
import { Input, Select } from "../components/common/Input";
import { Modal } from "../components/common/Modal";
import { Card } from "../components/common/Card";
import { useDashboard } from "../hooks/useDashboard.jsx";

// Helper Component: Profile Card
const ProfileCard = ({ profile, navigate, onEdit, onDelete }) => {
  return (
    <Card
      className="device-card"
      title={profile.name || "\u00A0"}
    >
      <div className="card-badge-container">
        <span className="status-badge online status-badge-small">

          PROFILE
        </span>
        <Button
          className="profile-card-action-btn"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(profile);
          }}
          title="Edit Profile"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </Button>
        <Button
          className="profile-card-action-btn"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(profile.id);
          }}
          title="Delete Profile"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </Button>
      </div>
      <div className="profile-info-container">
        <div className="profile-id-row">
          <span className="font-medium">ID:</span> {profile.profile_id}
        </div>
        <div className="info-row">
          <span>Total Devices:</span>
          <span className="font-bold">{profile.deviceCount}</span>
        </div>
        <div className="info-row">
          <span>Online:</span>
          <span className={`font-bold ${profile.onlineCount > 0 ? 'text-green' : 'text-gray'}`}>
            {profile.onlineCount}
          </span>
        </div>
      </div>

      <Button
        className="btn-device-action"
        onClick={() => navigate(`/project/${profile.profile_id}`)}

      >
        View Inventory
      </Button>
    </Card>
  );
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const {
    profiles,
    stats,
    isLoading,
    showCreateProfile,
    setShowCreateProfile,
    newProfileData,
    setNewProfileData,
    fetchDashboardData,
    handleCreateProfile,
    editingProfileId,
    handleEditProfile,
    handleUpdateProfile,
    handleDeleteProfile
  } = useDashboard();

  /* Metric Cards Data */
  const statCards = [
    {
      label: "Device Profiles",
      value: stats.totalProfiles,
      change: "+2 this week",
      trendClass: "trend-up",
      iconClass: "icon-teal",
      color: "#00b894",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      )
    },
    {
      label: "Total Devices",
      value: stats.totalDevices,
      change: "Active & Online",
      trendClass: "trend-neutral",
      iconClass: "icon-blue",
      color: "#3498DB",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
          <circle cx="12" cy="14" r="4"></circle>
          <line x1="12" y1="6" x2="12.01" y2="6"></line>
        </svg>
      )
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-stats-grid">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="metric-card" style={{ borderLeft: `5px solid ${stat.color}` }}>
            <div className={`metric-icon ${stat.iconClass}`}>
              {stat.icon}
            </div>
            <span className="metric-label">{stat.label}</span>
            <h3 className="metric-value">{stat.value}</h3>
            <span className={`metric-trend ${stat.trendClass}`}>
              {stat.change}
            </span>
          </Card>
        ))}
      </div>

      <div className="projects-header">
        <h2 className="projects-title">Device Profiles</h2>
        <div className="header-actions">
          <Button
            className="new-project-btn"
            variant="primary"
            onClick={() => setShowCreateProfile(true)}
          >
            + New Profile
          </Button>
          <Button
            className={`new-project-btn ${isLoading ? 'loading' : ''}`}
            onClick={fetchDashboardData}
            disabled={isLoading}
            variant="secondary"
          >
            {isLoading ? "⌛ Updating..." : "↻ Refresh"}
          </Button>
        </div>
      </div>

      <div className="card-grid">
        {profiles.length > 0 ? (
          profiles.map((prof) => (
            <ProfileCard key={prof.id} profile={prof} navigate={navigate} onEdit={handleEditProfile} onDelete={handleDeleteProfile} />
          ))
        ) : (
          <div className="empty-state-message">
            {isLoading ? "Loading Profiles..." : "No Device Profiles Found."}
          </div>
        )}
      </div>

      {/* New Profile Modal */}
      <Modal
        isOpen={showCreateProfile}
        onClose={() => setShowCreateProfile(false)}
        title={editingProfileId ? "Edit Profile" : "New Device Profile"}
        footer={
          <>
            <Button className="btn-create" onClick={editingProfileId ? handleUpdateProfile : handleCreateProfile}>
              {editingProfileId ? "Update Profile" : "Create"}
            </Button>
            <Button className="btn-cancel" onClick={() => setShowCreateProfile(false)} variant="secondary">Cancel</Button>
          </>
        }
      >
        <div className="form-row-flex">
          <div className="form-col">

            <Input
              label="Profile ID (Unique)"
              type="text"
              placeholder="e.g., ultrasonic_sensor"
              value={newProfileData.profile_id}
              onChange={(e) => setNewProfileData({ ...newProfileData, profile_id: e.target.value })}
              disabled={!!editingProfileId}
            />
          </div>
          <div className="form-col">

            <Input
              label="Name"
              type="text"
              placeholder="Display Name"
              value={newProfileData.name}
              onChange={(e) => setNewProfileData({ ...newProfileData, name: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row-flex">

          <div className="form-col">

            <Select
              label="Type"
              value={newProfileData.type}
              onChange={e => setNewProfileData({ ...newProfileData, type: e.target.value })}
              options={[
                { value: "sensor", label: "Sensor" },
                { value: "matrix", label: "Matrix" },
                { value: "32x32 Grid", label: "32x32 Grid" },
                { value: "unknown", label: "Other" }
              ]}
            />
          </div>
          <div className="form-col">

            <Input
              label="Data Format"
              type="text"
              placeholder="e.g., JSON"
              value={newProfileData.dataFormat}
              onChange={(e) => setNewProfileData({ ...newProfileData, dataFormat: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Input
            label="Description"
            type="textarea"
            placeholder="Describe the device..."
            rows={3}
            value={newProfileData.description}
            onChange={(e) => setNewProfileData({ ...newProfileData, description: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
};
