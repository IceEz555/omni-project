import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import "../css/liveMonitor.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Helper for formatting time (HH:mm:ss)
const formatTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
};

import { io } from "socket.io-client";

// ... existing imports

export const LiveMonitor = () => {
  const [telemetryData, setTelemetryData] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [matrixData, setMatrixData] = useState(Array(16).fill(Array(16).fill(0)));
  const [isConnected, setIsConnected] = useState(false);
  const [baseline, setBaseline] = useState(null); // Calibration baseline

  const [packetCount, setPacketCount] = useState(0);
  const [lastRxTime, setLastRxTime] = useState(null);

  // Buffer and Stats for 5-second Interval
  const dataBufferRef = useRef([]);
  const [intervalStats, setIntervalStats] = useState({ min: 0, max: 0, avg: 0 });

  // Socket Connection for Matrix
  useEffect(() => {
    const socket = io("http://localhost:4000"); // Updated to match backend PORT 4000

    socket.on("connect", () => {
      console.log("Connected to Live Stream");
      setIsConnected(true);
    });

    socket.on("matrix-data", (payload) => {
      // payload.data is 16x16 array
      if (payload && payload.data) {
        setMatrixData(payload.data);
        setPacketCount(prev => prev + 1);
        setLastRxTime(new Date());
      }
    });

    // --- NEW: Sensor Data Listener (Real-time) ---
    socket.on("sensor-data", (data) => {
      console.log("⚡ Sensor Data:", data);

      // 1. Update Graph & Display
      setTelemetryData(prev => {
        const newPoint = {
          time: data.timestamp || new Date().toISOString(),
          value: data.distance || 0, // Default to distance for graph
          ...data
        };
        return [...prev, newPoint].slice(-50); // Keep last 50 points
      });

      // 2. Push to Buffer for 5s Stats
      if (typeof data.distance === 'number') {
        dataBufferRef.current.push(data.distance);
      }
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Auto-Calibration: Set baseline on first valid data receive
  useEffect(() => {
    if (isConnected && matrixData && !baseline) {
      const currentMax = Math.max(...matrixData.flat());
      // Only calibrate if we have "real" data (not just 0s or low noise)
      if (currentMax > 100) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBaseline(JSON.parse(JSON.stringify(matrixData)));
        console.log(`Auto-Calibrated with Max Value: ${currentMax}`);
      }
    }
  }, [matrixData, isConnected, baseline]);

  // Initial Load: Find first device and start polling
  useEffect(() => {
    const init = async () => {
      try {
        // 1. Get Devices
        const res = await api.get("/admin/get-devices");
        const devices = res.data;
        if (devices.length > 0) {
          // Default to first active device logic, or just the first one
          // Prefer finding one that matches "sensor" type or has "Arduino" in name
          const target = devices.find(d => d.name.toLowerCase().includes('arduino')) || devices[0];
          setSelectedDevice(target);
        }
      } catch (error) {
        console.error("Failed to load devices", error);
      }
    };
    init();
  }, []);

  // Polling removed in favor of Socket.IO 'sensor-data' event




  // Interval Calculation Logic (Every 5 seconds)
  useEffect(() => {
    const calcInterval = setInterval(() => {
      const buffer = dataBufferRef.current;

      if (buffer.length > 0) {
        console.log("Calculating Stats from Buffer:", buffer);

        // Calculate Stats
        const min = Math.min(...buffer);
        const max = Math.max(...buffer);
        const sum = buffer.reduce((a, b) => a + b, 0);
        const avg = sum / buffer.length;

        // Update UI State
        setIntervalStats({ min, max, avg });

        // Clear Buffer (Empty the bag)
        dataBufferRef.current = [];
      }
    }, 5000); // Run every 5 seconds

    return () => clearInterval(calcInterval);
  }, []); // Run once on mount

  // ... existing socket & polling effects ...


  // Helper to get color from value (0-1023)
  const getCellColor = (value, rIndex, cIndex) => {
    let calibratedValue = value;

    if (baseline && baseline[rIndex] && baseline[rIndex][cIndex] !== undefined) {
      // Use Math.abs to handle cases where pressure DECREASES the value (inverted wiring)
      calibratedValue = Math.abs(value - baseline[rIndex][cIndex]);
    } else {
      // Fallback if no baseline: assume ~50 is noise
      calibratedValue = Math.max(0, value - 50);
    }

    const maxVal = 600; // Cap at 600 like python script

    // Threshold (Noise Gate)
    if (calibratedValue < 10) calibratedValue = 0;

    const safeVal = Math.min(Math.max(calibratedValue, 0), maxVal);
    const intensity = Math.floor((safeVal / maxVal) * 255);

    return `rgb(${intensity}, 0, ${255 - intensity})`;
  };

  const handleCalibrate = () => {
    if (matrixData) {
      setBaseline(JSON.parse(JSON.stringify(matrixData))); // Deep copy
      console.log("Calibration set!");
    }
  };

  return (
    <div className="live-monitor-wrapper monitor-wrapper">
      <h1>Live Monitor</h1>
      <div className="monitor-grid monitor-flex-row">
        <div className="card monitor-column">
          <div className="flex-between-center">
            <p className="card-header">HEATMAP (16x16)</p>
            <div className="flex-gap-10">
              <button
                onClick={handleCalibrate}
                disabled={!isConnected}
                className="btn-calibrate"
              >
                CALIBRATE
              </button>
              <span className={`status-indicator ${isConnected ? 'status-live' : 'status-disconnected'}`}>● {isConnected ? 'LIVE' : 'DISCONNECTED'}</span>
            </div>
          </div>
          <div className="monitor-stats-bar">
            Max: {matrixData.length ? Math.max(...matrixData.flat()) : 0} |
            Min: {matrixData.length ? Math.min(...matrixData.flat()) : 0} |
            Pkts: {packetCount} |
            Last: {lastRxTime ? lastRxTime.toLocaleTimeString() : "Waiting..."}
          </div>

          <div className="heatmap-container heatmap-grid">
            {matrixData.map((row, rIndex) => (
              row.map((val, cIndex) => (
                <div
                  key={`${rIndex}-${cIndex}`}
                  style={{
                    backgroundColor: getCellColor(val, rIndex, cIndex),
                    width: '100%',
                    height: '100%' // Aspect ratio handles height
                  }}
                  title={`R${rIndex} C${cIndex}: ${val}`}
                />
              ))
            ))}
          </div>
        </div>
        <div className="card monitor-column">
          <p className="card-header">AI Predict Skeleton</p>
          <div className="skeleton-box flex-1">
            <div className="skeleton-message">
              Waiting for Camera Feed...
            </div>
          </div>
        </div>
      </div>

      <div className="card card-current-pose">
        <p className="card-header">SENSORS</p>

        <div className="sensor-grid">
          <div className="sensor-card">
            <div className="sensor-label">HC-SR04 DISTANCE</div>
            <div className="sensor-value-container">
              <span className="sensor-value text-distance">
                {telemetryData.length > 0 && telemetryData[telemetryData.length - 1].distance !== undefined
                  ? telemetryData[telemetryData.length - 1].distance.toFixed(1)
                  : "--"}
              </span>
              <span className="sensor-unit">cm</span>
            </div>
          </div>

          <div className="sensor-row">
            <div className="sensor-card">
              <div className="sensor-label">TEMP</div>
              <div className="sensor-value-container">
                <span className="sensor-value text-temp">
                  {telemetryData.length > 0 && telemetryData[telemetryData.length - 1].temperature !== undefined
                    ? telemetryData[telemetryData.length - 1].temperature.toFixed(1)
                    : "--"}
                </span>
                <span className="sensor-unit">°C</span>
              </div>
            </div>
            <div className="sensor-card">
              <div className="sensor-label">HUMIDITY</div>
              <div className="sensor-value-container">
                <span className="sensor-value text-humidity">
                  {telemetryData.length > 0 && telemetryData[telemetryData.length - 1].humidity !== undefined
                    ? telemetryData[telemetryData.length - 1].humidity.toFixed(1)
                    : "--"}
                </span>
                <span className="sensor-unit">%</span>
              </div>
            </div>
          </div>
        </div>


        {/* Signal Statistics */}
        <div className="signal-stats-wrapper">
          <div className="signal-stats-header">
            <span>STATISTICS</span>
            <span className="signal-stats-update">Updates every 5s</span>
          </div>
          <div className="stats-card-container">
            {/* Logic for Stats */}
            {(() => {
              return (
                <>
                  <div className="stats-card">
                    <div className="stats-label">MIN</div>
                    <div className="stats-value">{intervalStats.min.toFixed(2)}</div>
                  </div>
                  <div className="stats-card">
                    <div className="stats-label">AVG</div>
                    <div className="stats-value">{intervalStats.avg.toFixed(2)}</div>
                  </div>
                  <div className="stats-card">
                    <div className="stats-label">MAX</div>
                    <div className="stats-value">{intervalStats.max.toFixed(2)}</div>
                  </div>
                </>
              )
            })()}
          </div>
        </div>

        {/* Signal Timeline (Moved here) */}
        <div className="section-separator">
          <div className="flex-between-center">
            <p className="card-header margin-bottom-0">GRAPH {selectedDevice ? `(${selectedDevice.name})` : ""}</p>
            {selectedDevice && (
              <span className="status-badge online status-badge-small">
                LIVE
              </span>
            )}
          </div>
          <div className="signal-placeholder-container signal-chart-container">
            {telemetryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={telemetryData}>
                  <XAxis dataKey="time" tickFormatter={formatTime} stroke="#95A5A6" fontSize={12} minTickGap={30} />
                  <YAxis stroke="#95A5A6" fontSize={12} domain={['auto', 'auto']} />
                  <Tooltip
                    labelFormatter={formatTime}
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3498DB"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6 }}
                    animationDuration={500}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-device-text">
                {selectedDevice ? "Loading Data..." : "No Device Selected"}
              </div>
            )}
          </div>
          <p className="latest-value-text">
            Latest: {telemetryData.length > 0 ? telemetryData[telemetryData.length - 1].value.toFixed(2) : "-"}
          </p>
        </div>
      </div>

      {/* Current Pose (Moved to separate card) */}
      <div className="card card-pose">
        <p className="card-header pose-section-header">CURRENT POSE</p>
        <h2 className="pose-title">
          {telemetryData.length > 0 && telemetryData[telemetryData.length - 1].value < 20 ? "Cobra Pose" : "Tree Pose"}
        </h2>
        <div className="confidence-section">
          <div className="confidence-header">
            <span>AI Confidence</span>
            <span>{telemetryData.length > 0 ? "92%" : "0%"}</span>
          </div>
          <div className="confidence-track">
            <div className="confidence-fill" style={{ width: telemetryData.length > 0 ? '92%' : '0%' }}></div>
          </div>
        </div>
      </div>
    </div >
  )
};
