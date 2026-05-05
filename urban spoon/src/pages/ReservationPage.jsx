import React, { useMemo, useState } from "react";
import { apiUrl } from "../services/apiClient";
import { Link } from "react-router-dom";
import {
  getFieldClass,
  validatePhone,
  validateEmail,
  VALIDATION_ERROR_TEXT_CLASS,
} from "../utils/validation";

const timeSlots = ["7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"];

function BadgeIcon({ children, color }) {
  return (
    <div className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full ${color}`}>
      {children}
    </div>
  );
}

export default function ReservationPage() {
  const storedUser = useMemo(() => {
    const userStr = localStorage.getItem("urbanSpoonUser");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }, []);

  const [formData, setFormData] = useState({
    date: "",
    guests: 2,
    time: "7:00 PM",
    notes: "",
    fullName: storedUser?.name || "",
    phone: storedUser?.phone || "",
    email: storedUser?.email || "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    phone: "",
    email: "",
  });

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "phone") {
      setFieldErrors((prev) => ({ ...prev, phone: value.trim() ? validatePhone(value) : "" }));
    }

    if (name === "email") {
      setFieldErrors((prev) => ({ ...prev, email: value.trim() ? validateEmail(value) : "" }));
    }
  };

  const adjustGuests = (delta) => {
    setFormData((prev) => ({
      ...prev,
      guests: Math.max(1, prev.guests + delta),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const nextFieldErrors = {
      phone: validatePhone(formData.phone),
      email: validateEmail(formData.email),
    };
    setFieldErrors(nextFieldErrors);

    if (nextFieldErrors.phone || nextFieldErrors.email) {
      setErrorMessage("Please fix the highlighted contact fields.");
      return;
    }

    const token = localStorage.getItem("urbanSpoonToken");
    if (!token) {
      setErrorMessage("Please login to reserve a table.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(apiUrl("/api/reservations"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: formData.date,
          numberOfGuests: formData.guests,
          preferredTime: formData.time,
          specialRequests: formData.notes,
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
        throw new Error(data.message || "Failed to create reservation.");
      }

      setSuccessMessage("Table booking confirmed. We will contact you shortly.");
      setFormData((prev) => ({ ...prev, notes: "" }));
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong while creating reservation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f1f3] text-[#12182f]">
      <section className="relative h-[360px] overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2000&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1240px] items-center justify-center px-6 text-center text-white">
          <div>
            <p className="font-['Playfair_Display',serif] text-[2.2rem] italic leading-none text-white">Your dining table</p>
            <h1 className="mt-2 text-[3.8rem] font-bold leading-none max-[760px]:text-[2.8rem]">awaits</h1>
            <p className="mt-3 text-[1.2rem] text-white/95 max-[760px]:text-[0.98rem]">
              Experience the intersection of urban energy and refined elegance.<br />
              Secure your table today.
            </p>
          </div>
        </div>
      </section>

      <main className="relative z-10 -mt-16 px-4 pb-12">
        <div className="mx-auto w-full max-w-[960px] rounded-[0.9rem] bg-[#f7f6f7] p-7 shadow-[0_20px_50px_rgba(0,0,0,0.08)] max-[760px]:p-5">
          <div className="text-center">
            <h2 className="text-[2rem] font-bold text-[#11182f]">Reserve Your Table</h2>
            <p className="mt-1.5 text-[0.9rem] text-[#6b7280]">Complete the details below to secure your dining experience.</p>
          </div>

          <form className="mt-7 grid gap-7" onSubmit={handleSubmit}>
            <section>
              <div className="mb-3 flex items-center gap-2.5">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#ef2c5b] text-[0.75rem] font-bold text-white">1</span>
                <h3 className="text-[1.35rem] font-semibold text-[#11182f]">Booking Details</h3>
              </div>

              <div className="grid grid-cols-2 gap-3 max-[760px]:grid-cols-1">
                <label className="grid gap-1.5">
                  <span className="text-[0.78rem] font-semibold uppercase tracking-wider text-[#6b7280]">Select Date</span>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateField("date", e.target.value)}
                    className="min-h-[2.9rem] rounded-[0.6rem] border border-[#e7e5e8] bg-[#f2f0f2] px-3.5 text-[0.92rem] outline-none focus:border-[#ef2c5b]"
                    required
                  />
                </label>

                <div className="grid gap-1.5">
                  <span className="text-[0.78rem] font-semibold uppercase tracking-wider text-[#6b7280]">Number of Guests</span>
                  <div className="flex min-h-[2.9rem] items-center justify-between rounded-[0.6rem] border border-[#e7e5e8] bg-[#f2f0f2] px-3.5">
                    <button type="button" onClick={() => adjustGuests(-1)} className="text-[1.2rem] font-bold text-[#ef2c5b]">−</button>
                    <span className="font-semibold">{formData.guests} Guests</span>
                    <button type="button" onClick={() => adjustGuests(1)} className="text-[1.2rem] font-bold text-[#ef2c5b]">+</button>
                  </div>
                </div>
              </div>

              <div className="mt-3 grid gap-1.5">
                <span className="text-[0.78rem] font-semibold uppercase tracking-wider text-[#6b7280]">Preferred Time</span>
                <div className="grid grid-cols-5 gap-2 max-[760px]:grid-cols-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => updateField("time", slot)}
                      className={`min-h-[2.6rem] rounded-[0.55rem] text-[0.82rem] font-semibold transition-colors ${
                        formData.time === slot ? "bg-[#ef2c5b] text-white" : "bg-[#efecf0] text-[#374151] hover:bg-[#e9e5e8]"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <label className="mt-3 grid gap-1.5">
                <span className="text-[0.78rem] font-semibold uppercase tracking-wider text-[#6b7280]">Dietary Notes or Special Requests</span>
                <textarea
                  value={formData.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="Any dietary requirements or special occasions..."
                  rows={2}
                  className="rounded-[0.6rem] border border-[#e7e5e8] bg-[#f2f0f2] px-3.5 py-2.5 text-[0.9rem] outline-none focus:border-[#ef2c5b]"
                />
              </label>
            </section>

            <section>
              <div className="mb-3 flex items-center gap-2.5">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#ef2c5b] text-[0.75rem] font-bold text-white">2</span>
                <h3 className="text-[1.35rem] font-semibold text-[#11182f]">Contact Information</h3>
              </div>

              <div className="grid grid-cols-2 gap-3 max-[760px]:grid-cols-1">
                <label className="grid gap-1.5">
                  <span className="text-[0.78rem] font-semibold uppercase tracking-wider text-[#6b7280]">Full Name</span>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="John Doe"
                    className="min-h-[2.9rem] rounded-[0.6rem] border border-[#e7e5e8] bg-[#f2f0f2] px-3.5 text-[0.92rem] outline-none focus:border-[#ef2c5b]"
                    required
                  />
                </label>

                <label className="grid gap-1.5">
                  <span className="text-[0.78rem] font-semibold uppercase tracking-wider text-[#6b7280]">Phone Number</span>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className={getFieldClass("min-h-[2.9rem] rounded-[0.6rem] border border-[#e7e5e8] bg-[#f2f0f2] px-3.5 text-[0.92rem] outline-none focus:border-[#ef2c5b]", fieldErrors.phone)}
                    required
                  />
                  {fieldErrors.phone && <p className={VALIDATION_ERROR_TEXT_CLASS}>{fieldErrors.phone}</p>}
                </label>
              </div>

              <label className="mt-3 grid gap-1.5">
                <span className="text-[0.78rem] font-semibold uppercase tracking-wider text-[#6b7280]">Email Address</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="john@example.com"
                  className={getFieldClass("min-h-[2.9rem] rounded-[0.6rem] border border-[#e7e5e8] bg-[#f2f0f2] px-3.5 text-[0.92rem] outline-none focus:border-[#ef2c5b]", fieldErrors.email)}
                  required
                />
                {fieldErrors.email && <p className={VALIDATION_ERROR_TEXT_CLASS}>{fieldErrors.email}</p>}
              </label>
            </section>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-[0.55rem] bg-[#ef2c5b] py-3 text-[0.98rem] font-bold text-white shadow-[0_12px_26px_rgba(239,44,91,0.35)] transition-colors hover:bg-[#de2450] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Confirming..." : "Confirm Table Booking"}
              </button>
              <p className="mt-2 text-center text-[0.75rem] text-[#8f96a4]">
                By clicking confirm, you agree to our dining policy and terms of service.
              </p>
              {successMessage && (
                <div className="mt-3 rounded-[0.55rem] bg-[#dcfce7] px-4 py-2.5 text-center text-[0.88rem] font-semibold text-[#166534]">
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="mt-3 rounded-[0.55rem] bg-[#ffe3ea] px-4 py-2.5 text-center text-[0.88rem] font-semibold text-[#ef2c5b]">
                  {errorMessage}
                </div>
              )}
            </div>
          </form>
        </div>

        <section className="mx-auto mt-10 max-w-[980px] rounded-[0.9rem] bg-[#f7f6f7] px-6 py-9 text-center max-[760px]:px-5">
          <h2 className="text-[2.2rem] font-bold text-[#11182f]">The Dining Experience</h2>
          <p className="mx-auto mt-2 max-w-[700px] text-[0.92rem] leading-[1.6] text-[#6b7280]">
            We curate every detail to ensure your meal is as exceptional as the company you're with.
          </p>

          <div className="mt-7 grid grid-cols-3 gap-4 max-[900px]:grid-cols-1">
            <div>
              <BadgeIcon color="bg-[#d5ebe3]">
                <span className="text-[1rem] font-bold text-[#0f513e]">FI</span>
              </BadgeIcon>
              <h3 className="mt-3 text-[1.35rem] font-semibold">Fresh Ingredients</h3>
              <p className="mt-1.5 text-[0.86rem] leading-[1.55] text-[#6b7280]">
                Sourced daily from local organic farms for the most vibrant flavors.
              </p>
            </div>
            <div>
              <BadgeIcon color="bg-[#f3d8e1]">
                <span className="text-[1rem] font-bold text-[#8b1d48]">RA</span>
              </BadgeIcon>
              <h3 className="mt-3 text-[1.35rem] font-semibold">Refined Ambience</h3>
              <p className="mt-1.5 text-[0.86rem] leading-[1.55] text-[#6b7280]">
                Designed with intimacy in mind, featuring soft textures and warm lighting.
              </p>
            </div>
            <div>
              <BadgeIcon color="bg-[#d3efe8]">
                <span className="text-[1rem] font-bold text-[#0a6a57]">SD</span>
              </BadgeIcon>
              <h3 className="mt-3 text-[1.35rem] font-semibold">Signature Dishes</h3>
              <p className="mt-1.5 text-[0.86rem] leading-[1.55] text-[#6b7280]">
                Our culinary team brings world-class technique to every curated plate.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-10 border-t border-[rgba(0,0,0,0.06)] px-6 py-8 text-center">
        <div className="mx-auto max-w-[900px]">
          <p className="font-['Playfair_Display',serif] text-[1.7rem] text-[#ef2c5b]">Urban Spoon</p>
          <div className="mt-4 flex items-center justify-center gap-6 text-[0.86rem] text-[#6b7280] max-[760px]:flex-wrap">
            <Link to="/menu-card" className="text-[#6b7280] no-underline hover:text-[#ef2c5b]">Menu</Link>
            <Link to="/reservations" className="text-[#6b7280] no-underline hover:text-[#ef2c5b]">Reservations</Link>
            <a href="#about" className="text-[#6b7280] no-underline hover:text-[#ef2c5b]">About Us</a>
            <a href="#privacy" className="text-[#6b7280] no-underline hover:text-[#ef2c5b]">Privacy</a>
            <a href="#contact" className="text-[#6b7280] no-underline hover:text-[#ef2c5b]">Contact</a>
          </div>
          <p className="mt-5 text-[0.78rem] text-[#9ca3af]">(c) 2024 Urban Spoon. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
