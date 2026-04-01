const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: true,
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    pricePerUnit: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userSnapshot: {
      name: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one item is required.",
      },
      required: true,
    },
    pricing: {
      itemsTotal: { type: Number, required: true, min: 0 },
      couponDiscount: { type: Number, required: true, min: 0, default: 0 },
      finalAmount: { type: Number, required: true, min: 0 },
    },
    coupon: {
      couponCode: { type: String, default: null },
      discountType: { type: String, enum: ["PERCENTAGE", "FLAT", null], default: null },
      discountValue: { type: Number, default: 0, min: 0 },
      discountAmount: { type: Number, default: 0, min: 0 },
    },
    itemsTotal: { type: Number, required: true, min: 0 },
    couponDiscount: { type: Number, required: true, min: 0, default: 0 },
    finalAmount: { type: Number, required: true, min: 0 },
    orderStatus: {
      type: String,
      enum: ["PLACED", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"],
      default: "PLACED",
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "orders",
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);

