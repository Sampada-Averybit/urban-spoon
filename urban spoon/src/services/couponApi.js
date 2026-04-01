export async function createCouponApi(payload) {
  const response = await fetch("http://localhost:3000/api/coupons", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const raw = await response.text();
  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    throw new Error("Invalid server response format.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to create coupon.");
  }

  return data;
}

export async function fetchValidCouponsApi(orderAmount) {
  const suffix = Number.isFinite(orderAmount)
    ? `?orderAmount=${encodeURIComponent(orderAmount)}`
    : "";

  const response = await fetch(`http://localhost:3000/api/coupons/valid${suffix}`);

  const raw = await response.text();
  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    const clean = String(raw || "").replace(/\s+/g, " ").trim();
    if (clean) {
      throw new Error(clean.slice(0, 180));
    }
    throw new Error("Coupon service returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch valid coupons.");
  }

  return data;
}
