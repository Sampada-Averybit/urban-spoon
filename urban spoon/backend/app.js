const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const menuRoutes = require('./routes/menuRoutes');
const userRoutes = require('./routes/userRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const orderRoutes = require("./routes/orderRoutes");
const couponRoutes = require("./routes/couponRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGO_URI) {
  console.error("MONGO_URI is not set. Please configure it in your environment.");
  process.exit(1);
}

if (!JWT_SECRET) {
  console.error("JWT_SECRET is not set. Please configure it in your environment.");
  process.exit(1);
}

// Middleware
const corsOptions = {};
const corsOrigin = process.env.CORS_ORIGIN || "*";
if (corsOrigin !== "*") {
  corsOptions.origin = corsOrigin
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}
app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.use('/api/menu', menuRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user', userRoutes);
app.use('/api/reservations', reservationRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/coupons", couponRoutes);

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running' });
});

// Not Found handler (always JSON to avoid HTML responses to API clients)
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler (always JSON)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
  });
});

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err.message || err);
    process.exit(1);
  }
}

startServer();
