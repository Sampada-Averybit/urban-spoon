const couponService = require("../services/couponService");

const createCoupon = async (req, res) => {
  try {
    const coupon = await couponService.createCoupon(req.body || {});
    return res.status(201).json({
      message: "Coupon created successfully.",
      coupon,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Unable to create coupon.",
    });
  }
};

const getValidCoupons = async (req, res) => {
  try {
    const orderAmountRaw = req.query?.orderAmount;
    const orderAmount = orderAmountRaw === undefined ? undefined : Number(orderAmountRaw);
    if (orderAmountRaw !== undefined && !Number.isFinite(orderAmount)) {
      return res.status(400).json({ message: "orderAmount must be a valid number." });
    }

    const coupons = await couponService.listValidCoupons({ orderAmount });
    return res.status(200).json({ coupons });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Unable to fetch valid coupons.",
    });
  }
};

module.exports = {
  createCoupon,
  getValidCoupons,
};
