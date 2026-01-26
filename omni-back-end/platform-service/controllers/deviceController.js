import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Create Device
export const createDevice = async (req, res) => {
    try {
        const { device_name, profile_id, project_name } = req.body;

        if (!device_name || !profile_id) {
            return res.status(400).json({ message: "Device name and Profile are required" });
        }

        // 1. Find Project (Optional)
        let project_id_db = null;
        if (project_name) {
            const project = await prisma.project.findFirst({
                where: { name: project_name }
            });
            if (project) {
                project_id_db = project.id;
            } else {
                return res.status(404).json({ message: `Project '${project_name}' not found` });
            }
        }

        // 2. Create Device
        // Note: profile_id coming from frontend is likely the UUID of the device_profile table
        const newDevice = await prisma.device.create({
            data: {
                device_name: device_name,
                serial_number: req.body.serial_number || `UNKNOWN_${Date.now()}`, // Fallback if not provided, but mostly required
                device_profile_id: profile_id, // This is the UUID FK
                project_id: project_id_db,
                status: 'OFFLINE'
            }
        });

        res.status(201).json(newDevice);
    } catch (error) {
        console.error("Create Device Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get All Devices
export const getAllDevices = async (req, res) => {
    try {
        const devices = await prisma.device.findMany({
            include: {
                project: {
                    select: { name: true }
                },
                profile: {
                    select: { name: true, profile_id: true, data_type: true } 
                }
            }
        });

        const formattedDevices = devices.map(device => ({
            id: device.id,
            name: device.device_name,
            serialNumber: device.serial_number,
            project: device.project ? device.project.name : "-",
            profileName: device.profile.name,
            profileKey: device.profile.profile_id, // e.g. "yoga_mat_v1"
            type: device.profile.data_type, // Map data_type to type
            status: device.status,
            createdAt: device.created_at
        }));

        res.json(formattedDevices);
    } catch (error) {
        console.error("Get Devices Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Delete Device
export const deleteDevice = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.device.delete({
            where: { id: id }
        });
        res.json({ message: "Device deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
