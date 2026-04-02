import React, { useState } from "react";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getFieldClass,
  validateEmail,
  validatePassword,
  VALIDATION_ERROR_TEXT_CLASS,
} from "../utils/validation";

function BrandIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 3V14M10 3V14M8 14V21M15 3V8M19 3V21M15 8H19"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5.5 8L12 13L18.5 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5.5" y="10.5" width="13" height="9" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 10.5V8.5C8.5 6.3 10 4.8 12 4.8C14 4.8 15.5 6.3 15.5 8.5V10.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2V14h5.4C17 15.2 14.9 17 12 17A5 5 0 1 1 12 7c1.4 0 2.7.5 3.6 1.4l2.7-2.7A8.9 8.9 0 0 0 12 3a9 9 0 1 0 0 18c5.2 0 8.7-3.7 8.7-8.9 0-.6-.1-1.2-.2-1.9H12Z" />
      <path fill="#34A853" d="M4 7.7l3.1 2.3C8 8 9.8 7 12 7c1.4 0 2.7.5 3.6 1.4l2.7-2.7A8.9 8.9 0 0 0 12 3C8.5 3 5.4 5 4 7.7Z" />
      <path fill="#FBBC05" d="M12 21c2.8 0 5.2-.9 6.9-2.5L15.7 16c-1 .7-2.3 1-3.7 1-2.9 0-5-1.9-5.8-4.6L3 15c1.4 3.7 4.9 6 9 6Z" />
      <path fill="#4285F4" d="M21 12.1c0-.6-.1-1.2-.2-1.9H12V14h5.4c-.3 1.2-1 2.1-1.7 2.8l3.2 2.5c1.9-1.8 3.1-4.4 3.1-7.2Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="2.5" fill="#1877F2" />
      <path d="M13.5 20V12.8H15.9L16.2 10H13.5V8.2C13.5 7.4 13.7 6.8 14.9 6.8H16.3V4.3C16 4.3 15.1 4.2 14.1 4.2C11.9 4.2 10.4 5.5 10.4 8V10H8V12.8H10.4V20H13.5Z" fill="#fff" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20L20 12L4 4L6.5 10.5L14 12L6.5 13.5L4 20Z" />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn, user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));

    if (name === "email") {
      setFieldErrors((prev) => ({ ...prev, email: value.trim() ? validateEmail(value) : "" }));
    }

    if (name === "password") {
      setFieldErrors((prev) => ({ ...prev, password: value ? validatePassword(value) : "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const nextFieldErrors = { email: emailError, password: passwordError };
    setFieldErrors(nextFieldErrors);

    if (emailError || passwordError) {
      return setError("Please fix the highlighted fields.");
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const raw = await response.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        if (raw.trim().startsWith("<!DOCTYPE")) {
          throw new Error("Received HTML instead of JSON. Please verify the backend API URL/server.");
        }
        throw new Error("Invalid server response format.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please check your credentials.");
      }

      login(data.token, data);

      const role = String(data?.role || "user").toLowerCase();
      const defaultDestination = role === "admin" ? "/admin" : "/dashboard";
      const destination = location.state?.from?.pathname || defaultDestination;
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    const role = String(user?.role || "user").toLowerCase();
    return <Navigate to={role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return (
    <main className="min-h-screen bg-[#f9f7f4] text-[#10182f]">
      <section className="relative grid min-h-[calc(100vh-4.5rem)] place-items-center overflow-hidden px-4 py-8 max-[900px]:min-h-0 max-[900px]:py-6">
        <div
          className="absolute inset-0 scale-[1.02]"
          style={{
            background:
              'radial-gradient(circle at 18% 20%, rgba(248, 203, 196, 0.65), transparent 24%), radial-gradient(circle at 86% 18%, rgba(255, 255, 255, 0.8), transparent 16%), radial-gradient(circle at 84% 78%, rgba(212, 237, 244, 0.6), transparent 22%), radial-gradient(circle at 12% 88%, rgba(245, 215, 190, 0.45), transparent 20%), linear-gradient(rgba(255, 255, 255, 0.46), rgba(255, 255, 255, 0.46)), url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=80") center/cover no-repeat',
            filter: 'blur(2px)',
          }}
        />

        <div className="relative z-[1] grid w-[min(29rem,100%)] gap-4 rounded-[1.125rem] bg-[rgba(255,255,255,0.96)] p-8 text-center shadow-[0_28px_60px_rgba(15,23,42,0.14)] max-[900px]:p-6 max-[640px]:w-[min(100%-1rem,1120px)]">
          <div className="mx-auto h-[4.25rem] w-[4.25rem] rounded-full bg-[#f8dde5] p-[1.2rem] text-[#ef2c5b]">
            <LockBadgeIcon />
          </div>

          <h1 className="text-[clamp(2.2rem,4vw,3.2rem)] leading-none text-[#11182f]">Welcome Back</h1>
          <p className="mx-auto max-w-[23rem] text-[#5f6d87]">
            Log in to your Urban Spoon account to manage your reservations
          </p>

          <form className="grid gap-4 text-left" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-[0.5rem] bg-[#ffe3ea] px-4 py-3 text-[0.95rem] font-semibold text-[#ef2c5b]">
                {error}
              </div>
            )}
            
            <label className="grid gap-2">
              <span className="text-[0.95rem] font-semibold text-[#12192f]">Email Address</span>
              <div className={getFieldClass("flex min-h-[3.625rem] items-center gap-3 rounded-[0.875rem] border border-[#dbe2ee] bg-white px-4", fieldErrors.email)}>
                <div className="h-[1.375rem] w-[1.375rem] shrink-0 text-[#93a1ba]">
                  <MailIcon />
                </div>
                <input
                  className="w-full border-0 bg-transparent text-[#1d2842] outline-none placeholder:text-[#7b889f]"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@example.com"
                  required
                />
              </div>
              {fieldErrors.email && <p className={VALIDATION_ERROR_TEXT_CLASS}>{fieldErrors.email}</p>}
            </label>

            <label className="grid gap-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[0.95rem] font-semibold text-[#12192f]">Password</span>
                <a className="font-semibold text-[#ef2c5b] no-underline" href="#forgot">Forgot Password?</a>
              </div>
              <div className={getFieldClass("flex min-h-[3.625rem] items-center gap-3 rounded-[0.875rem] border border-[#dbe2ee] bg-white px-4", fieldErrors.password)}>
                <div className="h-[1.375rem] w-[1.375rem] shrink-0 text-[#93a1ba]">
                  <LockIcon />
                </div>
                <input
                  className="w-full border-0 bg-transparent text-[#1d2842] outline-none placeholder:text-[#7b889f]"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="........"
                  required
                />
              </div>
              {fieldErrors.password && <p className={VALIDATION_ERROR_TEXT_CLASS}>{fieldErrors.password}</p>}
            </label>

            <label className="flex items-center gap-3 text-[#495774]">
              <input
                className="m-0 mt-[0.15rem] h-[1.15rem] w-[1.15rem] shrink-0 cursor-pointer accent-[#ef2c5b]"
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span>Remember me for 30 days</span>
            </label>

            <button
              className="min-h-[3.75rem] rounded-[0.875rem] bg-[#ef2c5b] font-bold text-white shadow-[0_16px_26px_rgba(239,44,91,0.26)] disabled:opacity-70 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="flex items-center justify-center gap-3 text-[0.9rem] text-[#7a879e]">
              <span className="h-px flex-1 bg-[#e1e7f0]" />
              <span>OR CONTINUE WITH</span>
              <span className="h-px flex-1 bg-[#e1e7f0]" />
            </div>

            <div className="grid grid-cols-2 gap-3 max-[640px]:grid-cols-1">
              <button className="inline-flex min-h-[3.25rem] items-center justify-center gap-3 rounded-[0.875rem] border border-[#dbe2ee] bg-white text-[#1a243d]" type="button">
                <span className="h-[1.625rem] w-[1.625rem]"><GoogleIcon /></span>
                <span>Google</span>
              </button>
              <button className="inline-flex min-h-[3.25rem] items-center justify-center gap-3 rounded-[0.875rem] border border-[#dbe2ee] bg-white text-[#1a243d]" type="button">
                <span className="h-[1.625rem] w-[1.625rem]"><FacebookIcon /></span>
                <span>Facebook</span>
              </button>
            </div>

            <p className="text-center text-[#495774]">
              Don’t have an account? <Link className="font-semibold text-[#ef2c5b] no-underline" to="/register">Create an account</Link>
            </p>
          </form>
        </div>
      </section>

      <footer className="bg-white px-0 pb-6 pt-0">
        <div className="mx-auto grid w-[min(1120px,calc(100%-2rem))] grid-cols-[1.25fr_1fr_1.1fr] gap-8 py-8 max-[900px]:grid-cols-1 max-[640px]:w-[min(100%-1rem,1120px)]">
          <div className="grid content-start gap-3">
            <div className="inline-flex items-center gap-3 text-[1.08rem] font-bold text-[#11182f]">
              <span className="h-7 w-7 text-[#ef2c5b]"><BrandIcon /></span>
              <span>Urban Spoon</span>
            </div>
            <p className="max-w-[22rem] leading-[1.6] text-[#5e6d87]">
              Crafting unforgettable culinary experiences since 2010. Fresh
              ingredients, modern techniques, and a touch of urban soul.
            </p>
          </div>

          <div className="grid content-start gap-3">
            <h2 className="text-base text-[#12182f]">Quick Links</h2>
            <a className="text-[#30405f] no-underline" href="#story">Our Story</a>
            <a className="text-[#30405f] no-underline" href="#careers">Careers</a>
            <a className="text-[#30405f] no-underline" href="#privacy">Privacy Policy</a>
            <a className="text-[#30405f] no-underline" href="#terms">Terms of Service</a>
          </div>

          <div className="grid content-start gap-3">
            <h2 className="text-base text-[#12182f]">Newsletter</h2>
            <div className="flex items-center gap-2">
              <input className="min-h-[3.625rem] flex-1 rounded-[0.875rem] border border-[#dbe2ee] px-4 outline-none" type="email" placeholder="Your email" />
              <button className="h-[3.625rem] min-w-12 rounded-[0.875rem] bg-[#ef2c5b] p-[0.625rem] text-white" type="button" aria-label="Submit email">
                <span className="h-full w-full"><SendIcon /></span>
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto w-[min(1120px,calc(100%-2rem))] border-t border-[#e6ebf4] pt-4 text-center text-[#73829d] max-[640px]:w-[min(100%-1rem,1120px)]">
          <p>© 2024 Urban Spoon Restaurant Group. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
