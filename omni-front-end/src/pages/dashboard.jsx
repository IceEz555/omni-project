import React, { useState, useEffect } from "react";
import api from "../api/axios";
import "../css/dashboard.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Helper for formatting time (HH:mm)
const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const Dashboard = () => {
    const [devices, setDevices] = useState([]);
    const [activeDevicesParams, setActiveDevicesParams] = useState({ total: 0, online: 0 });

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchDevicesWithTelemetry();
    }, []);

    const fetchDevicesWithTelemetry = async () => {
        try {
            // 1. Get Devices
            const deviceRes = await api.get("/admin/get-devices");
            const allDevices = deviceRes.data;

            // 2. Fetch Telemetry for each device (Parallel)
            // Note: In production, use websocket or a single aggregate API. Here we brute force for MVP.
            const devicesWithData = await Promise.all(allDevices.map(async (device) => {
                try {
                    // Use Serial Number (Hardware ID) for telemetry lookup
                    // If no serial number, fallback to name for legacy support or skip
                    const lookupId = device.serialNumber || device.name;
                    
                    if (!lookupId) return { ...device, history: [], latestValue: null, isOnline: false };

                    const telRes = await api.get(`/admin/get-telemetry/${lookupId}`); 
                    
                    const telemetry = telRes.data.data; // Array of points
                    
                    // Calc Latest Value
                    const latest = telemetry.length > 0 ? telemetry[telemetry.length - 1].value : null;

                    return {
                        ...device,
                        history: telemetry, // Full history for graph
                        latestValue: latest,
                        isOnline: telemetry.length > 0 && (new Date() - new Date(telemetry[telemetry.length - 1].time) < 60000) // Online if data < 1 min ago
                    };
                } catch (e) {
                    console.warn(`Failed to fetch telemetry for ${device.name}`, e);
                    return { ...device, history: [], latestValue: null, isOnline: false };
                }
            }));

            setDevices(devicesWithData);
            
            // Stats
            const onlineCount = devicesWithData.filter(d => d.isOnline).length;
            setActiveDevicesParams({ total: devicesWithData.length, online: onlineCount });

        } catch (error) {
            console.error("Failed to load dashboard data", error);
        }
    };

    return (
        <div>
            {/* Stats Row */}
            <div className="dashboard-stats-grid">
                {[
                    { label: "Total Devices", value: activeDevicesParams.total, color: "#48C9B0" },
                    { label: "Devices Online", value: activeDevicesParams.online, color: "#3498DB" },
                    { label: "System Alerts", value: "0", color: "#E74C3C" },
                ].map((stat, idx) => (
                    <div key={idx} className="card" style={{ borderLeft: `4px solid ${stat.color}` }}>
                        <p className="stat-card-label">{stat.label}</p>
                        <h2 className="stat-card-value">{stat.value}</h2>
                    </div>
                ))}
            </div>

            <div className="projects-header">
                <h2 className="projects-title">Live Device Overview</h2>
                <button className="new-project-btn" onClick={fetchDevicesWithTelemetry}>
                   ↻ Refresh
                </button>
            </div>

            {/* Device Cards Grid */}
            <div className="card-grid">
                {devices.map((device) => (
                    <div key={device.id} className="card" style={{minHeight: '200px', display: 'flex', flexDirection: 'column'}}>
                        <div className="card-header-row">
                            <span className="card-title">{device.name}</span>
                            <span className={`status-badge ${device.isOnline ? 'online' : 'offline'}`} 
                                  style={{backgroundColor: device.isOnline ? '#2ECC71' : '#95A5A6'}}>
                                {device.isOnline ? 'ONLINE' : 'OFFLINE'}
                            </span>
                        </div>

                        {/* Telemetry Graph / Value */}
                        <div style={{ flex: 1, marginTop: '16px' }}>
                            {device.history.length > 0 ? (
                                <>
                                    <div style={{marginBottom: '8px', fontSize: '24px', fontWeight: 'bold', color: '#2C3E50'}}>
                                        {typeof device.latestValue === 'number' ? device.latestValue.toFixed(2) : device.latestValue}
                                        <span style={{fontSize: '14px', color: '#7F8C8D', marginLeft: '4px'}}>
                                            {/* Unit placeholder */}
                                            {/* We could guess unit from profile or field name */}
                                        </span>
                                    </div>
                                    <div style={{ width: "100%", height: 100 }}>
                                        <ResponsiveContainer>
                                            <LineChart data={device.history}>
                                                <Line type="monotone" dataKey="value" stroke="#3498DB" strokeWidth={2} dot={false} />
                                                {/* <XAxis dataKey="time" hide /> */}
                                                <YAxis hide domain={['auto', 'auto']} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <p className="last-update-text">
                                        Last update: {formatTime(device.history[device.history.length-1].time)}
                                    </p>
                                </>
                            ) : (
                                <div style={{height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#BDC3C7'}}>
                                    No Recent Data
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
