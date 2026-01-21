import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

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
