import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../css/dashboard.css";
// import "../css/modal.css"; // Replaced by Common Modal
import { Button } from "../components/common/Button";
import { Input, Select } from "../components/common/Input";
import { Modal } from "../components/common/Modal";
import { Card } from "../components/common/Card";

// Helper Component: Profile Card
const ProfileCard = ({ profile, navigate }) => {
  return (
    <Card
      className="device-card"
      headerAction={
        <span className="status-badge online" style={{ fontSize: '10px', padding: '2px 6px' }}>
          PROFILE
        </span>
      }
      title={profile.name}
    >
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
        style={{ width: '100%', marginTop: '16px' }}
      >
        View Inventory
      </Button>
    </Card>
  );
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [stats, setStats] = useState({ totalDevices: 0, totalProfiles: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // New Profile Modal State
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [newProfileData, setNewProfileData] = useState({
    profile_id: "",
    name: "",
    type: "32x32 Grid",
    dataFormat: "",
    description: ""
  });

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Profiles
      const { data: profileList } = await api.get("/admin/get-profiles");

      // 2. Fetch Devices for stats
      const { data: allDevices } = await api.get("/admin/get-devices");

      // 3. Fetch Telemetry for Online Status (Parallel)
      const devicesWithStatus = await Promise.all(
        allDevices.map(async (device) => {
          try {
            const lookupId = device.serialNumber || device.name;
            const { data: telRes } = await api.get(`/admin/get-telemetry/${lookupId}`);
            const telemetry = telRes.data || [];
            const latestPoint = telemetry[telemetry.length - 1];
            const isOnline = latestPoint && (new Date() - new Date(latestPoint.time) < 60000); // 1 min threshold
            return { ...device, isOnline };
          } catch {
            return { ...device, isOnline: false };
          }
        })
      );

      // 4. Group Counts by Profile
      const profileStats = {};
      profileList.forEach(p => {
        profileStats[p.profile_id] = { ...p, deviceCount: 0, onlineCount: 0 };
      });

      devicesWithStatus.forEach(device => {
        const pid = device.profileKey; // This comes from backend as profile.profile_id
        if (pid && profileStats[pid]) {
          profileStats[pid].deviceCount++;
          if (device.isOnline) profileStats[pid].onlineCount++;
        }
      });

      const finalProfiles = Object.values(profileStats);

      setProfiles(finalProfiles);
      setStats({
        totalDevices: devicesWithStatus.length,
        totalProfiles: finalProfiles.length
      });

    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleCreateProfile = async () => {
    if (!newProfileData.profile_id || !newProfileData.name) {
      alert("Profile ID and Name are required");
      return;
    }
    try {
      await api.post("/admin/create-profile", newProfileData);
      alert("Profile Created!");
      setShowCreateProfile(false);
      setNewProfileData({ profile_id: "", name: "", type: "32x32 Grid", dataFormat: "", description: "" });
      fetchDashboardData();
    } catch (e) {
      console.error(e);
      alert("Failed");
    }
  };

  const statCards = [
    { label: "Device Profiles", value: stats.totalProfiles, color: "#48C9B0" },
    { label: "Total Devices", value: stats.totalDevices, color: "#3498DB" },
  ];

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      <div className="dashboard-stats-grid">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
            <p className="stat-card-label">{stat.label}</p>
            <h2 className="stat-card-value">{stat.value}</h2>
          </Card>
        ))}
      </div>

      <div className="projects-header">
        <h2 className="projects-title">Device Profiles</h2>
        <div className="header-actions">
          <Button
            className="new-project-btn"
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
            <ProfileCard key={prof.id} profile={prof} navigate={navigate} />
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
        title="New Device Profile"
        footer={
          <>
            <Button className="btn-create" onClick={handleCreateProfile}>Create</Button>
            <Button className="btn-cancel" onClick={() => setShowCreateProfile(false)} variant="secondary">Cancel</Button>
          </>
        }
      >
        <div className="form-row" style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <Input
              label="Profile ID (Unique)"
              type="text"
              placeholder="e.g., ultrasonic_sensor"
              value={newProfileData.profile_id}
              onChange={(e) => setNewProfileData({ ...newProfileData, profile_id: e.target.value })}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Input
              label="Name"
              type="text"
              placeholder="Display Name"
              value={newProfileData.name}
              onChange={(e) => setNewProfileData({ ...newProfileData, name: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row" style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
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
          <div style={{ flex: 1 }}>
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
