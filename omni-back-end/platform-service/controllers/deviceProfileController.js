import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Create Device Profile
export const createProfile = async (req, res) => {
    try {
        const { profile_id, name, type, dataFormat, description } = req.body;

        if (!profile_id || !name) {
            return res.status(400).json({ message: "Profile ID and Name are required" });
        }

        // Check availability
        const existing = await prisma.deviceProfile.findUnique({
            where: { profile_id }
        });

        if (existing) {
            return res.status(400).json({ message: "Profile ID already exists" });
        }

        const newProfile = await prisma.deviceProfile.create({
            data: {
                profile_id,
                name,
                data_type: type || "unknown", // Mapping 'type' to 'data_type' in schema
                // For 'schema_definition', we store the format info or default JSON
                schema_definition: { format: dataFormat || "JSON" } 
            }
        });

        res.status(201).json(newProfile);
    } catch (error) {
        console.error("Create Profile Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get All Profiles
export const getAllProfiles = async (req, res) => {
    try {
        const profiles = await prisma.deviceProfile.findMany({
            include: {
                _count: {
                    select: { devices: true }
                }
            }
        });

        const formatted = profiles.map(p => ({
            id: p.id,
            profile_id: p.profile_id,
            name: p.name,
            type: p.data_type,
            dataFormat: p.schema_definition?.format || "JSON",
            description: "", // Schema doesn't have description, maybe add later or ignore
            activeDevices: p._count.devices,
            status: "Active" 
        }));

        res.json(formatted);
    } catch (error) {
        console.error("Get Profiles Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Delete Profile
export const deleteProfile = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.deviceProfile.delete({
            where: { id: id }
        });
        res.json({ message: "Profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
