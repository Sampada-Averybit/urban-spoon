import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import AdminTopbar from "../components/AdminTopbar";

const ORDER_STATUS_OPTIONS = ["PLACED", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];
const TRACK_STEPS = ["PLACED", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];
const FILTER_OPTIONS = ["ALL", ...ORDER_STATUS_OPTIONS];

function formatMoney(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "-";
  return `INR ${n.toFixed(2)}`;
}

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

function prettyStatus(status) {
  return String(status || "").replaceAll("_", " ");
}

function formatDiscount(coupon = {}) {
  if (!coupon || !coupon.couponCode) return "-";
  const type = coupon.discountType === "PERCENTAGE" ? "%" : "flat";
  const value = Number(coupon.discountValue);
  if (!Number.isFinite(value)) return "-";
  return coupon.discountType === "PERCENTAGE" ? `${value}${type}` : `INR ${value}`;
}

function getStatusPillClass(status) {
  if (status === "DELIVERED") return "bg-[#d6f0de] text-[#1f7f40]";
  if (status === "CANCELLED") return "bg-[#ffe0e8] text-[#c62854]";
  if (status === "OUT_FOR_DELIVERY") return "bg-[#e6f0ff] text-[#1d4ed8]";
  if (status === "PREPARING") return "bg-[#f1e8ff] text-[#7e22ce]";
  return "bg-[#fff0d8] text-[#8a5b00]";
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [openDetailsId, setOpenDetailsId] = useState(null);
  const [openTrackId, setOpenTrackId] = useState(null);
  const [statusDrafts, setStatusDrafts] = useState({});

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("urbanSpoonToken");
    if (!token) {
      setError("Please login as admin.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/orders/admin", {
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
        throw new Error(data?.message || "Failed to fetch orders.");
      }

      const list = Array.isArray(data?.orders) ? data.orders : [];
      setOrders(list);
      setStatusDrafts(
        list.reduce((acc, order) => {
          acc[order._id] = order.orderStatus;
          return acc;
        }, {})
      );
    } catch (err) {
      setError(err.message || "Unable to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusCounts = useMemo(() => {
    const counts = orders.reduce((acc, order) => {
      const key = String(order.orderStatus || "");
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    counts.ALL = orders.length;
    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (filter === "ALL") return orders;
    return orders.filter((order) => order.orderStatus === filter);
  }, [orders, filter]);

  const handleUpdateStatus = async (orderId) => {
    const token = localStorage.getItem("urbanSpoonToken");
    if (!token) {
      setError("Please login as admin.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/orders/admin/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: statusDrafts[orderId] }),
      });

      const raw = await response.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error("Invalid server response format.");
      }

      if (!response.ok) {
        throw new Error(data?.message || "Failed to update order status.");
      }

      setOrders((prev) =>
        prev.map((order) =>
          String(order._id) === String(orderId) ? { ...order, orderStatus: statusDrafts[orderId] } : order
        )
      );
    } catch (err) {
      setError(err.message || "Unable to update order status.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f6] text-[#11182f]">
      <AdminTopbar />

      <main className="mx-auto grid min-h-[calc(100vh-5.5rem)] max-w-[1440px] grid-cols-[280px_1fr] max-[1100px]:grid-cols-1">
        <Sidebar />

        <section className="px-6 py-6 max-[700px]:px-4">
          <div className="mb-5 flex items-end justify-between gap-4 max-[820px]:flex-col max-[820px]:items-start">
            <div>
              <h2 className="text-[1.9rem] font-bold text-[#11182f] max-[920px]:text-[1.6rem]">Orders Management</h2>
              <p className="mt-1 text-[0.95rem] text-[#52627a]">See all orders, track status, update status, and view full details.</p>
            </div>
            <button
              onClick={fetchOrders}
              className="rounded-lg border border-[#e2e8f0] bg-white px-3 py-1.5 text-[0.82rem] font-semibold text-[#334155] hover:bg-[#f8fafc]"
            >
              Refresh
            </button>
          </div>

          <div className="mb-4 rounded-[1.1rem] border border-[#e4e7ee] bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              {FILTER_OPTIONS.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`rounded-full px-3 py-1.5 text-[0.78rem] font-semibold ${
                    filter === status ? "bg-[#ffe8ef] text-[#ef2c5b]" : "bg-[#f8fafc] text-[#334155]"
                  }`}
                >
                  {prettyStatus(status)} ({statusCounts[status] || 0})
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            {error && (
              <div className="rounded-xl bg-[#ffe3ea] px-4 py-3 text-[0.9rem] font-semibold text-[#ef2c5b]">
                {error}
              </div>
            )}

            {loading && (
              <div className="rounded-xl border border-[#e4e7ee] bg-white px-4 py-8 text-center text-[#6d7588]">
                Loading orders...
              </div>
            )}

            {!loading && filteredOrders.length === 0 && (
              <div className="rounded-xl border border-[#e4e7ee] bg-white px-4 py-8 text-center text-[#6d7588]">
                No orders found for selected filter.
              </div>
            )}

            {!loading &&
              filteredOrders.map((order) => (
                <article key={order._id} className="rounded-xl border border-[#e4e7ee] bg-white p-4 shadow-[0_4px_18px_rgba(15,23,42,0.04)]">
                  <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
                    <div>
                      <p className="text-[1.02rem] font-bold text-[#1c2437]">
                        Order #{String(order._id).slice(-6).toUpperCase()} - {order.userSnapshot?.name || "Customer"}
                      </p>
                      <p className="mt-1 text-[0.9rem] text-[#4f617d]">
                        {order.userSnapshot?.email || "-"} | {formatDate(order.orderDate)}
                      </p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        <div className="rounded-lg bg-[#f8fafc] px-3 py-2">
                          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.05em] text-[#64748b]">Final Amount</p>
                          <p className="text-[0.95rem] font-bold text-[#1f2937]">{formatMoney(order.finalAmount)}</p>
                        </div>
                        <div className="rounded-lg bg-[#f8fafc] px-3 py-2">
                          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.05em] text-[#64748b]">Payment</p>
                          <p className="text-[0.95rem] font-bold text-[#1f2937]">{order.paymentStatus}</p>
                        </div>
                        <div className="rounded-lg bg-[#f8fafc] px-3 py-2">
                          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.05em] text-[#64748b]">Items</p>
                          <p className="text-[0.95rem] font-bold text-[#1f2937]">{(order.items || []).length}</p>
                        </div>
                      </div>

                      <div className="mt-3 rounded-lg border border-[#f3d9e1] bg-[#fff7fa] px-3 py-2">
                        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.05em] text-[#7c3f52]">Coupon Details</p>
                        {order.coupon?.couponCode ? (
                          <p className="mt-1 text-[0.86rem] text-[#4b5563]">
                            Code: <span className="font-semibold text-[#1f2937]">{order.coupon.couponCode}</span> | Type:{" "}
                            <span className="font-semibold text-[#1f2937]">{order.coupon.discountType || "-"}</span> | Value:{" "}
                            <span className="font-semibold text-[#1f2937]">{formatDiscount(order.coupon)}</span> | Saved:{" "}
                            <span className="font-semibold text-[#0f766e]">{formatMoney(order.couponDiscount ?? order.coupon?.discountAmount)}</span>
                          </p>
                        ) : (
                          <p className="mt-1 text-[0.86rem] text-[#6b7280]">No coupon applied</p>
                        )}
                      </div>

                      <p className="mt-3 text-[0.84rem] font-semibold text-[#475569]">Items Preview:</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {(order.items || []).slice(0, 3).map((item, idx) => (
                          <span key={`${item.itemId}-${idx}`} className="rounded-full bg-[#eef2f7] px-2.5 py-1 text-[0.78rem] text-[#334155]">
                            {item.itemName} x{item.quantity}
                          </span>
                        ))}
                        {(order.items || []).length > 3 && (
                          <span className="rounded-full bg-[#ffe8ef] px-2.5 py-1 text-[0.78rem] font-semibold text-[#ef2c5b]">
                            +{(order.items || []).length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 md:flex-col md:items-end">
                      <span className={`rounded-full px-3 py-1 text-[0.8rem] font-semibold ${getStatusPillClass(order.orderStatus)}`}>
                        {prettyStatus(order.orderStatus)}
                      </span>
                      <button
                        onClick={() => setOpenTrackId((prev) => (prev === order._id ? null : order._id))}
                        className="rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-[0.8rem] font-semibold text-[#334155]"
                      >
                        Track Status
                      </button>
                      <button
                        onClick={() => setOpenDetailsId((prev) => (prev === order._id ? null : order._id))}
                        className="rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-[0.8rem] font-semibold text-[#334155]"
                      >
                        View Full Details
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 rounded-lg bg-[#f8fafc] p-3 md:grid-cols-[1fr_auto_auto] md:items-center">
                    <label className="grid gap-1">
                      <span className="text-[0.74rem] font-semibold uppercase tracking-[0.06em] text-[#64748b]">Update Status</span>
                      <select
                        value={statusDrafts[order._id] || order.orderStatus}
                        onChange={(e) => setStatusDrafts((prev) => ({ ...prev, [order._id]: e.target.value }))}
                        className="h-9 rounded-lg border border-[#dbe2ee] bg-white px-2 text-[0.86rem] text-[#1f2937] outline-none"
                      >
                        {ORDER_STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {prettyStatus(status)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      onClick={() => handleUpdateStatus(order._id)}
                      className="rounded-lg bg-[#ef2c5b] px-4 py-2 text-[0.82rem] font-semibold text-white md:mt-5"
                    >
                      Save Status
                    </button>
                  </div>

                  {openTrackId === order._id && (
                    <div className="mt-3 rounded-lg border border-[#e5e7eb] bg-[#fcfcfd] p-3">
                      <p className="mb-2 text-[0.82rem] font-semibold text-[#475569]">Tracking Progress</p>
                      <div className="flex flex-wrap gap-2">
                        {TRACK_STEPS.map((step) => {
                          const current = TRACK_STEPS.indexOf(order.orderStatus);
                          const stepIndex = TRACK_STEPS.indexOf(step);
                          const reached = current >= stepIndex;
                          return (
                            <span
                              key={step}
                              className={`rounded-full px-2.5 py-1 text-[0.76rem] font-semibold ${
                                reached ? "bg-[#ffe8ef] text-[#ef2c5b]" : "bg-[#eef2f7] text-[#64748b]"
                              }`}
                            >
                              {prettyStatus(step)}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {openDetailsId === order._id && (
                    <div className="mt-3 rounded-lg border border-[#e5e7eb] bg-[#fcfcfd] p-3">
                      <p className="mb-2 text-[0.82rem] font-semibold text-[#475569]">Order Items</p>
                      <div className="grid gap-2">
                        {(order.items || []).map((item, idx) => (
                          <div key={`${item.itemId}-${idx}`} className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2 text-[0.85rem]">
                            <span className="font-medium text-[#1f2937]">
                              {item.itemName} x{item.quantity}
                            </span>
                            <span className="font-semibold text-[#334155]">{formatMoney(item.totalPrice)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 grid gap-1 text-[0.84rem] text-[#475569]">
                        <p>Items Total: <span className="font-semibold">{formatMoney(order.itemsTotal)}</span></p>
                        <p>Coupon Discount: <span className="font-semibold">{formatMoney(order.couponDiscount)}</span></p>
                        <p>Final Amount: <span className="font-semibold">{formatMoney(order.finalAmount)}</span></p>
                        <p>Coupon Code: <span className="font-semibold">{order.coupon?.couponCode || "-"}</span></p>
                        <p>Coupon Type: <span className="font-semibold">{order.coupon?.discountType || "-"}</span></p>
                        <p>Coupon Value: <span className="font-semibold">{formatDiscount(order.coupon)}</span></p>
                        <p>Coupon Discount Amount: <span className="font-semibold">{formatMoney(order.coupon?.discountAmount)}</span></p>
                      </div>
                    </div>
                  )}
                </article>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
}
