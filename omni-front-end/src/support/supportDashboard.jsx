import React from "react";
import "../css/supportDashboard.css";

export const SupportDashboard = () => {
    return (
        <div className="support-dashboard-container">
            <div className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-icon icon-blue">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                            <line x1="7" y1="7" x2="7.01" y2="7"></line>
                        </svg>
                    </div>
                    <span className="metric-label">Labeled Samples</span>
                    <h3 className="metric-value">12,847</h3>
                    <span className="metric-trend">+450 this week</span>
                </div>

                <div className="metric-card">
                    <div className="metric-icon icon-purple">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                            <path d="M12 2a10 10 0 0 1 10 10H12V2z"></path>
                            <path d="M2 12a10 10 0 0 0 10 10V12H2z"></path>
                        </svg>
                    </div>
                    <span className="metric-label">Active Models</span>
                    <h3 className="metric-value">3</h3>
                    <span className="metric-trend">2 in training</span>
                </div>

                <div className="metric-card">
                    <div className="metric-icon icon-green">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                            <polyline points="17 6 23 6 23 12"></polyline>
                        </svg>
                    </div>
                    <span className="metric-label">Best Accuracy</span>
                    <h3 className="metric-value">94.2%</h3>
                    <span className="metric-trend">Pose Recognition v3</span>
                </div>

                <div className="metric-card">
                    <div className="metric-icon icon-orange">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                            <path d="M3 5v14c0 1.66 4 3 9 3s 9-1.34 9-3V5"></path>
                        </svg>
                    </div>
                    <span className="metric-label">Training Datasets</span>
                    <h3 className="metric-value">8</h3>
                    <span className="metric-trend">245 GB total</span>
                </div>
            </div>

            <div className="dashboard-sections-grid">
                <div className="section-card">
                    <h3 className="section-title">Quick Actions</h3>

                    <div className="quick-action-item">
                        <div className="action-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                                <line x1="7" y1="7" x2="7.01" y2="7"></line>
                            </svg>
                        </div>
                        <div className="action-content">
                            <h4>Start Labeling Session</h4>
                            <p>Label real-time data streams</p>
                        </div>
                    </div>

                    <div className="quick-action-item">
                        <div className="action-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                            </svg>
                        </div>
                        <div className="action-content">
                            <h4>Start Training Job</h4>
                            <p>Train a new pose recognition model</p>
                        </div>
                    </div>

                    <div className="quick-action-item">
                        <div className="action-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                <polyline points="17 6 23 6 23 12"></polyline>
                            </svg>
                        </div>
                        <div className="action-content">
                            <h4>Review Model Performance</h4>
                            <p>Analyze confusion matrices and metrics</p>
                        </div>
                    </div>
                </div>

                <div className="section-card">
                    <h3 className="section-title">Recent Training Jobs</h3>

                    <div className="training-job-item">
                        <div className="job-header">
                            <span className="job-name">Pose Recognition v4</span>
                            <span className="job-status status-training">training</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: '60%' }}></div>
                        </div>
                        <div className="job-time">2h ago</div>
                    </div>

                    <div className="training-job-item">
                        <div className="job-header">
                            <span className="job-name">Balance Classifier v2</span>
                            <span className="job-status status-completed">completed</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: '100%' }}></div>
                        </div>
                        <div className="job-time">8h ago</div>
                    </div>

                    <div className="training-job-item">
                        <div className="job-header">
                            <span className="job-name">Pose Recognition v3</span>
                            <span className="job-status status-completed">completed</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: '100%' }}></div>
                        </div>
                        <div className="job-time">2 days ago</div>
                    </div>
                </div>
            </div>

            <div className="datasets-section">
                <h3 className="section-title">Available Training Datasets</h3>
                <div className="datasets-grid">
                    <div className="dataset-card">
                        <h4 className="dataset-title">Yoga Poses - Full</h4>
                        <div className="dataset-stat-row">
                            <span>Samples</span>
                            <span className="dataset-stat-value">8,450</span>
                        </div>
                        <div className="dataset-stat-row">
                            <span>Labels</span>
                            <span className="dataset-stat-value">12</span>
                        </div>
                        <div className="dataset-stat-row">
                            <span>Size</span>
                            <span className="dataset-stat-value">52 GB</span>
                        </div>
                    </div>

                    <div className="dataset-card">
                        <h4 className="dataset-title">Balance Training</h4>
                        <div className="dataset-stat-row">
                            <span>Samples</span>
                            <span className="dataset-stat-value">3,200</span>
                        </div>
                        <div className="dataset-stat-row">
                            <span>Labels</span>
                            <span className="dataset-stat-value">5</span>
                        </div>
                        <div className="dataset-stat-row">
                            <span>Size</span>
                            <span className="dataset-stat-value">18 GB</span>
                        </div>
                    </div>

                    <div className="dataset-card">
                        <h4 className="dataset-title">Physical Therapy</h4>
                        <div className="dataset-stat-row">
                            <span>Samples</span>
                            <span className="dataset-stat-value">5,670</span>
                        </div>
                        <div className="dataset-stat-row">
                            <span>Labels</span>
                            <span className="dataset-stat-value">8</span>
                        </div>
                        <div className="dataset-stat-row">
                            <span>Size</span>
                            <span className="dataset-stat-value">34 GB</span>
                        </div>
                    </div>

                    <div className="dataset-card">
                        <h4 className="dataset-title">Sports Movements</h4>
                        <div className="dataset-stat-row">
                            <span>Samples</span>
                            <span className="dataset-stat-value">12,400</span>
                        </div>
                        <div className="dataset-stat-row">
                            <span>Labels</span>
                            <span className="dataset-stat-value">20</span>
                        </div>
                        <div className="dataset-stat-row">
                            <span>Size</span>
                            <span className="dataset-stat-value">78 GB</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
