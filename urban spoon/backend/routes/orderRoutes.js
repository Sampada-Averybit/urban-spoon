const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const orderController = require("../controllers/orderController");

const router = express.Router();

// POST /api/orders
router.post("/", protect, orderController.createOrder);

// GET /api/orders
router.get("/", protect, orderController.getMyOrders);

module.exports = router;

