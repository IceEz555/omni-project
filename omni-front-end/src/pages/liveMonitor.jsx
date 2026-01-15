import React from "react";
import "../css/liveMonitor.css";

export const LiveMonitor = () => {
  return (
    <div className="live-monitor-wrapper monitor-wrapper">
      <div className="monitor-grid" style={{ display: "flex", gap: "20px", flex: 1 }}>
        <div className="card monitor-column">
          <p className="card-header">HEATMAP (32x32)</p>
          <div className="heatmap-box" style={{ flex: 1 }}>
            [ Heatmap Grid ]
          </div>
        </div>
        <div className="card monitor-column">
          <p className="card-header">AI Predict Skeleton</p>
          <div className="skeleton-box" style={{ flex: 1 }}>
            Skeleton Overlay
          </div>
        </div>
      </div>

      <div className="card card-current-pose">
        <p className="card-header">CURRENT POSE</p>
        <div className="pose-display">
          <h2 className="pose-title">Tree Pose</h2>
        </div>
        <div className="confidence-section">
          <div className="confidence-header">
            <span>AI Predict Pose</span>
            <span>98%</span>
          </div>
          <div className="confidence-track">
            <div className="confidence-fill" style={{ width: "98%" }}></div>
          </div>
        </div>
      </div>

      <div className="card card-signal">
        <p className="card-header">SIGNAL TIMELINE</p>
        <div className="signal-placeholder"></div>
      </div>
    </div >
  )
};
