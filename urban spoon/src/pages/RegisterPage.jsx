import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getFieldClass,
  validatePhone,
  validateEmail,
  validatePassword,
  VALIDATION_ERROR_TEXT_CLASS,
} from "../utils/validation";

const perks = [
  {
    title: "Exclusive Offers",
    description: "Get access to member-only discounts and seasonal specials.",
    icon: "star",
  },
  {
    title: "Faster Bookings",
    description: "Save your preferences and table choices for 1-click reservations.",
    icon: "bolt",
  },
  {
    title: "Points Program",
    description: "Earn points on every visit and redeem for delicious rewards.",
    icon: "tag",
  },
];

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

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.5L14.5 8.8L20.2 9.4L16 13.3L17.2 19L12 16L6.8 19L8 13.3L3.8 9.4L9.5 8.8L12 3.5Z" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.7 2.5L5.6 13.1H11L10.1 21.5L18.4 10.8H13L13.7 2.5Z" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 8.5V4.5H9L20.5 16L16 20.5L4.5 9V8.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="7.2" cy="7.2" r="1.2" />
      <path d="M11.5 10.5L15 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.3" />
      <path d="M5.5 19C6.7 15.9 9 14.5 12 14.5C15 14.5 17.3 15.9 18.5 19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.2L18.5 5.7V11.3C18.5 15.4 15.9 18.6 12 20.2C8.1 18.6 5.5 15.4 5.5 11.3V5.7L12 3.2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.5 12.2L11.2 13.9L14.8 10.3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="6" cy="12" r="2" />
      <circle cx="16.5" cy="6" r="2" />
      <circle cx="16.5" cy="18" r="2" />
      <path d="M7.7 10.9L14.8 7.1M7.7 13.1L14.8 16.9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.8 12H19.2M12 3.8C14.2 6 15.4 9 15.4 12C15.4 15 14.2 18 12 20.2C9.8 18 8.6 15 8.6 12C8.6 9 9.8 6 12 3.8Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function SectionIcon({ type }) {
  if (type === "star") return <StarIcon />;
  if (type === "bolt") return <BoltIcon />;
  return <TagIcon />;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));

    if (name === "email") {
      setFieldErrors((prev) => ({ ...prev, email: value.trim() ? validateEmail(value) : "" }));
    }

    if (name === "phone") {
      setFieldErrors((prev) => ({ ...prev, phone: value.trim() ? validatePhone(value) : "" }));
    }

    if (name === "password") {
      setFieldErrors((prev) => ({
        ...prev,
        password: value ? validatePassword(value) : "",
        confirmPassword:
          formData.confirmPassword && value !== formData.confirmPassword ? "Passwords do not match." : "",
      }));
    }

    if (name === "confirmPassword") {
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: value && value !== formData.password ? "Passwords do not match." : "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      return setError("Please fill out all required fields.");
    }

    const nextFieldErrors = {
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      password: validatePassword(formData.password),
      confirmPassword:
        formData.password !== formData.confirmPassword ? "Passwords do not match." : "",
    };
    setFieldErrors(nextFieldErrors);

    if (Object.values(nextFieldErrors).some(Boolean)) {
      return setError("Please fix the highlighted fields.");
    }

    if (!formData.agreeToTerms) {
      return setError("You must agree to the Terms of Service.");
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
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
        throw new Error(data.message || "Registration failed.");
      }

      navigate("/login");
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
    <main
      className="min-h-screen text-[#10182f]"
      style={{
        background:
          "radial-gradient(circle at top center, rgba(239, 56, 102, 0.1), transparent 28%), radial-gradient(circle at bottom right, rgba(178, 227, 222, 0.18), transparent 24%), #fbfbfa",
      }}
    >
      <section className="px-4 pb-12 pt-8 max-[760px]:px-0 max-[760px]:pb-8 max-[760px]:pt-6">
        <div className="mx-auto grid w-[min(1220px,100%)] grid-cols-[1fr_1.4fr] overflow-hidden rounded-[1.25rem] bg-[rgba(255,255,255,0.94)] shadow-[0_28px_60px_rgba(15,23,42,0.14)] max-[1100px]:grid-cols-1">
          <div
            className="grid content-start gap-8 px-14 py-20 max-[1100px]:p-8"
            style={{
              background:
                "radial-gradient(circle at top left, rgba(233, 241, 234, 0.95), transparent 25%), radial-gradient(circle at bottom right, rgba(255, 182, 202, 0.3), transparent 26%), linear-gradient(180deg, #f9f2f4, #fdf6f7)",
            }}
          >
            <h1 className="max-w-[11ch] text-[clamp(2.8rem,4vw,4.25rem)] leading-[0.98] text-[#10182f]">
              Join the <span className="text-[#ef2c5b]">Urban Spoon</span> Family
            </h1>

            <div className="grid gap-6">
              {perks.map((perk) => (
                <div className="grid grid-cols-[3.25rem_1fr] items-start gap-4" key={perk.title}>
                  <div className="h-[3.25rem] w-[3.25rem] rounded-[0.875rem] bg-[#ffdfe6] p-[0.8rem] text-[#ef2c5b]">
                    <SectionIcon type={perk.icon} />
                  </div>
                  <div>
                    <h2 className="text-[1.1rem] text-[#12182f]">{perk.title}</h2>
                    <p className="leading-[1.6] text-[#45516d]">{perk.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white px-[3.75rem] py-14 max-[1100px]:p-8">
            <div className="mb-8 grid gap-2">
              <h2 className="text-[2rem] text-[#12182f]">Create Account</h2>
              <p className="leading-[1.6] text-[#65728e]">Start your culinary journey with us today.</p>
            </div>

            <form className="grid gap-4" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-[0.5rem] bg-[#ffe3ea] px-4 py-3 text-[0.95rem] font-semibold text-[#ef2c5b]">
                  {error}
                </div>
              )}

              <label className="grid gap-2">
                <span className="text-[0.95rem] font-semibold text-[#111a31]">Full Name</span>
                <div className="flex min-h-[3.625rem] items-center gap-3 rounded-[0.875rem] border border-[#dce3f0] bg-white px-4">
                  <div className="h-[1.375rem] w-[1.375rem] shrink-0 text-[#97a5bc]">
                    <UserIcon />
                  </div>
                  <input
                    className="w-full border-0 bg-transparent text-[0.98rem] text-[#22304f] outline-none placeholder:text-[#7f8ba4]"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </label>

              <label className="grid gap-2">
                <span className="text-[0.95rem] font-semibold text-[#111a31]">Email Address</span>
                <div className={getFieldClass("flex min-h-[3.625rem] items-center gap-3 rounded-[0.875rem] border border-[#dce3f0] bg-white px-4", fieldErrors.email)}>
                  <div className="h-[1.375rem] w-[1.375rem] shrink-0 text-[#97a5bc]">
                    <MailIcon />
                  </div>
                  <input
                    className="w-full border-0 bg-transparent text-[0.98rem] text-[#22304f] outline-none placeholder:text-[#7f8ba4]"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                {fieldErrors.email && <p className={VALIDATION_ERROR_TEXT_CLASS}>{fieldErrors.email}</p>}
              </label>

              <label className="grid gap-2">
                <span className="text-[0.95rem] font-semibold text-[#111a31]">Phone Number</span>
                <div className={getFieldClass("flex min-h-[3.625rem] items-center gap-3 rounded-[0.875rem] border border-[#dce3f0] bg-white px-4", fieldErrors.phone)}>
                  <div className="h-[1.375rem] w-[1.375rem] shrink-0 text-[#97a5bc]">
                    <PhoneIcon />
                  </div>
                  <input
                    className="w-full border-0 bg-transparent text-[0.98rem] text-[#22304f] outline-none placeholder:text-[#7f8ba4]"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
                {fieldErrors.phone && <p className={VALIDATION_ERROR_TEXT_CLASS}>{fieldErrors.phone}</p>}
              </label>

              <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
                <label className="grid gap-2">
                  <span className="text-[0.95rem] font-semibold text-[#111a31]">Password</span>
                  <div className={getFieldClass("flex min-h-[3.625rem] items-center gap-3 rounded-[0.875rem] border border-[#dce3f0] bg-white px-4", fieldErrors.password)}>
                    <div className="h-[1.375rem] w-[1.375rem] shrink-0 text-[#97a5bc]">
                      <LockIcon />
                    </div>
                    <input
                      className="w-full border-0 bg-transparent text-[0.98rem] text-[#22304f] outline-none placeholder:text-[#7f8ba4]"
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

                <label className="grid gap-2">
                  <span className="text-[0.95rem] font-semibold text-[#111a31]">Confirm Password</span>
                  <div className={getFieldClass("flex min-h-[3.625rem] items-center gap-3 rounded-[0.875rem] border border-[#dce3f0] bg-white px-4", fieldErrors.confirmPassword)}>
                    <div className="h-[1.375rem] w-[1.375rem] shrink-0 text-[#97a5bc]">
                      <ShieldIcon />
                    </div>
                    <input
                      className="w-full border-0 bg-transparent text-[0.98rem] text-[#22304f] outline-none placeholder:text-[#7f8ba4]"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="........"
                      required
                    />
                  </div>
                  {fieldErrors.confirmPassword && <p className={VALIDATION_ERROR_TEXT_CLASS}>{fieldErrors.confirmPassword}</p>}
                </label>
              </div>

              <label className="flex items-start gap-3 text-[#6d7891]">
                <input
                  className="m-0 mt-[0.15rem] h-[1.15rem] w-[1.15rem] shrink-0 cursor-pointer accent-[#ef2c5b]"
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                />
                <span>
                  I agree to the <a className="text-[#ef2c5b] no-underline" href="#terms">Terms of Service</a> and{" "}
                  <a className="text-[#ef2c5b] no-underline" href="#privacy">Privacy Policy</a>
                </span>
              </label>

              <button
                className="min-h-16 rounded-[0.875rem] bg-[#ef2c5b] text-base font-bold text-white shadow-[0_16px_28px_rgba(239,44,91,0.24)] disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <p className="text-center text-[#5d6985]">
                Already have an account? <Link className="text-[#ef2c5b] no-underline" to="/login">Log in</Link>
              </p>
            </form>
          </div>
        </div>
      </section>

      <footer className="px-0 pb-6 pt-0">
        <div className="mx-auto grid w-[min(1220px,calc(100%-2rem))] grid-cols-[1.4fr_1fr_1fr_0.9fr] gap-6 border-t border-[#e7ebf3] py-8 max-[1100px]:grid-cols-2 max-[760px]:w-[min(100%-1rem,1220px)] max-[760px]:grid-cols-1">
          <div className="grid content-start gap-3">
            <div className="inline-flex items-center gap-3 text-[1.05rem] font-bold text-[#12182f]">
              <span className="h-[1.625rem] w-[1.625rem] text-[#ef2c5b]">
                <BrandIcon />
              </span>
              <span>Urban Spoon</span>
            </div>
            <p className="max-w-[20rem] leading-[1.6] text-[#66728d]">
              Redefining the dining experience with modern flavors and timeless
              hospitality.
            </p>
          </div>

          <div className="grid content-start gap-3">
            <h3 className="text-base text-[#11182f]">Company</h3>
            <a className="text-[#2e3a57] no-underline" href="#about">About Us</a>
            <a className="text-[#2e3a57] no-underline" href="#careers">Careers</a>
            <a className="text-[#2e3a57] no-underline" href="#press">Press</a>
          </div>

          <div className="grid content-start gap-3">
            <h3 className="text-base text-[#11182f]">Support</h3>
            <a className="text-[#2e3a57] no-underline" href="#contact">Contact</a>
            <a className="text-[#2e3a57] no-underline" href="#help">Help Center</a>
            <a className="text-[#2e3a57] no-underline" href="#terms">Terms &amp; Privacy</a>
          </div>

          <div className="grid content-start gap-3">
            <h3 className="text-base text-[#11182f]">Connect</h3>
            <div className="flex gap-3">
              <a
                className="grid h-12 w-12 place-items-center rounded-full bg-[#f1f4f9] text-[#50627f]"
                href="#"
                aria-label="Share"
              >
                <span className="h-full w-full">
                  <ShareIcon />
                </span>
              </a>
              <a
                className="grid h-12 w-12 place-items-center rounded-full bg-[#f1f4f9] text-[#50627f]"
                href="#"
                aria-label="Globe"
              >
                <span className="h-full w-full">
                  <GlobeIcon />
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto w-[min(1220px,calc(100%-2rem))] border-t border-[#e7ebf3] pt-4 text-center text-[#71809b] max-[760px]:w-[min(100%-1rem,1220px)]">
          <p>© 2024 Urban Spoon. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
