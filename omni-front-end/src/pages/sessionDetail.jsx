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

      <div className="session-main-content">
        <div className="card">
          <h2>Session Details</h2>
          <div className="session-info-row">
            <div>
              <p className="info-label">DURATION</p>
              <p className="info-value">{selectedEvent.duration}</p>
            </div>
            <div>
              <p className="info-label">DEVICE</p>
              <p className="info-value">Yoga Mat #01</p>
            </div>
          </div>

          <div className="pose-breakdown-section">
            <p className="info-label" style={{ marginBottom: "8px" }}>POSE AI Predict</p>
            <div className="pose-breakdown-list">
              <div className="pose-breakdown-item">
                <span className="pose-name">Tree Pose</span>
                <div className="pose-bar-track">
                  <div className="pose-bar-fill" style={{ width: `${selectedEvent.accuracy.tree}%` }}></div>
                </div>
                <span>{selectedEvent.accuracy.tree}%</span>
              </div>
              <div className="pose-breakdown-item">
                <span className="pose-name">Warrior</span>
                <div className="pose-bar-track">
                  <div className="pose-bar-fill" style={{ width: `${selectedEvent.accuracy.warrior}%` }}></div>
                </div>
                <span>{selectedEvent.accuracy.warrior}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card timeline-card">
          <p className="info-label">TIMELINE PLAYBACK</p>
          <div className="timeline-placeholder">
            [ Signal Graph Placeholder for {selectedEvent.pose} ]
          </div>
        </div>
      </div>
    </div>
  );
};