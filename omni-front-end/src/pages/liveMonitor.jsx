import React from "react";
import "../css/liveMonitor.css";

export const LiveMonitor = () => {

  return (
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
      <div className="card" style={{ flex: "0 0 auto" }}>
        <p style={{ fontSize: "12px", fontWeight: "bold", color: "#888" }}>
          CURRENT POSE
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
          <h2 style={{ color: "var(--seafoam-main)", margin: "0" }}>Tree Pose</h2>
        </div>
        <div style={{ marginTop: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#888", marginBottom: "4px" }}>
            <span>AI Predict Pose</span>
            <span>98%</span>
          </div>
          <div style={{ width: "100%", height: "8px", background: "#eee", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ width: "98%", height: "100%", background: "var(--seafoam-main)", borderRadius: "4px" }}></div>
          </div>
        </div>
      </div>

      <div className="card" style={{ flex: "0 0 120px" }}>
        <p style={{ fontSize: "12px", fontWeight: "bold", color: "#888" }}>
          SIGNAL TIMELINE
        </p>
        <div style={{ height: "80px", borderBottom: "1px solid #eee" }}></div>
      </div>
    </div >
  )
};
