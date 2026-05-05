import React, { useEffect, useState } from "react";
import { apiUrl } from "../services/apiClient";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AdminTopbar from "../components/AdminTopbar";

function formatDate(dateValue) {
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

export default function AdminCouponsPage() {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCoupons = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("urbanSpoonToken");
    if (!token) {
      setError("Please login as admin.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(apiUrl("/api/coupons"), {
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
        throw new Error(data?.message || "Failed to fetch coupons.");
      }

      setCoupons(Array.isArray(data?.coupons) ? data.coupons : []);
    } catch (err) {
      setError(err.message || "Unable to fetch coupons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleToggleStatus = async (couponId, nextStatus) => {
    const token = localStorage.getItem("urbanSpoonToken");
    if (!token) {
      setError("Please login as admin.");
      return;
    }

    try {
      const response = await fetch(apiUrl(`/api/coupons/${couponId}/status`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: nextStatus }),
      });

      const raw = await response.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error("Invalid server response format.");
      }

      if (!response.ok) {
        throw new Error(data?.message || "Failed to update coupon.");
      }

      setCoupons((prev) =>
        prev.map((coupon) => (String(coupon._id) === String(couponId) ? { ...coupon, isActive: nextStatus } : coupon))
      );
    } catch (err) {
      setError(err.message || "Unable to update coupon status.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f6] text-[#11182f]">
      <AdminTopbar />

      <main className="mx-auto grid min-h-[calc(100vh-5.5rem)] max-w-[1440px] grid-cols-[280px_1fr] max-[1100px]:grid-cols-1">
        <Sidebar />

        <section className="px-6 py-6 max-[700px]:px-4">
          <div className="mb-6 flex items-end justify-between gap-4 max-[820px]:flex-col max-[820px]:items-start">
            <div>
              <h2 className="text-[1.9rem] font-bold text-[#11182f] max-[920px]:text-[1.6rem]">Coupons Management</h2>
              <p className="mt-1 text-[0.95rem] text-[#52627a]">View all coupons and control active/inactive status.</p>
            </div>
            <button
              onClick={() => navigate("/admin/coupons/create")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#ef2c5b] px-5 py-2.5 text-[0.92rem] font-semibold text-white shadow-[0_8px_20px_rgba(239,44,91,0.26)]"
            >
              Create New Coupon
            </button>
          </div>

          <div className="overflow-hidden rounded-[1.1rem] border border-[#e4e7ee] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px]">
                <thead className="border-b border-[#edf0f6] bg-[#fbfbfd]">
                  <tr className="text-left text-[0.82rem] uppercase tracking-[0.04em] text-[#425774]">
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Value</th>
                    <th className="px-4 py-3">Min Order</th>
                    <th className="px-4 py-3">Max Discount</th>
                    <th className="px-4 py-3">Expiry</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {error && (
                    <tr>
                      <td colSpan={8} className="px-4 py-3 text-center text-[0.9rem] font-semibold text-[#ef2c5b]">
                        {error}
                      </td>
                    </tr>
                  )}
                  {loading && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-[#6d7588]">
                        Loading coupons...
                      </td>
                    </tr>
                  )}
                  {!loading && !error && coupons.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-[#6d7588]">
                        No coupons found.
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    coupons.map((coupon) => (
                      <tr key={coupon._id} className="border-b border-[#edf0f6] last:border-b-0">
                        <td className="px-4 py-3 font-semibold text-[#1f2a3d]">{coupon.couponCode}</td>
                        <td className="px-4 py-3 text-[#46566f]">{coupon.discountType}</td>
                        <td className="px-4 py-3 text-[#46566f]">{coupon.discountValue}</td>
                        <td className="px-4 py-3 text-[#46566f]">{coupon.minOrderAmount}</td>
                        <td className="px-4 py-3 text-[#46566f]">{coupon.maxDiscount ?? "-"}</td>
                        <td className="px-4 py-3 text-[#46566f]">{formatDate(coupon.expiryDate)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[0.8rem] font-semibold ${
                              coupon.isActive ? "bg-[#d6f0de] text-[#1f7f40]" : "bg-[#ffe0e8] text-[#c62854]"
                            }`}
                          >
                            {coupon.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleStatus(coupon._id, !coupon.isActive)}
                            className={`rounded-lg px-3 py-1.5 text-[0.82rem] font-semibold ${
                              coupon.isActive ? "bg-[#ffe4eb] text-[#ef2c5b]" : "bg-[#dbf4e4] text-[#187a3a]"
                            }`}
                          >
                            Mark as {coupon.isActive ? "Inactive" : "Active"}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
