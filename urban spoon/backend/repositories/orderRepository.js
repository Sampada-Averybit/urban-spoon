const Order = require("../models/Order");

async function createOrder(orderPayload) {
  return Order.create(orderPayload);
}

async function findOrdersByUserId(userId) {
  return Order.find({ userId }).sort({ orderDate: -1, createdAt: -1 }).lean();
}

module.exports = {
  createOrder,
  findOrdersByUserId,
};

