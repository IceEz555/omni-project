import React, { useState } from "react";
import "../css/modelTraining.css";
// import "../css/modal.css"; // Not strictly needed if we aren't using modal, but good to know
import { Button } from "../components/common/Button";
import { Input, Select } from "../components/common/Input";
import { Card } from "../components/common/Card";

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
            <div className="model-training-header">
                <div>
                    <h1>Model Training</h1>
                    <p>Configure and monitor model training jobs</p>
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
                <div className="metric-placeholder-card">
                    <span className="metric-title">Confusion</span>
                    <span className="metric-subtitle">Matrix</span>
                </div>
            </>)}
        </div>
    );
};
