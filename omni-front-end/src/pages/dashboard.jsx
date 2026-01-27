import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../css/dashboard.css";
import "../css/modal.css";

// Helper Component: Profile Card
const ProfileCard = ({ profile, navigate }) => {
  return (
    <div className="card device-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-header-row">
        <span className="card-title" style={{ fontSize: '18px' }}>{profile.name}</span>
        <span className="status-badge online" style={{ background: '#e0f2fe', color: '#0284c7' }}>
          PROFILE
        </span>
      </div>

      <div className="card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ padding: '10px 0', color: '#4b5563' }}>
          <div style={{ marginBottom: '4px', fontSize: '14px' }}>
            <span style={{ fontWeight: 500 }}>ID:</span> {profile.profile_id}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Total Devices:</span>
            <span style={{ fontWeight: 'bold' }}>{profile.deviceCount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Online:</span>
            <span style={{ fontWeight: 'bold', color: profile.onlineCount > 0 ? '#16a34a' : '#6b7280' }}>
              {profile.onlineCount}
            </span>
          </div>
        </div>

        <button
          className="btn-device-action"
          onClick={() => navigate(`/project/${profile.profile_id}`)}
          style={{ marginTop: 'auto' }}
        >
          View Inventory
        </button>
      </div>
    </div>
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
          <div key={idx} className="card stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
            <p className="stat-card-label">{stat.label}</p>
            <h2 className="stat-card-value">{stat.value}</h2>
          </div>
        ))}
      </div>

      <div className="projects-header">
        <h2 className="projects-title">Device Profiles</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="new-project-btn"
            onClick={() => setShowCreateProfile(true)}
          >
            + New Profile
          </button>
          <button
            className={`new-project-btn ${isLoading ? 'loading' : ''}`}
            onClick={fetchDashboardData}
            disabled={isLoading}
          >
            {isLoading ? "⌛ Updating..." : "↻ Refresh"}
          </button>
        </div>
      </div>

      <div className="card-grid">
        {profiles.length > 0 ? (
          profiles.map((prof) => (
            <ProfileCard key={prof.id} profile={prof} navigate={navigate} />
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#6b7280', background: 'white', borderRadius: '8px' }}>
            {isLoading ? "Loading Profiles..." : "No Device Profiles Found."}
          </div>
        )}
      </div>

      {/* New Profile Modal */}
      {showCreateProfile && (
        <div className="modal-overlay" onClick={() => setShowCreateProfile(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="form-title">New Device Profile</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Profile ID (Unique)</label>
                <input
                  type="text"
                  placeholder="e.g., ultrasonic_sensor"
                  value={newProfileData.profile_id}
                  onChange={(e) => setNewProfileData({ ...newProfileData, profile_id: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Display Name"
                  value={newProfileData.name}
                  onChange={(e) => setNewProfileData({ ...newProfileData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Type</label>
                <select value={newProfileData.type} onChange={e => setNewProfileData({ ...newProfileData, type: e.target.value })}>
                  <option value="sensor">Sensor</option>
                  <option value="matrix">Matrix</option>
                  <option value="32x32 Grid">32x32 Grid</option>
                  <option value="unknown">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Data Format</label>
                <input
                  type="text"
                  placeholder="e.g., JSON"
                  value={newProfileData.dataFormat}
                  onChange={(e) => setNewProfileData({ ...newProfileData, dataFormat: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Describe the device..."
                rows="3"
                value={newProfileData.description}
                onChange={(e) => setNewProfileData({ ...newProfileData, description: e.target.value })}
              ></textarea>
            </div>

            <div className="form-actions">
              <button className="btn-create" onClick={handleCreateProfile}>Create</button>
              <button className="btn-cancel" onClick={() => setShowCreateProfile(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
