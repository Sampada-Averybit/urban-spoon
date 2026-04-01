const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const reservationController = require("../controllers/reservationController");

// GET /api/reservations
router.get("/", protect, reservationController.getUserReservations);

// POST /api/reservations
router.post("/", protect, reservationController.createReservation);

module.exports = router;
