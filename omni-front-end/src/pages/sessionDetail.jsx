import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/session.css";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { dashboardService } from "../services/dashboardService";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export const SessionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [telemetry, setTelemetry] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- REPLAY STATE ---
  const [matrixFrames, setMatrixFrames] = useState([]); // Array of { time, data: 32x32[][] }
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playbackIntervalRef = useRef(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(100); // ms per frame

  useEffect(() => {
    const fetchSession = async () => {
      try {
        // 1. Fetch Session Info
        const res = await dashboardService.getSession(id);
        setSession(res.data);
        
        // 2. Fetch Telemetry Data (JSON)
        try {
            const telemRes = await dashboardService.getSessionData(id);
            const rawData = Array.isArray(telemRes.data) ? telemRes.data : [];
            
            const frames = [];
            const chartData = [];

            rawData.forEach(d => {
                const timeStr = d._time ? new Date(d._time).toLocaleTimeString() : d.timestamp;
                
                // Process Chart Data
                chartData.push({
                    ...d,
                    time: timeStr
                });

                // Process Matrix Data (if exists)
                if (d.data) {
                    try {
                        // Influx might return it as a stringified JSON
                        const parsedMatrix = typeof d.data === 'string' ? JSON.parse(d.data) : d.data;
                        
                        console.log(`[Replay Debug] Frame ${timeStr}:`, { raw: d.data, parsed: parsedMatrix });

                        if (Array.isArray(parsedMatrix) && parsedMatrix.length > 0) {
                            frames.push({
                                time: timeStr,
                                timestamp: d._time || d.timestamp,
                                grid: parsedMatrix
                            });
                        }
                    } catch (e) {
                        console.warn("Error parsing matrix frame", e);
                    }
                }
            });
            
            setTelemetry(chartData);
            setMatrixFrames(frames);

        } catch (err) {
            console.warn("Failed to load telemetry", err);
        }

      } catch (error) {
        console.error("Failed to fetch session", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  // --- PLAYBACK LOGIC ---
  useEffect(() => {
    if (isPlaying && matrixFrames.length > 0) {
        playbackIntervalRef.current = setInterval(() => {
            setPlaybackIndex(prev => {
                if (prev >= matrixFrames.length - 1) {
                    setIsPlaying(false); // Stop at end
                    return prev;
                }
                return prev + 1;
            });
        }, playbackSpeed);
    } else {
        clearInterval(playbackIntervalRef.current);
    }
    return () => clearInterval(playbackIntervalRef.current);
  }, [isPlaying, matrixFrames, playbackSpeed]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleSliderChange = (e) => {
      const val = Number(e.target.value);
      setPlaybackIndex(val);
      // Optional: Pause on scrub?
      // setIsPlaying(false); 
  };

  // Helper for Color (Reused from LiveMonitor roughly)
  // Helper for Color (Reused from LiveMonitor roughly)
  const getCellColor = (value) => {
    // Safety check for invalid values (null, undefined, non-numbers)
    if (value === undefined || value === null || !Number.isFinite(value)) {
        return 'rgb(0, 0, 0)'; // Return black explicitly (or maybe dark grey if you want to see grid)
    }

    // Simple 0-600 scale visualization
    const maxVal = 600;
    const safeVal = Math.min(Math.max(value, 0), maxVal);
    const intensity = Math.floor((safeVal / maxVal) * 255);
    // Green to Red gradient ish? Or just classic intensity
    // LiveMonitor uses: rgb(intensity, 0, 255-intensity) -> Purple/Blueish
    return `rgb(${intensity}, 0, ${255 - intensity})`;
  };


  if (loading) return <div className="session-detail-container">Loading...</div>;
  if (!session) return <div className="session-detail-container">Session not found</div>;

  const calculateDuration = (start, end) => {
    if (!end) return "Ongoing";
    const diffMs = new Date(end) - new Date(start);
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    return `${diffMins}m ${diffSecs}s`;
  };

  const handleDownloadCsv = async () => {
    if (!session || !session.id) return;
    try {
      const response = await dashboardService.downloadSessionCsv(session.id);
      
      // Create Blob from response
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      
      // Temporary Anchor
      const a = document.createElement('a');
      a.href = url;
      a.download = `session-${session.id}.csv`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed", error);
      alert("Failed to download CSV. Please try again.");
    }
  };

  const currentFrame = matrixFrames[playbackIndex];

  return (
    <div className="session-detail-container" style={{ padding: '20px', display: 'block' }}>
      <div className="session-main-content">
        <div style={{ marginBottom: '20px' }}>
          <Button
            className="btn-back-sessions"
            variant="secondary"
            onClick={() => navigate('/sessions')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', fontWeight: '500', color: '#4b5563', backgroundColor: 'white', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Sessions
          </Button>
        </div>
        <Card title="Session Details">
          <div className="session-info-row">
            <div>
              <p className="info-label">DEVICE</p>
              <p className="info-value" style={{ color: '#2563eb' }}>
                {session.device?.device_name || session.device_id}
              </p>
            </div>
            <div>
              <p className="info-label">START TIME</p>
              <p className="info-value" style={{ fontSize: '16px' }}>
                {new Date(session.start_time).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="info-label">DURATION</p>
              <p className="info-value">{calculateDuration(session.start_time, session.end_time)}</p>
            </div>
            <div>
              <p className="info-label">STATUS</p>
              <span className={`status-badge ${session.end_time ? 'completed' : 'active'}`}>
                {session.end_time ? "Completed" : "Recording..."}
              </span>
            </div>
          </div>
        </Card>

        {/* --- HEATMAP PLAYER SECTION --- */}
        {matrixFrames.length > 0 && (
            <Card title="Session Replay (Heatmap)" className="replay-card">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    {/* Heatmap Grid */}
                    <div 
                        className="heatmap-grid-dynamic" 
                        style={{ 
                            "--cols": currentFrame && currentFrame.grid && currentFrame.grid.length > 0 ? currentFrame.grid[0].length : 32,
                            // width: 'fit-content', // REMOVED to allow full width
                            border: '1px solid #eee'
                        }}
                    >
                        {currentFrame && currentFrame.grid ? (
                            currentFrame.grid.map((row, rIndex) => (
                                row.map((val, cIndex) => (
                                    <div
                                        key={`${rIndex}-${cIndex}`}
                                        className="heatmap-cell"
                                        style={{ backgroundColor: getCellColor(val) }}
                                        title={`Val: ${val}`}
                                    />
                                ))
                            ))
                        ) : (
                            <div style={{width: 300, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                No Frame Data
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#555' }}>
                             <span>{currentFrame ? currentFrame.time : "--:--:--"}</span>
                             <span>Frame: {playbackIndex + 1} / {matrixFrames.length}</span>
                         </div>
                         
                         <input 
                            type="range" 
                            min="0" 
                            max={matrixFrames.length - 1} 
                            value={playbackIndex} 
                            onChange={handleSliderChange}
                            style={{ width: '100%', cursor: 'pointer' }}
                         />

                         <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                             <Button onClick={togglePlay} variant="primary" style={{ width: '120px' }}>
                                 {isPlaying ? "PAUSE" : "PLAY"}
                             </Button>
                         </div>
                    </div>
                </div>
            </Card>
        )}


        <Card 
            className="timeline-card" 
            title="Telemetry Graph" 
            titleClassName="info-label"
            headerAction={
                <Button 
                   onClick={handleDownloadCsv}
                   variant="outline"
                   style={{ fontSize: '12px', padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                     <polyline points="7 10 12 15 17 10"></polyline>
                     <line x1="12" y1="15" x2="12" y2="3"></line>
                   </svg>
                   Download CSV
                </Button>
            }
        >
          <div className="timeline-placeholder" style={{ height: '400px', display: 'block' }}>
            {telemetry.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={telemetry}>
                        <XAxis dataKey="time" minTickGap={50} stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="distance" stroke="#2563eb" dot={false} strokeWidth={2} activeDot={{ r: 6 }} connectNulls />
                        <Line type="monotone" dataKey="temperature" stroke="#dc2626" dot={false} strokeWidth={2} connectNulls />
                        <Line type="monotone" dataKey="humidity" stroke="#16a34a" dot={false} strokeWidth={2} connectNulls />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <div style={{ textAlign: 'center', paddingTop: '150px' }}>
                  <p style={{ color: '#666' }}>No sensor data recorded for this session.</p>
                </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};