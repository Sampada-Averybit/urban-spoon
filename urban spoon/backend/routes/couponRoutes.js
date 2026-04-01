const express = require("express");
const couponController = require("../controllers/couponController");

const router = express.Router();

// GET /api/coupons/valid
router.get("/valid", couponController.getValidCoupons);

// POST /api/coupons
router.post("/", couponController.createCoupon);

module.exports = router;
