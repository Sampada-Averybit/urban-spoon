const Coupon = require("../models/Coupon");

function buildHttpError(status, message) {
  const error = new Error(message);
  error.statusCode = status;
  return error;
}

function normalizeCouponPayload(payload = {}) {
  const couponCode = String(payload.couponCode || "").trim().toUpperCase();
  const discountType = String(payload.discountType || "").trim().toUpperCase();
  const discountValue = Number(payload.discountValue);
  const minOrderAmount = payload.minOrderAmount === undefined ? 0 : Number(payload.minOrderAmount);
  const maxDiscount = payload.maxDiscount === undefined || payload.maxDiscount === null || payload.maxDiscount === ""
    ? null
    : Number(payload.maxDiscount);
  const expiryDate = payload.expiryDate ? new Date(payload.expiryDate) : null;
  const isActive = payload.isActive === undefined ? true : Boolean(payload.isActive);

  if (!couponCode) {
    throw buildHttpError(400, "couponCode is required.");
  }
  if (!["PERCENTAGE", "FLAT"].includes(discountType)) {
    throw buildHttpError(400, "discountType must be PERCENTAGE or FLAT.");
  }
  if (!Number.isFinite(discountValue) || discountValue <= 0) {
    throw buildHttpError(400, "discountValue must be a positive number.");
  }
  if (!Number.isFinite(minOrderAmount) || minOrderAmount < 0) {
    throw buildHttpError(400, "minOrderAmount must be a number greater than or equal to 0.");
  }
  if (maxDiscount !== null && (!Number.isFinite(maxDiscount) || maxDiscount < 0)) {
    throw buildHttpError(400, "maxDiscount must be a number greater than or equal to 0.");
  }
  if (!expiryDate || Number.isNaN(expiryDate.getTime())) {
    throw buildHttpError(400, "expiryDate must be a valid date.");
  }
  if (expiryDate <= new Date()) {
    throw buildHttpError(400, "expiryDate must be in the future.");
  }

  return {
    code: couponCode,
    couponCode,
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscount,
    expiryDate,
    isActive,
  };
}

async function createCoupon(payload) {
  const normalized = normalizeCouponPayload(payload);

  const existing = await Coupon.findOne({
    $or: [{ couponCode: normalized.couponCode }, { code: normalized.couponCode }],
  }).lean();
  if (existing) {
    throw buildHttpError(409, "couponCode already exists.");
  }

  try {
    const coupon = await Coupon.create(normalized);
    return coupon;
  } catch (error) {
    if (error && error.code === 11000) {
      const conflictingField = Object.keys(error.keyPattern || {})[0] || "couponCode";
      if (conflictingField === "code" || conflictingField === "couponCode") {
        throw buildHttpError(409, "couponCode already exists.");
      }
    }
    throw error;
  }
}

async function listValidCoupons({ orderAmount } = {}) {
  const now = new Date();
  const query = {
    isActive: true,
    expiryDate: { $gt: now },
  };

  if (Number.isFinite(orderAmount)) {
    query.minOrderAmount = { $lte: orderAmount };
  }

  return Coupon.find(query)
    .sort({ expiryDate: 1, createdAt: -1 })
    .select("couponCode discountType discountValue minOrderAmount maxDiscount expiryDate isActive createdAt")
    .lean();
}

module.exports = {
  createCoupon,
  listValidCoupons,
};
