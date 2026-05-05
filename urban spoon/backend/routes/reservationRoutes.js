const express = require("express");
const router = express.Router();
const { protect, authorizeRoles, ROLES } = require("../middleware/authMiddleware");
const reservationController = require("../controllers/reservationController");

// GET /api/reservations
router.get("/", protect, authorizeRoles(ROLES.USER), reservationController.getUserReservations);

// POST /api/reservations
router.post("/", protect, authorizeRoles(ROLES.USER), reservationController.createReservation);

// GET /api/reservations/admin
router.get("/admin", protect, authorizeRoles(ROLES.ADMIN), reservationController.getAllReservationsForAdmin);

// PATCH /api/reservations/:id/confirm
router.patch("/:id/confirm", protect, authorizeRoles(ROLES.ADMIN), reservationController.confirmReservation);

// PUT /api/reservations/:id
router.put("/:id", protect, reservationController.updateReservation);

// DELETE /api/reservations/:id
router.delete("/:id", protect, reservationController.deleteReservation);

module.exports = router;
