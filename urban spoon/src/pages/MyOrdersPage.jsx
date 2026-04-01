import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyOrdersApi } from "../services/orderApi";

function formatCurrency(amount) {
  return `$${Number(amount || 0).toFixed(2)}`;
}

function formatDate(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyOrdersApi()
      .then((data) => {
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      })
      .catch((err) => {
        setError(err.message || "Unable to load orders.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#111827]">
      <main className="mx-auto max-w-[1100px] px-4 py-10">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <h1 className="text-[2.2rem] font-bold text-[#0f1833]">My Orders</h1>
            <p className="mt-1 text-[0.95rem] text-[#6b7280]">Track your latest placed orders.</p>
          </div>
          <button
            onClick={() => navigate("/menu")}
            className="rounded-full bg-[#ef2c5b] px-5 py-2.5 text-[0.9rem] font-semibold text-white hover:bg-[#db2551]"
          >
            Order More
          </button>
        </div>

        {loading ? (
          <p className="text-[#6b7280]">Loading orders...</p>
        ) : error ? (
          <div className="rounded-[0.7rem] bg-[#ffe3ea] px-4 py-3 text-[0.9rem] font-semibold text-[#ef2c5b]">{error}</div>
        ) : orders.length === 0 ? (
          <div className="rounded-[1rem] border border-[#e5e7eb] bg-white px-6 py-8 text-center">
            <p className="text-[1rem] font-semibold text-[#111827]">No orders yet.</p>
            <p className="mt-1 text-[0.9rem] text-[#6b7280]">Place your first order from the menu.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <article key={order._id} className="rounded-[1rem] border border-[#e5e7eb] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f1f5f9] pb-3">
                  <div>
                    <p className="text-[0.74rem] font-bold uppercase tracking-[0.1em] text-[#94a3b8]">Order ID</p>
                    <p className="text-[0.9rem] font-semibold text-[#111827]">{order._id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[0.74rem] font-bold uppercase tracking-[0.1em] text-[#94a3b8]">Date</p>
                    <p className="text-[0.9rem] font-semibold text-[#111827]">{formatDate(order.orderDate)}</p>
                  </div>
                </div>

                <div className="mt-3 grid gap-2">
                  {(order.items || []).map((item) => (
                    <div key={`${item.itemId}-${item.itemName}`} className="flex items-center justify-between rounded-[0.6rem] bg-[#f8fafc] px-3 py-2">
                      <p className="text-[0.9rem] text-[#1f2937]">
                        {item.itemName} x {item.quantity}
                      </p>
                      <p className="text-[0.9rem] font-semibold text-[#111827]">{formatCurrency(item.totalPrice)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#ffe8ef] px-3 py-1 text-[0.72rem] font-bold text-[#ef2c5b]">{order.orderStatus}</span>
                    <span className="rounded-full bg-[#e5e7eb] px-3 py-1 text-[0.72rem] font-bold text-[#4b5563]">{order.paymentStatus}</span>
                  </div>
                  <p className="text-[1rem] font-bold text-[#111827]">Final: {formatCurrency(order.finalAmount)}</p>
                </div>

                {order?.coupon?.couponCode && order.coupon.discountAmount > 0 && (
                  <div className="mt-3 rounded-[0.7rem] border border-[#d9f5e8] bg-[#f2fff8] px-3 py-2.5">
                    <p className="text-[0.74rem] font-bold uppercase tracking-[0.08em] text-[#1f7a57]">Coupon Applied</p>
                    <p className="mt-1 text-[0.88rem] text-[#134e3a]">
                      {order.coupon.couponCode} ({order.coupon.discountType}{" "}
                      {order.coupon.discountType === "PERCENTAGE" ? `${order.coupon.discountValue}%` : formatCurrency(order.coupon.discountValue)})
                    </p>
                    <p className="mt-0.5 text-[0.85rem] font-semibold text-[#15803d]">
                      You saved {formatCurrency(order.coupon.discountAmount)}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
