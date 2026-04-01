const Coupon = require("../models/Coupon");

async function findValidCouponByCode(couponCode) {
  if (!couponCode) return null;

  const normalized = String(couponCode).trim().toUpperCase();
  if (!normalized) return null;

  const now = new Date();
  const coupon = await Coupon.findOne({
    $or: [{ couponCode: normalized }, { code: normalized }],
    isActive: true,
    expiryDate: { $gt: now },
  }).lean();

  return coupon;
}

module.exports = {
  findValidCouponByCode,
};
