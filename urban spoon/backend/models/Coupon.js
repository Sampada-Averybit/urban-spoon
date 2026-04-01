const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    // Legacy field kept for backward compatibility with existing unique index/data.
    code: {
      type: String,
      uppercase: true,
      trim: true,
      index: true,
    },
    couponCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FLAT"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0.01,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxDiscount: {
      type: Number,
      default: null,
      min: 0,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "coupons",
    timestamps: true,
  }
);

couponSchema.pre("validate", function syncLegacyCode(next) {
  if (this.couponCode && !this.code) {
    this.code = this.couponCode;
  } else if (this.code && !this.couponCode) {
    this.couponCode = this.code;
  }
  next();
});

module.exports = mongoose.model("Coupon", couponSchema);
