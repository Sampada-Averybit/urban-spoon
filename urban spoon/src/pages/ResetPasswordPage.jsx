import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiUrl } from "../services/apiClient";
import {
  getFieldClass,
  validatePassword,
  VALIDATION_ERROR_TEXT_CLASS,
} from "../utils/validation";

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5.5" y="10.5" width="13" height="9" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 10.5V8.5C8.5 6.3 10 4.8 12 4.8C14 4.8 15.5 6.3 15.5 8.5V10.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function ResetPasswordPage() {
  const { token } = useParams();
  const safeToken = useMemo(() => String(token || "").trim(), [token]);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const passwordError = validatePassword(formData.newPassword);
    const confirmError =
      formData.newPassword !== formData.confirmPassword ? "Passwords do not match." : "";
    const nextFieldErrors = {
      newPassword: passwordError,
      confirmPassword: confirmError,
    };
    setFieldErrors(nextFieldErrors);

    if (passwordError || confirmError) {
      setError("Please fix the highlighted fields.");
      return;
    }

    if (!safeToken) {
      setError("Missing reset token. Please open the reset link from your email again.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(apiUrl(`/api/users/reset-password/${safeToken}`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to reset password.");
      }
      setSuccessMessage(data.message || "Password reset successful.");
      setFormData({ newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f9f7f4] px-4 py-8 text-[#10182f]">
      <section className="mx-auto grid w-[min(30rem,100%)] gap-4 rounded-[1.125rem] bg-white p-8 shadow-[0_28px_60px_rgba(15,23,42,0.1)] max-[640px]:p-6">
        <h1 className="text-center text-[2rem] leading-none text-[#11182f]">Reset Password</h1>
        <p className="text-center text-[#5f6d87]">Set a new password for your account.</p>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-[0.5rem] bg-[#ffe3ea] px-4 py-3 text-[0.95rem] font-semibold text-[#ef2c5b]">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="rounded-[0.5rem] bg-[#e8fff1] px-4 py-3 text-[0.95rem] font-semibold text-[#147a43]">
              {successMessage}
            </div>
          )}

          <label className="grid gap-2">
            <span className="text-[0.95rem] font-semibold text-[#12192f]">New Password</span>
            <div className={getFieldClass("flex min-h-[3.625rem] items-center gap-3 rounded-[0.875rem] border border-[#dbe2ee] bg-white px-4", fieldErrors.newPassword)}>
              <div className="h-[1.375rem] w-[1.375rem] shrink-0 text-[#93a1ba]">
                <LockIcon />
              </div>
              <input
                className="w-full border-0 bg-transparent text-[#1d2842] outline-none placeholder:text-[#7b889f]"
                type="password"
                value={formData.newPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({ ...prev, newPassword: value }));
                  setFieldErrors((prev) => ({
                    ...prev,
                    newPassword: value ? validatePassword(value) : "",
                  }));
                }}
                placeholder="Enter new password"
                required
              />
            </div>
            {fieldErrors.newPassword && <p className={VALIDATION_ERROR_TEXT_CLASS}>{fieldErrors.newPassword}</p>}
          </label>

          <label className="grid gap-2">
            <span className="text-[0.95rem] font-semibold text-[#12192f]">Confirm Password</span>
            <div className={getFieldClass("flex min-h-[3.625rem] items-center gap-3 rounded-[0.875rem] border border-[#dbe2ee] bg-white px-4", fieldErrors.confirmPassword)}>
              <div className="h-[1.375rem] w-[1.375rem] shrink-0 text-[#93a1ba]">
                <LockIcon />
              </div>
              <input
                className="w-full border-0 bg-transparent text-[#1d2842] outline-none placeholder:text-[#7b889f]"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({ ...prev, confirmPassword: value }));
                  setFieldErrors((prev) => ({
                    ...prev,
                    confirmPassword:
                      value && value !== formData.newPassword ? "Passwords do not match." : "",
                  }));
                }}
                placeholder="Confirm new password"
                required
              />
            </div>
            {fieldErrors.confirmPassword && <p className={VALIDATION_ERROR_TEXT_CLASS}>{fieldErrors.confirmPassword}</p>}
          </label>

          <button
            className="min-h-[3.75rem] rounded-[0.875rem] bg-[#ef2c5b] font-bold text-white shadow-[0_16px_26px_rgba(239,44,91,0.26)] disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

          <p className="text-center text-[#495774]">
            Back to{" "}
            <Link className="font-semibold text-[#ef2c5b] no-underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
