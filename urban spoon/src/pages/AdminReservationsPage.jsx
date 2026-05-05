import React, { useEffect, useState } from "react";
import { apiUrl } from "../services/apiClient";
import Sidebar from "../components/Sidebar";
import AdminTopbar from "../components/AdminTopbar";

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReservations = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("urbanSpoonToken");
    if (!token) {
      setError("Please login as admin.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(apiUrl("/api/reservations/admin"), {
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
        throw new Error(data?.message || "Failed to fetch reservations.");
      }

      setReservations(Array.isArray(data?.reservations) ? data.reservations : []);
    } catch (err) {
      setError(err.message || "Unable to fetch reservations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const upcomingReservations = reservations.filter((reservation) => {
    const reservationDate = new Date(reservation?.date);
    if (Number.isNaN(reservationDate.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    reservationDate.setHours(0, 0, 0, 0);
    return reservationDate >= today;
  });

  const handleConfirm = async (reservationId) => {
    const token = localStorage.getItem("urbanSpoonToken");
    if (!token) {
      setError("Please login as admin.");
      return;
    }

    try {
      const response = await fetch(apiUrl(`/api/reservations/${reservationId}/confirm`), {
        method: "PATCH",
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
        throw new Error(data?.message || "Failed to confirm reservation.");
      }

      setReservations((prev) =>
        prev.map((row) =>
          String(row._id) === String(reservationId)
            ? { ...row, status: "CONFIRMED", confirmedAt: new Date().toISOString() }
            : row
        )
      );
    } catch (err) {
      setError(err.message || "Unable to confirm reservation.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f6] text-[#11182f]">
      <AdminTopbar />

      <main className="mx-auto grid min-h-[calc(100vh-5.5rem)] max-w-[1440px] grid-cols-[280px_1fr] max-[1100px]:grid-cols-1">
        <Sidebar />

        <section className="px-6 py-6 max-[700px]:px-4">
          <div className="mb-6">
            <h2 className="text-[1.9rem] font-bold text-[#11182f] max-[920px]:text-[1.6rem]">Reservations Management</h2>
            <p className="mt-1 text-[0.95rem] text-[#52627a]">See all reservations and confirm pending bookings.</p>
          </div>

          <div className="grid gap-3">
            {error && (
              <div className="rounded-xl bg-[#ffe3ea] px-4 py-3 text-[0.9rem] font-semibold text-[#ef2c5b]">
                {error}
              </div>
            )}

            {loading && (
              <div className="rounded-xl border border-[#e4e7ee] bg-white px-4 py-8 text-center text-[#6d7588]">
                Loading reservations...
              </div>
            )}

            {!loading && !error && upcomingReservations.length === 0 && (
              <div className="rounded-xl border border-[#e4e7ee] bg-white px-4 py-8 text-center text-[#6d7588]">
                No reservations for today.
              </div>
            )}

            {!loading &&
              upcomingReservations.map((reservation) => {
                const isConfirmed = reservation.status === "CONFIRMED";
                return (
                  <article
                    key={reservation._id}
                    className="rounded-xl border border-[#e4e7ee] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.03)]"
                  >
                    <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
                      <div className="grid gap-2">
                        <p className="text-[1.02rem] font-bold text-[#1c2437]">
                          {reservation.name} <span className="font-medium text-[#6b7280]">({reservation.numberOfGuests} guests)</span>
                        </p>
                        <p className="text-[0.9rem] text-[#4f617d]">
                          <span className="font-semibold">Date:</span> {reservation.date} at {reservation.preferredTime}
                        </p>
                        <p className="text-[0.9rem] text-[#4f617d]">
                          <span className="font-semibold">Email:</span> {reservation.email}
                        </p>
                        <p className="text-[0.9rem] text-[#4f617d]">
                          <span className="font-semibold">Phone:</span> {reservation.phone}
                        </p>
                        <p className="text-[0.9rem] text-[#4f617d]">
                          <span className="font-semibold">Special Requests:</span> {reservation.specialRequests || "-"}
                        </p>
                        <p className="text-[0.82rem] text-[#8b93a4]">Created: {formatDate(reservation.createdAt)}</p>
                      </div>

                      <div className="flex min-w-[170px] flex-col items-start gap-2 md:items-end">
                        <span
                          className={`rounded-full px-3 py-1 text-[0.8rem] font-semibold ${
                            isConfirmed ? "bg-[#d6f0de] text-[#1f7f40]" : "bg-[#ffe0e8] text-[#c62854]"
                          }`}
                        >
                          {isConfirmed ? "Confirmed" : "Pending"}
                        </span>

                        <button
                          onClick={() => handleConfirm(reservation._id)}
                          disabled={isConfirmed}
                          className="rounded-lg bg-[#ef2c5b] px-3 py-2 text-[0.82rem] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          Confirm Reservation
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
          </div>
        </section>
      </main>
    </div>
  );
}
