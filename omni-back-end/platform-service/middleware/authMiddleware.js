import jwt from 'jsonwebtoken';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
console.log("DEBUG: Middleware Secret loaded:", JWT_SECRET === 'your-secret-key' ? 'DEFAULT' : 'FROM ENV');

// 1. Verify Token (Authentication)
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user; // Attach user info to request
        next();
    });
};

// 2. Check Role (Authorization)
export const requireRole = (roleName) => {
    return (req, res, next) => {
        if (req.user.role !== roleName) { // e.g., 'ADMIN'
            return res.status(403).json({ error: `Access denied. Requires ${roleName} role.` });
        }
        next();
    };
};
