const Reservation = require("../models/Reservation");
const User = require("../models/User");

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

module.exports = {
  createReservation,
  getUserReservations,
};
