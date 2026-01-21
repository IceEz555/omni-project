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
              <div className="session-time-text">{event.time}</div>
              <div className="session-list-current-pose">
                Pose: <span className="session-pose-label">{event.pose}</span>
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
            <p className="info-label mb-8">POSE AI Predict</p>
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

        <div className="card pose-stats-card">
          <h2>Pose Statistics</h2>
          <div className="pose-stats-container">
            {/* Chart Section */}
            <div className="chart-container">
              <div className="y-axis-label">Duration</div>
              <div className="y-axis">
                <span>800</span>
                <span>400</span>
                <span>200</span>
                <span>0</span>
              </div>
              <div className="chart-area">
                <div className="x-grid-lines">
                  <div className="grid-line"></div>
                  <div className="grid-line"></div>
                  <div className="grid-line"></div>
                  <div className="grid-line-base"></div>
                </div>

                <div className="bar-group-container">
                  <div className="bar-group">
                    <div className="bar primary" style={{ height: "100%" }} title="720s"></div>
                    <div className="bar secondary" style={{ height: "1px" }}></div>
                    <div className="x-label">Downward Dog</div>
                  </div>

                  <div className="bar-group">
                    <div className="bar primary" style={{ height: "80%" }} title="600s"></div>
                    <div className="bar secondary" style={{ height: "1px" }}></div>
                    <div className="x-label">Tree Pose</div>
                  </div>

                  <div className="bar-group">
                    <div className="bar primary" style={{ height: "60%" }} title="450s"></div>
                    <div className="bar secondary" style={{ height: "1px" }}></div>
                    <div className="x-label">Warrior Pose</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color primary"></div>
                <span>Time (seconds)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color secondary"></div>
                <span>Count</span>
              </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="stat-cards-grid">
              <div className="stat-card">
                <h3>Downward Dog</h3>
                <div className="stat-row">
                  <span className="stat-label">Duration:</span>
                  <span className="stat-val">0h 12m 0s</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Count:</span>
                  <span className="stat-val">4 times</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Avg:</span>
                  <span className="stat-val">0h 3m 0s</span>
                </div>
              </div>

              <div className="stat-card">
                <h3>Tree Pose</h3>
                <div className="stat-row">
                  <span className="stat-label">Duration:</span>
                  <span className="stat-val">0h 10m 0s</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Count:</span>
                  <span className="stat-val">3 times</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Avg:</span>
                  <span className="stat-val">0h 3m 20s</span>
                </div>
              </div>

              <div className="stat-card">
                <h3>Warrior Pose</h3>
                <div className="stat-row">
                  <span className="stat-label">Duration:</span>
                  <span className="stat-val">0h 7m 30s</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Count:</span>
                  <span className="stat-val">2 times</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Avg:</span>
                  <span className="stat-val">0h 3m 45s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};