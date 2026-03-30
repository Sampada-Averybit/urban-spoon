require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const menuRoutes = require('./routes/menuRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/menu', menuRoutes);
app.use('/api/users', userRoutes);

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
