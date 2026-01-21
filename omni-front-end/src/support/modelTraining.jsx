import React, { useState } from "react";
import "../css/modelTraining.css";


export const ModelTraining = () => {
    const [showForm, setShowForm] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

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
            {/* Header Section */}
            <div className="model-training-header">
                <div>
                    <h1>Model Training</h1>
                    <p>Configure and monitor model training jobs</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="start-new-training-btn"
                    >
                        <span>▶</span> Start New Training
                    </button>
                )}
            </div>

            {/* Configure New Training Job Form */}
            {showForm && (
                <div className="training-form-container">
                    <h2 className="training-form-title">Configure New Training Job</h2>

                    <div className="training-form-grid">
                        {/* Model Name */}
                        <div>
                            <label className="form-group-label">Model Name</label>
                            <input
                                type="text"
                                name="modelName"
                                placeholder="e.g., Pose Recognition v5"
                                value={formData.modelName}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>

                        {/* Model Architecture */}
                        <div>
                            <label className="form-group-label">Model Architecture</label>
                            <select
                                name="architecture"
                                value={formData.architecture}
                                onChange={handleInputChange}
                                className="form-select"
                            >
                                <option>CNN (Convolutional Neural Network)</option>
                                <option>RNN (Recurrent Neural Network)</option>
                                <option>Transformer</option>
                            </select>
                        </div>

                        {/* Training Dataset */}
                        <div>
                            <label className="form-group-label">Training Dataset</label>
                            <select
                                name="dataset"
                                value={formData.dataset}
                                onChange={handleInputChange}
                                className="form-select"
                            >
                                <option value="">-- Select Dataset --</option>
                                <option value="dataset1">Pose Data 2023</option>
                                <option value="dataset2">Hand Gestures V2</option>
                            </select>
                        </div>

                        {/* Validation Split */}
                        <div>
                            <label className="form-group-label">Validation Split</label>
                            <select
                                name="validationSplit"
                                value={formData.validationSplit}
                                onChange={handleInputChange}
                                className="form-select"
                            >
                                <option>80/20 (Train/Val)</option>
                                <option>70/30 (Train/Val)</option>
                                <option>90/10 (Train/Val)</option>
                            </select>
                        </div>

                        {/* Epochs */}
                        <div>
                            <label className="form-group-label">Epochs</label>
                            <input
                                type="number"
                                name="epochs"
                                value={formData.epochs}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>

                        {/* Batch Size */}
                        <div>
                            <label className="form-group-label">Batch Size</label>
                            <input
                                type="number"
                                name="batchSize"
                                value={formData.batchSize}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>

                        {/* Learning Rate */}
                        <div>
                            <label className="form-group-label">Learning Rate</label>
                            <input
                                type="number"
                                step="0.001"
                                name="learningRate"
                                value={formData.learningRate}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>

                        {/* Optimizer */}
                        <div>
                            <label className="form-group-label">Optimizer</label>
                            <select
                                name="optimizer"
                                value={formData.optimizer}
                                onChange={handleInputChange}
                                className="form-select"
                            >
                                <option>Adam</option>
                                <option>SGD</option>
                                <option>RMSprop</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: "24px" }}>
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="advanced-options-toggle"
                        >
                            <span className={`toggle-icon ${showAdvanced ? "expanded" : ""}`}>▶</span> Advanced Options
                        </button>

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
                        <button
                            onClick={handleStartTraining}
                            className="start-training-btn"
                        >
                            Start Training
                        </button>
                        <button
                            onClick={() => setShowForm(false)}
                            className="cancel-btn"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
