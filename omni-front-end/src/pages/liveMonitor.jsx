import React from "react";
import "../css/liveMonitor.css";

export const LiveMonitor = () => (
  <div
    className="live-monitor-wrapper"
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      height: "100%",
      width: "100%",
    }}
  >
    <div className="monitor-grid" style={{ display: "flex", gap: "20px", flex: 1 }}>
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
        className="card"
      >
        <p style={{ fontSize: "12px", fontWeight: "bold", color: "#888" }}>
          HEATMAP (32x32)
        </p>
        <div className="heatmap-box" style={{ flex: 1 }}>
          [ Heatmap Grid ]
        </div>
      </div>
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
        className="card"
      >
        <p style={{ fontSize: "12px", fontWeight: "bold", color: "#888" }}>
          AI Predict Skeleton
        </p>
        <div className="skeleton-box" style={{ flex: 1 }}>
          Skeleton Overlay
        </div>
      </div>
    </div>
    <div className="card" style={{ flex: "0 0 150px" }}>
      <p style={{ fontSize: "12px", fontWeight: "bold", color: "#888" }}>
        CURRENT POSE
      </p>
      <h2 style={{ color: "var(--seafoam-main)" }}>Tree Pose</h2>
      <p style={{ fontSize: "12px", fontWeight: "bold", color: "#888" }}>
        SIGNAL TIMELINE
      </p>
      <div style={{ height: "80px", borderBottom: "1px solid #eee" }}></div>
    </div>
  </div >
);
