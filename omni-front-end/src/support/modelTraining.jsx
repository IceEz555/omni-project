import React from "react";
import "../css/modelTraining.css";

export const ModelTraining = () => {
    return (
        <div className="model-training-container">
            <div className="model-training-header">
                <div className="header-text">
                    <h2 className="training-dashboard-title">Model Training</h2>
                    <p className="training-dashboard-subtitle">Configure and monitor model training jobs</p>
                </div>
                <button className="start-training-btn">
                    <span className="play-icon">▷</span> Start New Training
                </button>
            </div>

            {/* Controls Section */}
            <div className="controls-section">
                <div className="controls-row">
                    <div className="control-group">
                        <label className="control-label">Dataset</label>
                        <select className="control-select" defaultValue="yoga">
                            <option value="yoga">Yoga Poses Dataset</option>
                            <option value="gym">Gym Exercises Dataset</option>
                        </select>
                    </div>
                    <div className="control-group">
                        <label className="control-label">Model</label>
                        <select className="control-select" defaultValue="cnn_v2">
                            <option value="cnn_v1">CNN Classifier v1</option>
                            <option value="cnn_v2">CNN Classifier v2</option>
                            <option value="resnet">ResNet50 Transfer</option>
                        </select>
                    </div>
                </div>

                <div className="train-button-container">
                    <button className="train-button">Train Model</button>
                </div>
            </div>

            {/* Progress Section */}
            <div className="progress-section">
                <h3 className="section-label">Training Progress</h3>
                <div className="training-progress-bar-container">
                    <div className="training-progress-fill"></div>
                </div>
                <div className="epoch-text">Epoch 75/100</div>
            </div>

            {/* Metrics Section */}
            <div className="metrics-section">
                <div className="metric-placeholder-card">
                    <span className="metric-title">Accuracy</span>
                    <span className="metric-subtitle">(Line Graph)</span>
                </div>
                <div className="metric-placeholder-card">
                    <span className="metric-title">Loss</span>
                    <span className="metric-subtitle">(Line Graph)</span>
                </div>
                <div className="metric-placeholder-card">
                    <span className="metric-title">Confusion</span>
                    <span className="metric-subtitle">Matrix</span>
                </div>
            </div>
        </div>
    );
};
