const Order = require("../models/Order");

async function createOrder(orderPayload) {
  return Order.create(orderPayload);
}

async function findOrdersByUserId(userId) {
  return Order.find({ userId }).sort({ orderDate: -1, createdAt: -1 }).lean();
}

async function findAllOrders() {
  return Order.find({}).sort({ orderDate: -1, createdAt: -1 }).lean();
}

async function findOrderById(orderId) {
  return Order.findById(orderId).lean();
}

async function updateOrderStatus(orderId, orderStatus) {
  return Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    { new: true, runValidators: true }
  ).lean();
}

module.exports = {
  createOrder,
  findOrdersByUserId,
  findAllOrders,
  findOrderById,
  updateOrderStatus,
};
