const mongoose = require("mongoose");
const menuRepository = require("../repositories/menuRepository");
const couponRepository = require("../repositories/couponRepository");
const orderRepository = require("../repositories/orderRepository");

function buildHttpError(status, message) {
  const error = new Error(message);
  error.statusCode = status;
  return error;
}

const ORDER_STATUS_VALUES = [
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

function normalizeItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw buildHttpError(400, "items must be a non-empty array.");
  }

  const quantityByItemId = new Map();

  for (const row of items) {
    const itemId = row?.itemId;
    const quantity = Number(row?.quantity);

    if (!itemId || !mongoose.Types.ObjectId.isValid(String(itemId))) {
      throw buildHttpError(400, "Each item must include a valid itemId.");
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw buildHttpError(400, "Each item quantity must be an integer greater than 0.");
    }

    const key = String(itemId);
    quantityByItemId.set(key, (quantityByItemId.get(key) || 0) + quantity);
  }

  return Array.from(quantityByItemId.entries()).map(([itemId, quantity]) => ({
    itemId,
    quantity,
  }));
}

function calculateCouponDiscount({ coupon, itemsTotal }) {
  if (!coupon) {
    return {
      coupon: {
        couponCode: null,
        discountType: null,
        discountValue: 0,
        discountAmount: 0,
      },
      couponDiscount: 0,
    };
  }

  const discountType = coupon.discountType;
  const discountValue = Number(coupon.discountValue) || 0;
  const minOrderAmount = Number(coupon.minOrderAmount || 0);
  const maxDiscount = coupon.maxDiscount === null || coupon.maxDiscount === undefined
    ? null
    : Number(coupon.maxDiscount);

  if (itemsTotal < minOrderAmount) {
    throw buildHttpError(400, `Minimum order amount for this coupon is ${minOrderAmount}.`);
  }

  let discountAmount = 0;
  if (discountType === "PERCENTAGE") {
    discountAmount = (itemsTotal * discountValue) / 100;
    if (maxDiscount !== null && Number.isFinite(maxDiscount)) {
      discountAmount = Math.min(discountAmount, maxDiscount);
    }
  } else if (discountType === "FLAT") {
    discountAmount = discountValue;
  } else {
    throw buildHttpError(400, "Invalid coupon configuration.");
  }

  discountAmount = Math.max(0, Math.min(itemsTotal, Number(discountAmount.toFixed(2))));

  return {
    coupon: {
      couponCode: coupon.couponCode,
      discountType,
      discountValue,
      discountAmount,
    },
    couponDiscount: discountAmount,
  };
}

async function placeOrder({ user, items, couponCode }) {
  if (!user || !user._id) {
    throw buildHttpError(401, "Not authorized.");
  }

  const normalizedItems = normalizeItems(items);
  const menuIds = normalizedItems.map((row) => row.itemId);
  const menuDocs = await menuRepository.findMenuItemsByIds(menuIds);
  const menuMap = new Map(menuDocs.map((doc) => [String(doc._id), doc]));

  const missingItems = menuIds.filter((id) => !menuMap.has(String(id)));
  if (missingItems.length) {
    throw buildHttpError(404, "Some menu items were not found.");
  }

  const orderItems = normalizedItems.map(({ itemId, quantity }) => {
    const menuItem = menuMap.get(String(itemId));
    if (!menuItem?.available) {
      throw buildHttpError(400, `Item is currently unavailable: ${menuItem?.name || itemId}`);
    }

    const pricePerUnit = Number(menuItem.price);
    const totalPrice = Number((pricePerUnit * quantity).toFixed(2));
    return {
      itemId: menuItem._id,
      itemName: menuItem.name,
      quantity,
      pricePerUnit,
      totalPrice,
    };
  });

  const itemsTotal = Number(orderItems.reduce((acc, row) => acc + row.totalPrice, 0).toFixed(2));

  let couponDoc = null;
  if (couponCode) {
    couponDoc = await couponRepository.findValidCouponByCode(couponCode);
    if (!couponDoc) {
      throw buildHttpError(400, "Coupon is invalid or expired.");
    }
  }

  const { coupon, couponDiscount } = calculateCouponDiscount({
    coupon: couponDoc,
    itemsTotal,
  });
  const finalAmount = Number(Math.max(0, itemsTotal - couponDiscount).toFixed(2));

  const orderPayload = {
    userId: user._id,
    userSnapshot: {
      name: user.name || "",
      email: user.email || "",
    },
    items: orderItems,
    pricing: {
      itemsTotal,
      couponDiscount,
      finalAmount,
    },
    coupon,
    itemsTotal,
    couponDiscount,
    finalAmount,
    orderStatus: "PLACED",
    paymentStatus: "PENDING",
    orderDate: new Date(),
  };

  const order = await orderRepository.createOrder(orderPayload);
  return order;
}

async function listOrdersForUser(userId) {
  if (!userId) throw buildHttpError(401, "Not authorized.");
  return orderRepository.findOrdersByUserId(userId);
}

async function listAllOrdersForAdmin() {
  return orderRepository.findAllOrders();
}

async function getOrderDetailsForAdmin(orderId) {
  if (!orderId) throw buildHttpError(400, "orderId is required.");
  const order = await orderRepository.findOrderById(orderId);
  if (!order) throw buildHttpError(404, "Order not found.");
  return order;
}

async function updateOrderStatusForAdmin(orderId, orderStatus) {
  if (!orderId) throw buildHttpError(400, "orderId is required.");

  const normalizedStatus = String(orderStatus || "").trim().toUpperCase();
  if (!ORDER_STATUS_VALUES.includes(normalizedStatus)) {
    throw buildHttpError(400, "Invalid order status.");
  }

  const updated = await orderRepository.updateOrderStatus(orderId, normalizedStatus);
  if (!updated) {
    throw buildHttpError(404, "Order not found.");
  }

  return updated;
}

module.exports = {
  placeOrder,
  listOrdersForUser,
  listAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatusForAdmin,
  ORDER_STATUS_VALUES,
};
