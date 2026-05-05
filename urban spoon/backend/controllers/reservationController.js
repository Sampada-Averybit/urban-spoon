const Reservation = require("../models/Reservation");
const User = require("../models/User");
const { ROLES } = require("../middleware/authMiddleware");

function isAdminRequest(req) {
  return String(req.authRole || "").toUpperCase() === ROLES.ADMIN;
}

const createReservation = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { date, numberOfGuests, preferredTime, specialRequests } = req.body;

    if (!date || !numberOfGuests || !preferredTime) {
      return res.status(400).json({
        message: "date, numberOfGuests, and preferredTime are required",
      });
    }

    const guests = Number(numberOfGuests);
    if (Number.isNaN(guests) || guests <= 0) {
      return res.status(400).json({
        message: "numberOfGuests must be greater than 0",
      });
    }

    const user = await User.findById(req.user._id).select("name email phone");
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const reservation = await Reservation.create({
      userId: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      date,
      numberOfGuests: guests,
      preferredTime,
      specialRequests: specialRequests || "",
    });

    return res.status(201).json({
      message: "Reservation created successfully",
      reservation,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

const getUserReservations = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(req.user._id).select("_id");
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const reservations = await Reservation.find({ userId: user._id }).sort({
      date: 1,
      preferredTime: 1,
      createdAt: -1,
    });

    return res.status(200).json({ reservations });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

const getAllReservationsForAdmin = async (req, res) => {
  try {
    const reservations = await Reservation.find({})
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ reservations });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

const confirmReservation = async (req, res) => {
  try {
    const reservationId = req.params?.id;
    if (!reservationId) {
      return res.status(400).json({ message: "Reservation id is required." });
    }

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found." });
    }

    reservation.status = "CONFIRMED";
    reservation.confirmedAt = new Date();
    await reservation.save();

    return res.status(200).json({
      message: "Reservation confirmed successfully.",
      reservation,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

const updateReservation = async (req, res) => {
  try {
    const reservationId = req.params?.id;
    if (!reservationId) {
      return res.status(400).json({ message: "Reservation id is required." });
    }

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found." });
    }

    const isAdmin = isAdminRequest(req);
    const isOwner = req.user && String(reservation.userId) === String(req.user._id);
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }

    const { date, numberOfGuests, preferredTime, specialRequests, status } = req.body || {};

    if (date !== undefined) reservation.date = date;
    if (preferredTime !== undefined) reservation.preferredTime = preferredTime;
    if (specialRequests !== undefined) reservation.specialRequests = specialRequests;

    if (numberOfGuests !== undefined) {
      const guests = Number(numberOfGuests);
      if (Number.isNaN(guests) || guests <= 0) {
        return res.status(400).json({ message: "numberOfGuests must be greater than 0" });
      }
      reservation.numberOfGuests = guests;
    }

    if (status !== undefined) {
      const normalizedStatus = String(status).trim().toUpperCase();
      if (!["PENDING", "CONFIRMED"].includes(normalizedStatus)) {
        return res.status(400).json({ message: "status must be PENDING or CONFIRMED" });
      }
      reservation.status = normalizedStatus;
      reservation.confirmedAt = normalizedStatus === "CONFIRMED" ? new Date() : null;
    }

    await reservation.save();

    return res.status(200).json({
      message: "Reservation updated successfully.",
      reservation,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

const deleteReservation = async (req, res) => {
  try {
    const reservationId = req.params?.id;
    if (!reservationId) {
      return res.status(400).json({ message: "Reservation id is required." });
    }

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found." });
    }

    const isAdmin = isAdminRequest(req);
    const isOwner = req.user && String(reservation.userId) === String(req.user._id);
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }

    await Reservation.findByIdAndDelete(reservationId);
    return res.status(200).json({ message: "Reservation deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  createReservation,
  getUserReservations,
  getAllReservationsForAdmin,
  confirmReservation,
  updateReservation,
  deleteReservation,
};
