import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Add to .env later

export const register = async (req, res) => {
  try {
    const { email, username, password, role } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email or Username already exists' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Get default Role ID for 'OPERATOR' (or 'USER') if not provided
    const roleName = role || 'USER';
    
    // Find the Role ID from the Role table
    let roleRecord = await prisma.role.findUnique({
      where: { name: roleName }
    });

    // If Role doesn't exist (fresh DB), create it (Auto-seeding for convenience)
    if (!roleRecord) {
        roleRecord = await prisma.role.create({
            data: { name: roleName, description: 'Auto-created role' }
        });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password_hash,
        role_id: roleRecord.id,
      },
      include: {
        role: true 
      }
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role.name
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role.name
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};
