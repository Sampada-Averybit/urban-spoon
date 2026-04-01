const orderService = require("../services/orderService");

const createOrder = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized." });
    }

    const { items, couponCode } = req.body || {};
    const order = await orderService.placeOrder({
      user: req.user,
      items,
      couponCode,
    });

    return res.status(201).json({
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      message: error.message || "Unable to place order.",
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized." });
    }

    const orders = await orderService.listOrdersForUser(req.user._id);
    return res.status(200).json({ orders });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      message: error.message || "Unable to fetch orders.",
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
};

