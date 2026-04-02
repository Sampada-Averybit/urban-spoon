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

const getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await orderService.listAllOrdersForAdmin();
    return res.status(200).json({ orders });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      message: error.message || "Unable to fetch orders.",
    });
  }
};

const getOrderByIdForAdmin = async (req, res) => {
  try {
    const order = await orderService.getOrderDetailsForAdmin(req.params?.id);
    return res.status(200).json({ order });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      message: error.message || "Unable to fetch order details.",
    });
  }
};

const updateOrderStatusForAdmin = async (req, res) => {
  try {
    const { orderStatus } = req.body || {};
    const order = await orderService.updateOrderStatusForAdmin(req.params?.id, orderStatus);
    return res.status(200).json({
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      message: error.message || "Unable to update order status.",
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrdersForAdmin,
  getOrderByIdForAdmin,
  updateOrderStatusForAdmin,
};
