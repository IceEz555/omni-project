import React, { useState, useEffect } from "react";
import api from "../api/axios";
import "../css/userManagement.css";
import "../css/userManagement.css";
// import "../css/modal.css"; // Replaced by Common Modal
import { Button } from "../components/common/Button";
import { Input, Select } from "../components/common/Input";
import { Modal } from "../components/common/Modal";

export const DeviceInventory = () => {
    const [deviceList, setDeviceList] = useState([]);
    const [profileList, setProfileList] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [showForm, setShowForm] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        device_name: "",
        serial_number: "",
        profile_id: "",
        project_name: ""
    });

    const fetchDevices = async () => {
        try {
            const response = await api.get("/admin/get-devices");
            setDeviceList(response.data);
        } catch (error) {
            console.error("Failed to fetch devices:", error);
        }
    };

    const fetchProfiles = async () => {
        try {
            const response = await api.get("/admin/get-device-profiles");
            setProfileList(response.data);
        } catch (error) {
            console.error("Failed to fetch profiles:", error);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await api.get("/admin/get-projects");
            setProjectList(response.data);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchDevices();
        fetchProfiles();
        fetchProjects();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this device?")) {
            try {
                await api.delete(`/admin/delete-device/${id}`);
                fetchDevices();
            } catch (error) {
                console.error("Failed to delete device:", error);
                alert("Failed to delete device");
            }
        }
    };

    const [editingId, setEditingId] = useState(null);

    const handleEdit = (device) => {
        setEditingId(device.id);
        const selectedProfile = profileList.find(p => p.name === device.profileName);
        setShowForm(true);
        setFormData({
            device_name: device.name,
            serial_number: device.serialNumber,
            profile_id: selectedProfile ? selectedProfile.id : "", // Need Profile ID, hope we have it
            project_name: device.project && device.project !== "-" ? device.project : ""
        });
    };

    const handleSubmit = async () => {
        try {
            if (!formData.device_name || !formData.profile_id) {
                alert("Device Name and Profile are required");
                return;
            }

            const payload = {
                device_name: formData.device_name,
                serial_number: formData.serial_number,
                profile_id: formData.profile_id,
                project_name: formData.project_name || null
            };

            if (editingId) {
                await api.put(`/admin/update-device/${editingId}`, payload);
                alert("Device updated successfully!");
            } else {
                await api.post("/admin/create-device", payload);
                alert("Device created successfully!");
            }

            resetForm();
            fetchDevices();
        } catch (error) {
            console.error("Failed to save device:", error);
            alert("Failed to save device: " + (error.response?.data?.message || error.message));
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            device_name: "",
            serial_number: "",
            profile_id: "",
            project_name: ""
        });
    };

    return (
        <div>
            <div className="user-management-header device-inventory-header">
                <div>
                    <h2 className="header-title">Device Inventory</h2>
                    <p className="header-subtitle">Manage physical devices and assign them to projects</p>
                </div>
                {!showForm && (
                    <Button
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                        className="add-user-btn btn-add-device"
                    >
                        + Add Device
                    </Button>
                )}
            </div>

            <Modal
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                title={editingId ? "Edit Device" : "Register New Device"}
                footer={
                    <>
                        <Button
                            onClick={handleSubmit}
                            variant="primary"
                            className="color-btn"
                        >
                            {editingId ? "Update Device" : "Create Device"}
                        </Button>
                        <Button
                            onClick={resetForm}
                            variant="secondary"
                        >
                            Cancel
                        </Button>
                    </>
                }
            >
                <div className="add-user-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {/* Device Name */}
                    <div>
                        <Input
                            label="Device Name (Friendly)"
                            name="device_name"
                            placeholder="e.g., Living Room Sensor"
                            value={formData.device_name}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Serial Number / Hardware ID */}
                    <div>
                        <Input
                            label="Hardware ID (Serial Number)"
                            name="serial_number"
                            placeholder="e.g., Arduino_Ult_01"
                            value={formData.serial_number}
                            onChange={handleInputChange}
                        />
                        <small className="helper-text" style={{ display: 'block', marginTop: '-12px', marginBottom: '16px', color: '#666', fontSize: '12px' }}>Must match the ID in your Arduino Code</small>
                    </div>

                    {/* Device Profile */}
                    <div>
                        <Select
                            label="Device Profile (Type)"
                            name="profile_id"
                            value={formData.profile_id}
                            onChange={handleInputChange}
                            options={[
                                { value: "", label: "Select Profile" }, // Default option
                                ...profileList.map(profile => ({
                                    value: profile.id,
                                    label: `${profile.name} (Type: ${profile.type || 'N/A'})`
                                }))
                            ]}
                        />
                    </div>

                    {/* Assign to Project */}
                    <div>
                        <Select
                            label="Assign to Project (Optional)"
                            name="project_name"
                            value={formData.project_name}
                            onChange={handleInputChange}
                            options={[
                                { value: "", label: "Select Project" },
                                ...projectList.map(project => ({
                                    value: project.name,
                                    label: project.name
                                }))
                            ]}
                        />
                    </div>
                </div>
            </Modal>

            <div className="user-table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Device Name</th>
                            <th>Hardware ID</th>
                            <th>Profile</th>
                            <th>Project</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deviceList.map((device) => (
                            <tr key={device.id}>
                                <td>
                                    <strong>{device.name}</strong>
                                </td>
                                <td>
                                    <code>{device.serialNumber || '-'}</code>
                                </td>
                                <td>{device.profileName}</td>
                                <td>{device.project}</td>
                                <td>
                                    <span className={`status-badge ${device.status}`}>
                                        {device.status}
                                    </span>
                                </td>
                                <td>{new Date(device.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <Button
                                        className="table-action-btn"
                                        aria-label="Edit"
                                        onClick={() => handleEdit(device)}
                                        variant="outline"
                                        style={{ marginRight: '8px', padding: '4px 8px' }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                    </Button>
                                    <Button
                                        className="table-action-btn"
                                        aria-label="Delete"
                                        onClick={() => handleDelete(device.id)}
                                        variant="outline"
                                        style={{ padding: '4px 8px', color: '#e74c3c' }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {deviceList.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No devices found. Add one to get started.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
