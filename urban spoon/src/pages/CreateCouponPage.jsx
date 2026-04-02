import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCouponApi } from "../services/couponApi";
import Sidebar from "../components/Sidebar";
import AdminTopbar from "../components/AdminTopbar";

function toDateTimeLocalValue(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function CreateCouponPage() {
  const navigate = useNavigate();
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return toDateTimeLocalValue(d);
  }, []);

  const [form, setForm] = useState({
    couponCode: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minOrderAmount: "0",
    maxDiscount: "",
    expiryDate: tomorrow,
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.couponCode.trim()) {
      setError("Coupon code is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        couponCode: form.couponCode.trim().toUpperCase(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount || 0),
        maxDiscount: form.discountType === "PERCENTAGE" && form.maxDiscount !== "" ? Number(form.maxDiscount) : null,
        expiryDate: new Date(form.expiryDate).toISOString(),
        isActive: Boolean(form.isActive),
      };

      const data = await createCouponApi(payload);
      setSuccess(`Coupon created: ${data?.coupon?.couponCode || payload.couponCode}`);
      setForm((prev) => ({
        ...prev,
        couponCode: "",
        discountValue: "",
        maxDiscount: "",
      }));
    } catch (err) {
      setError(err.message || "Unable to create coupon.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f6]">
      <AdminTopbar />

      <main className="mx-auto grid min-h-[calc(100vh-5.5rem)] max-w-[1440px] grid-cols-[280px_1fr] max-[1100px]:grid-cols-1">
        <Sidebar />

        <section className="px-6 py-6 max-[700px]:px-4">
          <button
            onClick={() => navigate("/admin/coupons")}
            className="mb-5 rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-[0.88rem] font-semibold text-[#334155] hover:bg-[#f8fafc]"
          >
            Back
          </button>

          <section className="max-w-[760px] rounded-[1rem] border border-[#f1d6de] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
            <h1 className="text-[1.8rem] font-bold text-[#0f1833]">Create Coupon</h1>
            <p className="mt-1 text-[0.92rem] text-[#6b7280]">Configure and create a discount coupon.</p>

            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-1.5">
              <span className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Coupon Code</span>
              <input
                type="text"
                value={form.couponCode}
                onChange={(e) => onChange("couponCode", e.target.value)}
                placeholder="URBAN20"
                className="min-h-[2.9rem] rounded-[0.65rem] border border-[#e5e7eb] px-3.5 text-[0.95rem] outline-none focus:border-[#ef2c5b]"
                required
              />
            </label>

            <div className="grid grid-cols-2 gap-3 max-[640px]:grid-cols-1">
              <label className="grid gap-1.5">
                <span className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Discount Type</span>
                <select
                  value={form.discountType}
                  onChange={(e) => onChange("discountType", e.target.value)}
                  className="min-h-[2.9rem] rounded-[0.65rem] border border-[#e5e7eb] px-3.5 text-[0.95rem] outline-none focus:border-[#ef2c5b]"
                >
                  <option value="PERCENTAGE">PERCENTAGE</option>
                  <option value="FLAT">FLAT</option>
                </select>
              </label>

              <label className="grid gap-1.5">
                <span className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Discount Value</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.discountValue}
                  onChange={(e) => onChange("discountValue", e.target.value)}
                  className="min-h-[2.9rem] rounded-[0.65rem] border border-[#e5e7eb] px-3.5 text-[0.95rem] outline-none focus:border-[#ef2c5b]"
                  required
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 max-[640px]:grid-cols-1">
              <label className="grid gap-1.5">
                <span className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Min Order Amount</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.minOrderAmount}
                  onChange={(e) => onChange("minOrderAmount", e.target.value)}
                  className="min-h-[2.9rem] rounded-[0.65rem] border border-[#e5e7eb] px-3.5 text-[0.95rem] outline-none focus:border-[#ef2c5b]"
                />
              </label>

              <label className="grid gap-1.5">
                <span className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Max Discount (Optional)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.maxDiscount}
                  onChange={(e) => onChange("maxDiscount", e.target.value)}
                  disabled={form.discountType !== "PERCENTAGE"}
                  className="min-h-[2.9rem] rounded-[0.65rem] border border-[#e5e7eb] px-3.5 text-[0.95rem] outline-none focus:border-[#ef2c5b] disabled:bg-[#f3f4f6]"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 max-[640px]:grid-cols-1">
              <label className="grid gap-1.5">
                <span className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Expiry Date</span>
                <input
                  type="datetime-local"
                  value={form.expiryDate}
                  onChange={(e) => onChange("expiryDate", e.target.value)}
                  className="min-h-[2.9rem] rounded-[0.65rem] border border-[#e5e7eb] px-3.5 text-[0.95rem] outline-none focus:border-[#ef2c5b]"
                  required
                />
              </label>

              <label className="mt-[1.55rem] inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => onChange("isActive", e.target.checked)}
                />
                <span className="text-[0.92rem] text-[#334155]">Active coupon</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 rounded-full bg-[#ef2c5b] px-7 py-3 text-[0.9rem] font-bold text-white hover:bg-[#db2551] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Creating..." : "Create Coupon"}
            </button>

            {success && (
              <div className="rounded-[0.65rem] bg-[#dcfce7] px-4 py-3 text-[0.88rem] font-semibold text-[#166534]">
                {success}
              </div>
            )}
            {error && (
              <div className="rounded-[0.65rem] bg-[#ffe3ea] px-4 py-3 text-[0.88rem] font-semibold text-[#ef2c5b]">
                {error}
              </div>
            )}
            </form>
          </section>
        </section>
      </main>
    </div>
  );
}
