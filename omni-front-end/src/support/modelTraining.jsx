import React, { useState } from "react";
import "../css/modelTraining.css";
import { Button } from "../components/common/Button";
import { Input, Select } from "../components/common/Input";
import { Card } from "../components/common/Card";

export const ModelTraining = () => {
    const [showForm, setShowForm] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Mock data for recent jobs
    const [recentJobs] = useState([
        { id: "J-1024", model: "Pose Recognition v6", status: "Running", progress: 45, epoch: "45/100", accuracy: "92.5%", started: "2 mins ago" },
        { id: "J-1023", model: "Hand Gesture v2.1", status: "Completed", progress: 100, epoch: "150/150", accuracy: "95.8%", started: "5 hours ago" },
        { id: "J-1022", model: "Pose Recognition v5", status: "Completed", progress: 100, epoch: "100/100", accuracy: "94.2%", started: "2 days ago" },
        { id: "J-1021", model: "Experimental CNN", status: "Failed", progress: 12, epoch: "12/50", accuracy: "-", started: "3 days ago" },
    ]);

    // Placeholder handlers for form inputs
    const [formData, setFormData] = useState({
        modelName: "",
        architecture: "CNN (Convolutional Neural Network)",
        dataset: "",
        validationSplit: "80/20 (Train/Val)",
        epochs: 100,
        batchSize: 32,
        learningRate: 0.001,
        optimizer: "Adam",
        earlyStopping: false,
        learningRateScheduler: false,
        dataAugmentation: true,
        saveBestModel: true
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleStartTraining = () => {
        console.log("Starting training with:", formData);
        // Add actual training trigger logic here
        setShowForm(false);
        setShowAdvanced(false);
    };

    return (
        <div className="model-training-container">
            <div className="model-training-header">
                <div>
                    <h1>Model Training</h1>
                    <p className="page-description">
                        Configure neural network architectures and train models using labeled datasets.
                        Transform raw data into predictive intelligence.
                    </p>
                </div>
                {!showForm && (
                    <Button
                        onClick={() => setShowForm(true)}
                        className="start-new-training-btn"
                    >
                        ▶ Start New Training
                    </Button>
                )}
            </div>

            {/* Recent Training Jobs List (Show when NOT in form mode) */}
            {!showForm && (
                <Card title="Recent Training Jobs" className="jobs-card">
                    <div className="table-responsive">
                        <table className="training-table">
                            <thead>
                                <tr>
                                    <th>Job ID</th>
                                    <th>Model Name</th>
                                    <th>Status</th>
                                    <th>Progress (Epochs)</th>
                                    <th>Current Accuracy</th>
                                    <th>Started</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentJobs.map((job) => (
                                    <tr key={job.id}>
                                        <td className="job-id">#{job.id}</td>
                                        <td className="fw-500">{job.model}</td>
                                        <td>
                                            <span className={`status-badge ${job.status.toLowerCase()}`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="progress-col">
                                            <div className="training-progress-container">
                                                <div className="training-progress-bar">
                                                    <div
                                                        className={`training-progress-fill ${job.status.toLowerCase()}`}
                                                        style={{ width: `${job.progress}%` }}
                                                    ></div>
                                                </div>
                                                <span className="training-progress-text">{job.epoch}</span>
                                            </div>
                                        </td>
                                        <td>{job.accuracy}</td>
                                        <td><span className="text-gray">{job.started}</span></td>
                                        <td>
                                            <Button className="action-btn-icon" onClick={() => console.log("View", job.id)}>
                                                View
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Configure New Training Job Form */}
            {showForm && (<>
                <Card className="training-form-container" title="Configure New Training Job" titleClassName="training-form-title">

                    <div className="training-form-grid">
                        {/* Model Name */}
                        <div>
                            <Input
                                label="Model Name"
                                type="text"
                                name="modelName"
                                placeholder="e.g., Pose Recognition v5"
                                value={formData.modelName}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Model Architecture */}
                        <div>
                            <Select
                                label="Model Architecture"
                                name="architecture"
                                value={formData.architecture}
                                onChange={handleInputChange}
                                options={[
                                    { value: "CNN (Convolutional Neural Network)", label: "CNN (Convolutional Neural Network)" },
                                    { value: "RNN (Recurrent Neural Network)", label: "RNN (Recurrent Neural Network)" },
                                    { value: "Transformer", label: "Transformer" }
                                ]}
                            />
                        </div>

                        {/* Training Dataset */}
                        <div>
                            <Select
                                label="Training Dataset"
                                name="dataset"
                                value={formData.dataset}
                                onChange={handleInputChange}
                                options={[
                                    { value: "", label: "-- Select Dataset --" },
                                    { value: "dataset1", label: "Pose Data 2023" },
                                    { value: "dataset2", label: "Hand Gestures V2" }
                                ]}
                            />
                        </div>

                        {/* Validation Split */}
                        <div>
                            <Select
                                label="Validation Split"
                                name="validationSplit"
                                value={formData.validationSplit}
                                onChange={handleInputChange}
                                options={[
                                    { value: "80/20 (Train/Val)", label: "80/20 (Train/Val)" },
                                    { value: "70/30 (Train/Val)", label: "70/30 (Train/Val)" },
                                    { value: "90/10 (Train/Val)", label: "90/10 (Train/Val)" }
                                ]}
                            />
                        </div>

                        {/* Epochs */}
                        <div>
                            <Input
                                label="Epochs"
                                type="number"
                                name="epochs"
                                value={formData.epochs}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Batch Size */}
                        <div>
                            <Input
                                label="Batch Size"
                                type="number"
                                name="batchSize"
                                value={formData.batchSize}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Learning Rate */}
                        <div>
                            <Input
                                label="Learning Rate"
                                type="number"
                                step="0.001"
                                name="learningRate"
                                value={formData.learningRate}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Optimizer */}
                        <div>
                            <Select
                                label="Optimizer"
                                name="optimizer"
                                value={formData.optimizer}
                                onChange={handleInputChange}
                                options={[
                                    { value: "Adam", label: "Adam" },
                                    { value: "SGD", label: "SGD" },
                                    { value: "RMSprop", label: "RMSprop" }
                                ]}
                            />
                        </div>
                    </div>

                    <div className="advanced-options-wrapper">
                        <Button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="advanced-options-toggle"
                            variant="text" // Assuming text variant or reset via class
                            style={{ padding: 0, textAlign: 'left', fontWeight: 600, color: '#4b5563' }}
                        >
                            <span className={`toggle-icon ${showAdvanced ? "expanded" : ""}`}>▶</span> Advanced Options
                        </Button>

                        {showAdvanced && (
                            <div className="advanced-options-grid">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="earlyStopping"
                                        checked={formData.earlyStopping}
                                        onChange={handleInputChange}
                                        className="checkbox-input"
                                    />
                                    Early Stopping
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="dataAugmentation"
                                        checked={formData.dataAugmentation}
                                        onChange={handleInputChange}
                                        className="checkbox-input accent"
                                    />
                                    Data Augmentation
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="learningRateScheduler"
                                        checked={formData.learningRateScheduler}
                                        onChange={handleInputChange}
                                        className="checkbox-input"
                                    />
                                    Learning Rate Scheduler
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="saveBestModel"
                                        checked={formData.saveBestModel}
                                        onChange={handleInputChange}
                                        className="checkbox-input accent"
                                    />
                                    Save Best Model Only
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <Button
                            onClick={handleStartTraining}
                            className="start-training-btn"
                        >
                            Start Training
                        </Button>
                        <Button
                            onClick={() => setShowForm(false)}
                            className="cancel-btn"
                            variant="secondary"
                        >
                            Cancel
                        </Button>
                    </div>
                </Card>

                {/* Visual Placeholder for training (removed confusion matrix as it was confusing here) */}
                <div className="metric-placeholder-card">
                    <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '3rem', display: 'block' }}>📈</span>
                        <span className="metric-title">Live Training Metrics</span>
                        <span className="metric-subtitle">Loss & Accuracy Curves will appear here during training</span>
                    </div>
                </div>
            </>)}
        </div>
    );
};
