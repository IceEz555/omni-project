const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Basic Health Check
app.get('/', (req, res) => {
  res.send('Platform Service is running');
});

app.listen(PORT, () => {
  console.log(`Platform Service running on http://localhost:${PORT}`);
});
