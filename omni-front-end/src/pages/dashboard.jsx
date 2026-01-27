import React, { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import "../css/dashboard.css";
import "../css/modal.css"; // Import modal CSS
// import mat1Image from "../assets/mat1.png"; // Removed per user request
import { DeviceCard } from "../components/DeviceCard";

const IS_ONLINE_THRESHOLD_MS = 60000; // 1 minute

export const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [stats, setStats] = useState({ total: 0, online: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // New Project Modal State
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    profile_id: "",
    name: "",
    type: "32x32 Grid",
    dataFormat: "",
    description: ""
  });

  // --- Data Fetching ---
  const fetchDevicesWithTelemetry = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. ดึงรายชื่ออุปกรณ์ทั้งหมด
      const { data: allDevices } = await api.get("/admin/get-devices");

      // 2. ดึง Telemetry แบบ Parallel
      const devicesWithData = await Promise.all(
        allDevices.map(async (device) => {
          try {
            const lookupId = device.serialNumber || device.name;
            if (!lookupId) throw new Error("Missing ID");

            const { data: telRes } = await api.get(`/admin/get-telemetry/${lookupId}`);
            const telemetry = telRes.data || [];

            const latestPoint = telemetry[telemetry.length - 1];
            const latestValue = latestPoint?.value ?? null;

            // ตรวจสอบสถานะ Online
            const isOnline = latestPoint &&
              (new Date() - new Date(latestPoint.time) < IS_ONLINE_THRESHOLD_MS);

            return {
              ...device,
              history: telemetry,
              latestValue,
              isOnline: !!isOnline,
            };
          } catch (e) {
            console.warn(`Skipping telemetry for ${device.name}:`, e.message);
            return { ...device, history: [], latestValue: null, isOnline: false };
          }
        })
      );

      setDevices(devicesWithData);

      // 3. อัปเดต Stats
      const onlineCount = devicesWithData.filter((d) => d.isOnline).length;
      setStats({ total: devicesWithData.length, online: onlineCount });

    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevicesWithTelemetry();
  }, [fetchDevicesWithTelemetry]);

  const handleCreateProject = async () => {
    if (!newProjectData.profile_id || !newProjectData.name) {
      alert("Profile ID and Device Name are required");
      return;
    }

    try {
      // Mock creation for now (or call API if endpoint exists)
      console.log("Creating project:", newProjectData);
      alert(`Project "${newProjectData.name}" created! (Mock)`);

      setShowCreateProject(false);
      setNewProjectData({
        profile_id: "",
        name: "",
        type: "32x32 Grid",
        dataFormat: "",
        description: ""
      });
      // fetchDevicesWithTelemetry(); // Refresh if connected to backend
    } catch (error) {
      console.error("Failed to create project", error);
      alert("Failed to create project");
    }
  };

  // --- Render Helpers ---
  const statCards = [
    { label: "Total Devices", value: stats.total, color: "#48C9B0" },
    { label: "System Alerts", value: "0", color: "#E74C3C" },
  ];

  return (
    <div className="dashboard-container">
      {/* Stats Row */}
      <div className="dashboard-stats-grid">
        {statCards.map((stat, idx) => (
          <div key={idx} className="card stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
            <p className="stat-card-label">{stat.label}</p>
            <h2 className="stat-card-value">{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* Header Section */}
      <div className="projects-header">
        <h2 className="projects-title">Live Device Overview</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="new-project-btn"
            onClick={() => setShowCreateProject(true)}
          >
            + New Project
          </button>
          <button
            className={`new-project-btn ${isLoading ? 'loading' : ''}`}
            onClick={fetchDevicesWithTelemetry}
            disabled={isLoading}
          >
            {isLoading ? "⌛ Updating..." : "↻ Refresh"}
          </button>
        </div>
      </div>

      {/* New Project Modal */}
      {showCreateProject && (
        <div className="modal-overlay" onClick={() => setShowCreateProject(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="form-title">New Project</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Profile ID (Unique)</label>
                <input
                  type="text"
                  placeholder="e.g., ultrasonic_sensor"
                  value={newProjectData.profile_id}
                  onChange={(e) => setNewProjectData({ ...newProjectData, profile_id: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Device Name (Display)</label>
                <input
                  type="text"
                  placeholder="Device Name"
                  value={newProjectData.name}
                  onChange={(e) => setNewProjectData({ ...newProjectData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Device Type</label>
                <select
                  value={newProjectData.type}
                  onChange={(e) => setNewProjectData({ ...newProjectData, type: e.target.value })}
                >
                  <option value="sensor">Sensor (Timeseries)</option>
                  <option value="matrix">Matrix (Grid)</option>
                  <option value="32x32 Grid">32x32 Grid</option>
                  <option value="unknown">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Data Format</label>
                <input
                  type="text"
                  placeholder="e.g., JSON"
                  value={newProjectData.dataFormat}
                  onChange={(e) => setNewProjectData({ ...newProjectData, dataFormat: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Describe the device..."
                rows="3"
                value={newProjectData.description}
                onChange={(e) => setNewProjectData({ ...newProjectData, description: e.target.value })}
              ></textarea>
            </div>

            <div className="form-actions">
              <button
                className="btn-create"
                onClick={handleCreateProject}
              >
                Create Profile
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowCreateProject(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Device Cards Grid */}
      <div className="card-grid">
        {devices.map((device) => (
          <DeviceCard key={device.id || device.serialNumber} device={device} />
        ))}
      </div>
    </div>
  );
};