import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../css/projectDetails.css";
// import "../css/modal.css"; // Replaced by Common Modal
import { Button } from "../components/common/Button";
import { Input, Select } from "../components/common/Input";
import { Modal } from "../components/common/Modal";
import { Card } from "../components/common/Card";

// Helper for formatting time
const formatTime = (isoString) => {
    if (!isoString) return "Never";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Threshold for Online Status
const IS_ONLINE_THRESHOLD_MS = 60000; // 1 minute

export const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Data State
    const [projectDevices, setProjectDevices] = useState([]);
    const [pageTitle, setPageTitle] = useState("Device Inventory");
    const [isLoading, setIsLoading] = useState(true);

    // Add Device Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [profileList, setProfileList] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [newDeviceData, setNewDeviceData] = useState({
        device_name: "",
        serial_number: "",
        profile_id: "",
        project_name: ""
    });

    const fetchProjectData = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data: allDevices } = await api.get("/admin/get-devices");

            // Logic: 'id' in URL is Profile ID (Profile Key)
            const devicesInProfile = allDevices.filter(d => d.profileKey === id);

            let targetDevices = [];
            let title = "Unknown Profile";

            if (devicesInProfile.length > 0) {
                targetDevices = devicesInProfile;
                title = devicesInProfile[0].profileName || id;
                // If we found devices, set the default profile_id for adding new ones
                setNewDeviceData(prev => ({ ...prev, profile_id: devicesInProfile[0].profileKey })); // Assuming profileKey is UUID or acceptable format
            } else {
                // Fallback: Check if it's a device ID
                const mainDevice = allDevices.find(d => String(d.id) === id || String(d.serialNumber) === id);
                if (mainDevice) {
                    title = mainDevice.profileName || mainDevice.name;
                    if (mainDevice.profileKey) {
                        targetDevices = allDevices.filter(d => d.profileKey === mainDevice.profileKey);
                    } else {
                        targetDevices = [mainDevice];
                    }
                } else {
                    title = id;
                    targetDevices = [];
                }
            }

            setPageTitle(title);

            // Fetch Telemetry
            const devicesWithData = await Promise.all(
                targetDevices.map(async (device) => {
                    try {
                        const lookupId = device.serialNumber || device.name;
                        const { data: telRes } = await api.get(`/admin/get-telemetry/${lookupId}`);
                        const telemetry = telRes.data || [];
                        const latestPoint = telemetry[telemetry.length - 1];

                        const isOnline = latestPoint &&
                            (new Date() - new Date(latestPoint.time) < IS_ONLINE_THRESHOLD_MS);

                        return {
                            ...device,
                            history: telemetry,
                            latestValue: latestPoint?.value ?? null,
                            isOnline: !!isOnline,
                            lastUpdated: latestPoint ? latestPoint.time : null
                        };
                    } catch (e) {
                        return { ...device, isOnline: false, lastUpdated: null };
                    }
                })
            );

            setProjectDevices(devicesWithData);

        } catch (error) {
            console.error("Failed to load project details", error);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    const fetchProfiles = async () => {
        try {
            const response = await api.get("/admin/get-device-profiles");
            setProfileList(response.data);
            // Auto-select profile if it matches ID
            const match = response.data.find(p => p.profile_id === id);
            if (match) {
                setNewDeviceData(prev => ({ ...prev, profile_id: match.id }));
            }
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
        fetchProjectData();
    }, [fetchProjectData]);

    const handleAddDevice = async () => {
        try {
            if (!newDeviceData.device_name || !newDeviceData.profile_id) {
                alert("Device Name and Profile are required");
                return;
            }

            const payload = {
                device_name: newDeviceData.device_name,
                serial_number: newDeviceData.serial_number,
                profile_id: newDeviceData.profile_id,
                project_name: newDeviceData.project_name || null
            };

            await api.post("/admin/create-device", payload);
            alert("Device added successfully!");
            setShowAddModal(false);
            setNewDeviceData({ device_name: "", serial_number: "", profile_id: "", project_name: "" });
            fetchProjectData();
        } catch (error) {
            console.error("Failed to add device:", error);
            alert("Failed to add device: " + (error.response?.data?.message || error.message));
        }
    };

    const openAddModal = () => {
        fetchProfiles();
        fetchProjects();
        setShowAddModal(true);
    };

    return (
        <div className="project-details-container">
            <div className="project-header">
                <h1 className="project-title">{pageTitle}</h1>
                <div className="header-actions">
                    <Button
                        className="btn-add-device"
                        onClick={openAddModal}
                    >
                        + Add Device
                    </Button>
                </div>
            </div>

            <div className="quick-stats">
                <Card className="stat-box" style={{ padding: '16px' }}>
                    <h3>{projectDevices.length}</h3>
                    <p>Total Devices</p>
                </Card>
                <Card className="stat-box" style={{ padding: '16px' }}>
                    <h3>{projectDevices.filter(d => d.isOnline).length}</h3>
                    <p>Devices Online</p>
                </Card>
                <Card className="stat-box" style={{ padding: '16px' }}>
                    <h3>{projectDevices.filter(d => d.isOnline).length > 0 ? "Active" : "Idle"}</h3>
                    <p>Status</p>
                </Card>
            </div>

            {/* View Live Button (Between Sections) */}
            <div className="view-live-btn-wrapper">
                <Button
                    className="view-live-btn"
                    onClick={() => navigate(`/live-monitor?profile=${id}`)}
                >
                    View Live Monitor
                </Button>
            </div>

            {/* Add Device Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="New Device"
                footer={
                    <>
                        <Button
                            onClick={handleAddDevice}
                            className="btn-submit"
                        >
                            Create Device
                        </Button>
                        <Button
                            onClick={() => setShowAddModal(false)}
                            className="btn-cancel"
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
                            placeholder="e.g., Living Room Sensor"
                            value={newDeviceData.device_name}
                            onChange={(e) => setNewDeviceData({ ...newDeviceData, device_name: e.target.value })}
                        />
                    </div>

                    {/* Serial Number */}
                    <div>
                        <Input
                            label="Hardware ID (Serial Number)"
                            placeholder="e.g., Arduino_Ult_01"
                            value={newDeviceData.serial_number}
                            onChange={(e) => setNewDeviceData({ ...newDeviceData, serial_number: e.target.value })}
                        />
                        <small className="helper-text" style={{ fontSize: '11px', color: '#666', marginTop: '-12px', display: 'block' }}>Must match the ID in your Arduino Code</small>
                    </div>

                    {/* Device Profile */}
                    <div>
                        <Select
                            label="Device Profile (Type)"
                            value={newDeviceData.profile_id}
                            onChange={(e) => setNewDeviceData({ ...newDeviceData, profile_id: e.target.value })}
                            options={[
                                { value: "", label: "Select Profile" },
                                ...profileList.map(p => ({
                                    value: p.id,
                                    label: `${p.name} (Type: ${p.type || 'N/A'})`
                                }))
                            ]}
                        />
                    </div>

                </div>
            </Modal>

            {isLoading ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>Loading Project Data...</div>
            ) : projectDevices.length > 0 ? (
                <div className="device-grid">
                    {projectDevices.map((device) => (
                        <Card
                            key={device.id}
                            className="project-device-card"
                            title={device.name}
                            titleClassName="device-name"
                            headerAction={
                                <div className={`status-badge ${device.isOnline ? 'online' : 'offline'}`}
                                    style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '12px', backgroundColor: device.isOnline ? '#dcfce7' : '#f3f4f6', color: device.isOnline ? '#166534' : '#6b7280' }}>
                                    {device.isOnline ? 'ONLINE' : 'OFFLINE'}
                                </div>
                            }
                        >
                            <div className="device-info-row">
                                Type: {device.type || "Sensor"}
                            </div>
                            <div className="device-info-row">
                                Serial: {device.serialNumber}
                            </div>
                            <div className="device-info-row">
                                Updated: {formatTime(device.lastUpdated)}
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <h3>No Devices Found</h3>
                    <p>There are no devices in this project yet.</p>
                    <Button
                        className="btn-add-device"
                        onClick={openAddModal}
                    >
                        + Add Device
                    </Button>
                </div>
            )}
        </div>
    );
};
