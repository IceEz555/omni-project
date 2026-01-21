import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const createUser = async (req, res) => {
  try {
    const {username, email, password, role_name} = req.body;

    // 0. Validate input
    if (!username || !email || !password || !role_name) {
        return res.status(400).json({ message: "All fields are required" });
    }
    
    // 1. Check if role exists
    const role = await prisma.role.findUnique({
        where: {
            name: role_name
        }
    })

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
            password_hash: hashedPassword,
            role_id: role.id
        }
    });
    return res.status(201).json({ message: "User created successfully", user: newUser });
 } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
 }   
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const {username, email, role_name, password} = req.body;
        
        // Prepare data to update
        let updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;

        // 1. If role_name is provided, find and update role_id
        if (role_name) {
            const role = await prisma.role.findUnique({
                where: { name: role_name }
            });
            if (role) {
                updateData.role_id = role.id;
            } else {
                return res.status(400).json({ message: "Role not found" });
            }
        }

        // 2. If password is provided, hash it and update
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password_hash = await bcrypt.hash(password, salt);
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

export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany(
            {
                include: {
                    role: true
                }
            }
        );
        res.json(users);
    } catch (error) {
       res.status(500).json({ error: error.message });
    }
}

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

