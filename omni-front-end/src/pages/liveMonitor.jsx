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

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Auto-Calibration: Set baseline on first data receive
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

  // Polling Telemetry (Faster: 1000ms)
  useEffect(() => {
    if (!selectedDevice) return;

    const fetchData = async () => {
      try {
        // Fetch by Device Serial Number (Hardware ID)
        const lookupId = selectedDevice.serialNumber || selectedDevice.name;

        const res = await api.get(`/admin/get-telemetry/${lookupId}`);
        const data = res.data.data;

        if (data && data.length > 0) {
          const latestPoint = data[data.length - 1]; // Get the very latest point

          // 1. Real-time Display Update
          setTelemetryData(data); // Update graph/latest value immediately

          // 2. Add to Buffer (The "Bag")
          // We push the LATEST value received into our buffer
          if (latestPoint && typeof latestPoint.value === 'number') {
            dataBufferRef.current.push(latestPoint.value);
          }
        }
      } catch (error) {
        console.warn("Failed to fetch live telemetry", error);
      }
    };

    fetchData(); // Immediate fetch
    const interval = setInterval(fetchData, 1000); // Poll every 1s (Real-time-ish)

    return () => clearInterval(interval);
  }, [selectedDevice]);



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
      <div className="monitor-grid monitor-flex-row">
        <div className="card monitor-column">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="card-header">HEATMAP (16x16)</p>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={handleCalibrate}
                disabled={!isConnected}
                style={{
                  padding: '4px 8px',
                  fontSize: '10px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isConnected ? 'pointer' : 'not-allowed',
                  opacity: isConnected ? 1 : 0.5
                }}
              >
                CALIBRATE
              </button>
              <span style={{ fontSize: '10px', color: isConnected ? '#2ecc71' : '#e74c3c' }}>● {isConnected ? 'LIVE' : 'DISCONNECTED'}</span>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: '10px', color: '#95a5a6', marginBottom: '5px' }}>
            Max: {matrixData.length ? Math.max(...matrixData.flat()) : 0} |
            Min: {matrixData.length ? Math.min(...matrixData.flat()) : 0} |
            Pkts: {packetCount} |
            Last: {lastRxTime ? lastRxTime.toLocaleTimeString() : "Waiting..."}
          </div>

          <div className="heatmap-container" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(16, 1fr)',
            gap: '1px',
            backgroundColor: '#000',
            padding: '10px',
            aspectRatio: '1/1',
            width: '100%',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
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
            <div style={{ color: '#7F8C8D', textAlign: 'center', marginTop: '40px' }}>
              Waiting for Camera Feed...
            </div>
          </div>
        </div>
      </div>

      <div className="card card-current-pose">
        <p className="card-header">SENSORS</p>

        {/* HC-SR04 Distance */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', color: '#95A5A6', marginBottom: '4px' }}>HC-SR04 DISTANCE</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#E67E22' }}>
              {telemetryData.length > 0 && telemetryData[telemetryData.length - 1].distance !== undefined
                ? telemetryData[telemetryData.length - 1].distance.toFixed(1)
                : "--"}
            </span>
            <span style={{ fontSize: '14px', color: '#95A5A6', marginBottom: '5px' }}>cm</span>
          </div>
        </div>

        {/* DHT11 Temp/Humidity */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#95A5A6', marginBottom: '4px' }}>TEMP</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#E74C3C' }}>
                {telemetryData.length > 0 && telemetryData[telemetryData.length - 1].temperature !== undefined
                  ? telemetryData[telemetryData.length - 1].temperature.toFixed(1)
                  : "--"}
              </span>
              <span style={{ fontSize: '14px', color: '#95A5A6', marginBottom: '5px' }}>°C</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#95A5A6', marginBottom: '4px' }}>HUMIDITY</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498DB' }}>
                {telemetryData.length > 0 && telemetryData[telemetryData.length - 1].humidity !== undefined
                  ? telemetryData[telemetryData.length - 1].humidity.toFixed(1)
                  : "--"}
              </span>
              <span style={{ fontSize: '14px', color: '#95A5A6', marginBottom: '5px' }}>%</span>
            </div>
          </div>
        </div>


        {/* Signal Statistics */}
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
          <div style={{ fontSize: '12px', color: '#95A5A6', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span>SIGNAL STATISTICS (5s Window)</span>
            <span style={{ fontSize: '10px', color: '#BDC3C7' }}>Updates every 5s</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
            {/* Logic for Stats */}
            {(() => {
              // Use 5s Interval Stats found in state
              return (
                <>
                  <div style={{ textAlign: 'center', flex: 1, backgroundColor: '#F4F6F7', padding: '8px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '10px', color: '#7F8C8D', marginBottom: '2px' }}>MIN</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2C3E50' }}>{intervalStats.min.toFixed(2)}</div>
                  </div>
                  <div style={{ textAlign: 'center', flex: 1, backgroundColor: '#F4F6F7', padding: '8px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '10px', color: '#7F8C8D', marginBottom: '2px' }}>AVG</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2C3E50' }}>{intervalStats.avg.toFixed(2)}</div>
                  </div>
                  <div style={{ textAlign: 'center', flex: 1, backgroundColor: '#F4F6F7', padding: '8px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '10px', color: '#7F8C8D', marginBottom: '2px' }}>MAX</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2C3E50' }}>{intervalStats.max.toFixed(2)}</div>
                  </div>
                </>
              )
            })()}
          </div>
        </div>

        {/* Classification (Keep existing logic or move) */}
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
          <p className="card-header" style={{ padding: 0, marginBottom: '10px' }}>CURRENT POSE</p>
          <h2 className="pose-title">
            {telemetryData.length > 0 && telemetryData[telemetryData.length - 1].value < 20 ? "Cobra Pose" : "Tree Pose"}
          </h2>
          <div className="confidence-section" style={{ marginTop: '10px' }}>
            <div className="confidence-header">
              <span>AI Confidence</span>
              <span>{telemetryData.length > 0 ? "92%" : "0%"}</span>
            </div>
            <div className="confidence-track">
              <div className="confidence-fill" style={{ width: telemetryData.length > 0 ? '92%' : '0%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="card card-signal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="card-header" style={{ marginBottom: 0 }}>SIGNAL TIMELINE {selectedDevice ? `(${selectedDevice.name})` : ""}</p>
          {selectedDevice && (
            <span className="status-badge online" style={{ fontSize: '10px' }}>
              LIVE
            </span>
          )}
        </div>

        <div className="signal-placeholder" style={{ background: 'none', height: '200px' }}>
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
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#BDC3C7' }}>
              {selectedDevice ? "Loading Data..." : "No Device Selected"}
            </div>
          )}
        </div>
        <p style={{ textAlign: 'right', fontSize: '12px', color: '#95A5A6', marginTop: '8px' }}>
          Latest: {telemetryData.length > 0 ? telemetryData[telemetryData.length - 1].value.toFixed(2) : "-"}
        </p>
      </div>
    </div >
  )
};
