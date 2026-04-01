export async function placeOrderApi({ items, couponCode }) {
  const token = localStorage.getItem("urbanSpoonToken");
  if (!token) {
    throw new Error("Please login to place an order.");
  }

  const response = await fetch("http://localhost:3000/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      items,
      ...(couponCode ? { couponCode } : {}),
    }),
  });

  const raw = await response.text();
  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    throw new Error("Invalid server response format.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to place order.");
  }

  return data;
}

export async function fetchMyOrdersApi() {
  const token = localStorage.getItem("urbanSpoonToken");
  if (!token) {
    throw new Error("Please login to view orders.");
  }

  const response = await fetch("http://localhost:3000/api/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const raw = await response.text();
  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    throw new Error("Invalid server response format.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to load orders.");
  }

  return data;
}

