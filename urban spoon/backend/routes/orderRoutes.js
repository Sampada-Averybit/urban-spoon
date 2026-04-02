const express = require("express");
const { protect, authorizeRoles, ROLES } = require("../middleware/authMiddleware");
const orderController = require("../controllers/orderController");

const router = express.Router();

// POST /api/orders
router.post("/", protect, authorizeRoles(ROLES.USER), orderController.createOrder);

// GET /api/orders
router.get("/", protect, authorizeRoles(ROLES.USER), orderController.getMyOrders);

// GET /api/orders/admin
router.get("/admin", protect, authorizeRoles(ROLES.ADMIN), orderController.getAllOrdersForAdmin);

// GET /api/orders/admin/:id
router.get("/admin/:id", protect, authorizeRoles(ROLES.ADMIN), orderController.getOrderByIdForAdmin);

// PATCH /api/orders/admin/:id/status
router.patch("/admin/:id/status", protect, authorizeRoles(ROLES.ADMIN), orderController.updateOrderStatusForAdmin);

module.exports = router;
