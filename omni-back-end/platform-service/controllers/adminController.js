import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Create User
export const createUser = async (req, res) => {
 try {
    const {username, email, password, role_name} = req.body;
    
    const role = await prisma.role.findUnique({
        where: {
            name: role_name
        }
    })
     // 1. หา role_id จากชื่อ role
    if (!role) {
        return res.status(404).json({ message: "Role not found" });
    }
    /// 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // 3. Create user
    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
            role_id: role.id
        }
    });
    return res.status(201).json({ message: "User created successfully", user: newUser });
 } catch (error) {
    if (!username || !email || !password || !role_name) {
        return res.status(400).json({ message: "All fields are required" });
    }
   res.status(500).json({ error: error.message });
 }   
};

// Update User
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;  // รับ id จาก url
        const {username, email, role_name} = req.body; // password อาจจะแยก api เผื่อความปลอดภัย
        let updateData = {email, username};
        if (role_name) {
            const role = await prisma.role.findUnique({
                where: {
                    name: role_name
                }
            });
            if (role) updateData.role_id = role.id;
        }
        const updatedUser = await prisma.user.update({
            where: {
                id: id
            },
            data: updateData
        });
       res.json(updatedUser);
    } catch (error) {
       res.status(500).json({ error: error.message });
    }
}

// Delete User
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await prisma.user.delete({
            where: {
                id: id
            }
        });
       res.json(deletedUser);
    } catch (error) {
       res.status(500).json({ error: error.message });
    }
}

// Get All Users
export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                role: true, // Role info
                project_memberships: {
                    include: {
                        project: true // Project names
                    }
                },
                sessions: {
                    orderBy: {
                        start_time: 'desc'
                    },
                    take: 1, // Get latest session for "Last Active"
                    select: {
                        start_time: true
                    }
                },
                _count: {
                    select: { sessions: true } // Count total sessions
                }
            }
        });

        // Format data for Frontend
        const formattedUsers = users.map(user => {
            // 1. Get Project Name (List all if multiple)
            const projects = user.project_memberships.map(pm => pm.project.name).join(", ") || "No Project";

            // 2. Last Active (Latest session start_time or created_at)
            const lastSession = user.sessions[0];
            const lastActive = lastSession ? lastSession.start_time : user.created_at;

            // 3. Status (Logic: Active if login < 30 days? Or just hardcode 'active' for now)
            const status = "active"; 

            return {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role.name,
                project: projects,
                status: status,
                lastActive: lastActive,
                sessionCount: user._count.sessions
            };
        });

        res.json(formattedUsers);
    } catch (error) {
       res.status(500).json({ error: error.message });
    }
}

// Get User By Id
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: {
                id: id
            },
            include: {
                role: true
            }
        });
        res.json(user);
    } catch (error) {
       res.status(500).json({ error: error.message });
    }
}

