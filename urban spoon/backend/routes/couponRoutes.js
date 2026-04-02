const express = require("express");
const couponController = require("../controllers/couponController");
const { protect, authorizeRoles, ROLES } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/coupons/valid
router.get("/valid", couponController.getValidCoupons);

// GET /api/coupons
router.get("/", protect, authorizeRoles(ROLES.ADMIN), couponController.getAllCouponsForAdmin);

// POST /api/coupons
router.post("/", protect, authorizeRoles(ROLES.ADMIN), couponController.createCoupon);

// PATCH /api/coupons/:id/status
router.patch("/:id/status", protect, authorizeRoles(ROLES.ADMIN), couponController.updateCouponStatus);

module.exports = router;
