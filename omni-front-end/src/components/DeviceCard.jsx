import React from "react";
import {
    LineChart,
    Line,
    YAxis,
    ResponsiveContainer,
    Tooltip
} from "recharts";
import { useNavigate } from "react-router-dom";

// Helper for formatting time
const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const DeviceCard = ({ device }) => {
    const navigate = useNavigate();
    const hasHistory = device.history && device.history.length > 0;

    return (
        <div className="card device-card">
            <div className="card-header-row">
                <span className="card-title">{device.name}</span>
                <span
                    className={`status-badge ${device.isOnline ? 'online' : 'offline'}`}
                >
                    {device.isOnline ? 'ONLINE' : 'OFFLINE'}
                </span>
            </div>

            <div className="card-content">
                <div className="device-view-placeholder">
                    <span>Device View</span>
                </div>

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

                <button
                    className="btn-device-action"
                    onClick={() => navigate(`/project/${device.id || device.serialNumber || '1'}`)}
                >
                    Start Live Monitor
                </button>
            </div>
        </div>
    );
};
