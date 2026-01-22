import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Basic Health Check
app.get('/', (req, res) => {
  res.send('Platform Service is running');
});

app.listen(PORT, () => {
  console.log(`Platform Service running on http://localhost:${PORT}`);
});
