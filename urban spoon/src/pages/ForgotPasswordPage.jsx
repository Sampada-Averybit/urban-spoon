import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../services/apiClient";
import {
  getFieldClass,
  validateEmail,
  VALIDATION_ERROR_TEXT_CLASS,
} from "../utils/validation";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5.5 8L12 13L18.5 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="6" y="10.5" width="12" height="8.5" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 10.5V8.7C9 6.8 10.3 5.5 12 5.5C13.7 5.5 15 6.8 15 8.7V10.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const emailError = validateEmail(email);
    setFieldError(emailError);
    if (emailError) {
      setError("Please fix the highlighted field.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(apiUrl("/api/users/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to send reset link.");
      }
      setSuccessMessage(data.message || "Password reset link sent to your email.");
      setEmail("");
    } catch (err) {
      setError(err.message || "Unable to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f9f7f4] px-4 py-8 text-[#10182f]">
      <section className="mx-auto grid w-[min(30rem,100%)] gap-4 rounded-[1.125rem] bg-white p-8 shadow-[0_28px_60px_rgba(15,23,42,0.1)] max-[640px]:p-6">
        <div className="mx-auto h-[4.25rem] w-[4.25rem] rounded-full bg-[#f8dde5] p-[1.2rem] text-[#ef2c5b]">
          <LockBadgeIcon />
        </div>

        <h1 className="text-center text-[2rem] leading-none text-[#11182f]">Forgot Password</h1>
        <p className="text-center text-[#5f6d87]">
          Enter your email and we will send a secure reset link.
        </p>

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
            <span className="text-[0.95rem] font-semibold text-[#12192f]">Email Address</span>
            <div className={getFieldClass("flex min-h-[3.625rem] items-center gap-3 rounded-[0.875rem] border border-[#dbe2ee] bg-white px-4", fieldError)}>
              <div className="h-[1.375rem] w-[1.375rem] shrink-0 text-[#93a1ba]">
                <MailIcon />
              </div>
              <input
                className="w-full border-0 bg-transparent text-[#1d2842] outline-none placeholder:text-[#7b889f]"
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  const value = e.target.value;
                  setEmail(value);
                  setFieldError(value.trim() ? validateEmail(value) : "");
                }}
                placeholder="alex@example.com"
                required
              />
            </div>
            {fieldError && <p className={VALIDATION_ERROR_TEXT_CLASS}>{fieldError}</p>}
          </label>

          <button
            className="min-h-[3.75rem] rounded-[0.875rem] bg-[#ef2c5b] font-bold text-white shadow-[0_16px_26px_rgba(239,44,91,0.26)] disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
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
