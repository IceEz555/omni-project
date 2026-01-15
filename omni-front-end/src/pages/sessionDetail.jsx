import React, { useState } from "react";
import { sessionEvents } from "../mock/data.jsx";
import "../css/session.css";

export const SessionDetail = () => {
  const [selectedEvent, setSelectedEvent] = useState(sessionEvents[0]);
  return (
    <div className="session-detail-container">
      <div className="session-list-sidebar">
        <div className="session-list-header">Session List</div>
        <div className="session-list-content">
          {sessionEvents.map((event) => (
            <div
              key={event.id}
              className={`session-list-item ${selectedEvent.id === event.id ? "selected" : ""}`}
              onClick={() => setSelectedEvent(event)}
            >
              <div style={{ fontWeight: "500" }}>{event.time}</div>
              <div className="session-list-current-pose">
                Pose: <span style={{ color: "var(--seafoam-main)" }}>{event.pose}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
        <div className="card">
          <h2>Session Details</h2>
          <div style={{ display: "flex", gap: "40px", marginTop: "16px" }}>
            <div>
              <p style={{ color: "#888", fontSize: "12px", marginBottom: "4px" }}>DURATION</p>
              <p style={{ fontSize: "1.2em", fontWeight: "bold" }}>{selectedEvent.duration}</p>
            </div>
            <div>
              <p style={{ color: "#888", fontSize: "12px", marginBottom: "4px" }}>DEVICE</p>
              <p style={{ fontSize: "1.2em", fontWeight: "bold" }}>Yoga Mat #01</p>
            </div>
          </div>

          <div style={{ marginTop: "24px" }}>
            <p style={{ color: "#888", fontSize: "12px", marginBottom: "8px" }}>POSE AI Predict</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ width: "80px" }}>Tree Pose</span>
                <div style={{ flex: 1, height: "8px", background: "#eee", borderRadius: "4px" }}>
                  <div style={{ width: `${selectedEvent.accuracy.tree}%`, height: "100%", background: "#ccc", borderRadius: "4px" }}></div>
                </div>
                <span>{selectedEvent.accuracy.tree}%</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ width: "80px" }}>Warrior</span>
                <div style={{ flex: 1, height: "8px", background: "#eee", borderRadius: "4px" }}>
                  <div style={{ width: `${selectedEvent.accuracy.warrior}%`, height: "100%", background: "#ccc", borderRadius: "4px" }}></div>
                </div>
                <span>{selectedEvent.accuracy.warrior}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <p style={{ color: "#888", fontSize: "12px" }}>TIMELINE PLAYBACK</p>
          <div style={{ flex: 1, minHeight: "150px", background: "#f9f9f9", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}>
            [ Signal Graph Placeholder for {selectedEvent.pose} ]
          </div>
        </div>
      </div>
    </div>
  );
};