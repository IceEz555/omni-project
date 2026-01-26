import React, { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import "../css/dashboard.css";
import "../css/modal.css"; // Import modal CSS
// import mat1Image from "../assets/mat1.png"; // Removed per user request
import {
  LineChart,
  Line,
  YAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";

// --- Helpers ---
const formatTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const IS_ONLINE_THRESHOLD_MS = 60000; // 1 minute

export const Dashboard = ({ setPage }) => {
  const [devices, setDevices] = useState([]);
  const [stats, setStats] = useState({ total: 0, online: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // New Project Modal State
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    name: "",
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
    if (!newProjectData.name) {
      alert("Project Name is required");
      return;
    }

    try {
      // Mock creation for now (or call API if endpoint exists)
      console.log("Creating project:", newProjectData);
      alert(`Project "${newProjectData.name}" created! (Mock)`);

      setShowCreateProject(false);
      setNewProjectData({ name: "", description: "" });
      // fetchDevicesWithTelemetry(); // Refresh if connected to backend
    } catch (error) {
      console.error("Failed to create project", error);
      alert("Failed to create project");
    }
  };

  // --- Render Helpers ---
  const statCards = [
    { label: "Total Devices", value: stats.total, color: "#48C9B0" },
    { label: "Devices Online", value: stats.online, color: "#3498DB" },
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
            <h3 className="form-title">Create New Project</h3>

            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                placeholder="e.g., My New IoT Project"
                value={newProjectData.name}
                onChange={(e) => setNewProjectData({ ...newProjectData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Describe the project goal..."
                rows="3"
                value={newProjectData.description}
                onChange={(e) => setNewProjectData({ ...newProjectData, description: e.target.value })}
              ></textarea>
            </div>

            <div className="form-actions">
              <button
                className="btn-create"
                onClick={handleCreateProject}
                style={{ background: 'var(--seafoam-main)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}
              >
                Create Project
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowCreateProject(false)}
                style={{ background: '#f5f5f5', border: '1px solid #ddd', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', marginLeft: '10px' }}
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
          <DeviceCard key={device.id || device.serialNumber} device={device} setPage={setPage} />
        ))}
      </div>
    </div>
  );
};

// --- Sub-Component: DeviceCard ---
const DeviceCard = ({ device, setPage }) => {
  const hasHistory = device.history && device.history.length > 0;
  const isMat1 = device.name === 'Mat 1';

  return (
    <div className="card device-card">
      <div className="card-header-row">
        <span className="card-title">{device.name}</span>
        <span
          className={`status-badge ${device.isOnline ? 'online' : 'offline'}`}
          style={{ backgroundColor: device.isOnline ? '#2ECC71' : '#95A5A6' }}
        >
          {device.isOnline ? 'ONLINE' : 'OFFLINE'}
        </span>
      </div>

      <div className="card-content">
        {isMat1 && (
          <div style={{
            width: '100%',
            height: '150px',
            border: '2px dashed #ccc',
            borderRadius: '8px',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#aaa',
            background: '#f9f9f9'
          }}>
            <span>Device View</span>
          </div>
        )}

        {hasHistory ? (
          <>
            <div className="latest-value-container">
              <span className="value-text">
                {typeof device.latestValue === 'number'
                  ? device.latestValue.toFixed(2)
                  : device.latestValue || "N/A"}
              </span>
            </div>

            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={device.history}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3498DB"
                    strokeWidth={2}
                    dot={false}
                  />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip labelFormatter={(val, items) => formatTime(items[0]?.payload?.time)} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <p className="last-update-text">
              Last update: {formatTime(device.history[device.history.length - 1].time)}
            </p>
          </>
        ) : (
          <div className="no-data-placeholder">
            No Recent Data
          </div>
        )}

        {isMat1 && (
          <button
            className="btn-primary"
            style={{ width: '100%', marginTop: '10px', background: 'var(--seafoam-main)', border: 'none', color: 'white' }}
            onClick={() => setPage && setPage('Live Monitor')}
          >
            Start Live Monitor
          </button>
        )}
      </div>
    </div>
  );
};