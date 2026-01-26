import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Create User
export const createUser = async (req, res) => {
 try {
    const {username, email, password, role_name, project_name} = req.body;
    
    // 0. Validate input
    if (!username || !email || !password || !role_name) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // 1. Role Validation
    // 1. Role Validation
    const normalizedRoleName = role_name ? role_name.toUpperCase() : 'OPERATOR';
    
    let role = await prisma.role.findFirst({
        where: { name: normalizedRoleName }
    });

    if (!role) {
        // Fallback: try finding 'USER' or just fail if strict
        role = await prisma.role.findFirst({ where: { name: 'USER' }});
    }

    if (!role) {
        return res.status(404).json({ message: `Role '${role_name}' not found and no default role available` });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user
    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password_hash: hashedPassword,
            role_id: role.id
        }
    });

    // 4. Assign to Project (if provided)
    if (project_name) {
        const project = await prisma.project.findFirst({
            where: { name: project_name }
        });
        
        if (project) {
            await prisma.projectUser.create({
                data: {
                    user_id: newUser.id,
                    project_id: project.id,
                    role_in_project: 'USER' // Default role in project
                }
            });
        }
    }

    return res.status(201).json({ message: "User created successfully", user: newUser });
 } catch (error) {
    console.error(error);
   res.status(500).json({ error: error.message });
 }   
};

// Update User
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const {username, email, role_name, password, project_name, status} = req.body;
        
        // Prepare data to update
        let updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (status) updateData.status = status;

        // 1. If role_name is provided, find and update role_id
        if (role_name) {
            const normalizedRoleName = role_name.toUpperCase();
            const role = await prisma.role.findFirst({
                where: { name: normalizedRoleName }
            });
            if (role) {
                updateData.role_id = role.id;
            } else {
                return res.status(400).json({ message: `Role '${role_name}' not found` });
            }
        }

        // 2. If password is provided, hash it and update
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password_hash = await bcrypt.hash(password, salt);
        }

        // 3. If project_name is provided, update project membership
        if (project_name) {
             const project = await prisma.project.findFirst({
                where: { name: project_name }
            });
            
            if (project) {
                // Remove existing projects (assuming single-project UI logic)
                await prisma.projectUser.deleteMany({
                    where: { user_id: id }
                });

                // Add to new project
                await prisma.projectUser.create({
                    data: {
                        user_id: id,
                        project_id: project.id,
                        role_in_project: 'USER'
                    }
                });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: updateData,
            include: { role: true } // Return role info too
        });

        // Don't send password hash back
        const { password_hash, ...userWithoutPassword } = updatedUser;
        res.json(userWithoutPassword);
    } catch (error) {
       res.status(500).json({ error: error.message });
    }
}

// Delete User
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.projectUser.deleteMany({ where: { user_id: id }}); // Clean up memberships first
        const deletedUser = await prisma.user.delete({
            where: { id: id }
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
                role: true,
                project_memberships: {
                    include: {
                        project: true // Project names
                    }
                },
                sessions: {
                    orderBy: { start_time: 'desc' },
                    take: 1,
                    select: { start_time: true }
                },
                _count: {
                    select: { sessions: true }
                }
            }
        });

        const formattedUsers = users.map(user => {
            const projects = user.project_memberships.map(pm => pm.project.name).join(", ") || "-";
            const lastSession = user.sessions[0];
            const lastActive = lastSession ? lastSession.start_time : user.created_at;

            return {
                id: user.id,
                name: user.username, // Frontend expects 'name'
                email: user.email,
                role: user.role.name,
                project: projects,
                status: user.status, // Real status from DB
                lastActive: lastActive ? new Date(lastActive).toLocaleString() : "Never",
                sessions: user._count.sessions // Frontend expects 'sessions'
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
            where: { id: id },
            include: { role: true }
        });
        res.json(user);
    } catch (error) {
       res.status(500).json({ error: error.message });
    }
}

// Get All Projects (For Dropdown)
export const getAllProjects = async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            select: { id: true, name: true }
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get All Device Profiles (For Dropdown)
export const getAllDeviceProfiles = async (req, res) => {
    try {
        const profiles = await prisma.deviceProfile.findMany({
            select: { id: true, name: true, profile_id: true }
        });
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
