import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function formatDate(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toDayStartTimestamp(dateInput) {
  if (!dateInput) return null;
  const value = String(dateInput).trim();

  // Handle YYYY-MM-DD or YYYY/MM/DD safely in local time.
  const ymd = /^(\d{4})[-/](\d{2})[-/](\d{2})$/.exec(value);
  if (ymd) {
    const year = Number(ymd[1]);
    const monthIndex = Number(ymd[2]) - 1;
    const day = Number(ymd[3]);
    return new Date(year, monthIndex, day).getTime();
  }

  // Handle DD/MM/YYYY or MM/DD/YYYY.
  const slashDate = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);
  if (slashDate) {
    const first = Number(slashDate[1]);
    const second = Number(slashDate[2]);
    const year = Number(slashDate[3]);

    // If first > 12, it must be DD/MM/YYYY, otherwise assume MM/DD/YYYY.
    const day = first > 12 ? first : second;
    const monthIndex = (first > 12 ? second : first) - 1;
    return new Date(year, monthIndex, day).getTime();
  }

  // Fallback for ISO or other parseable formats.
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()).getTime();
}

function ReservationRow({ item, isPast }) {
  return (
    <div className="grid grid-cols-[1.1fr_0.9fr_2fr_0.7fr_0.9fr] items-center gap-4 border-t border-[#ece7ea] px-6 py-4 text-[0.95rem] max-[760px]:grid-cols-1 max-[760px]:gap-1 max-[760px]:px-4">
      <div className="text-[#1f2937]">{formatDate(item.date)}</div>
      <div className="text-[#1f2937]">{item.preferredTime}</div>
      <div>
        <p className="font-semibold text-[#111827]">Table Reservation</p>
        <p className="text-[0.85rem] text-[#9ca3af]">{item.specialRequests || "Urban Spoon Experience"}</p>
      </div>
      <div className="font-semibold text-[#1f2937]">{item.numberOfGuests}</div>
      <div className="text-right max-[760px]:text-left">
        {isPast ? (
          <span className="rounded-full bg-[#ececef] px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.04em] text-[#6b7280]">
            Completed
          </span>
        ) : (
          <span className="text-[0.9rem] font-semibold text-[#ef2c5b]">Active</span>
        )}
      </div>
    </div>
  );
}

function SectionTable({ title, rows, isPast }) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[2rem] font-bold text-[#111827]">{title}</h2>
        {!isPast && (
          <span className="rounded-full bg-[#d5ebe3] px-3 py-1 text-[0.82rem] font-semibold text-[#2d6f62]">
            {rows.length} Active
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-[0.85rem] border border-[#efd6de] bg-white">
        <div className="grid grid-cols-[1.1fr_0.9fr_2fr_0.7fr_0.9fr] gap-4 bg-[#faf9fa] px-6 py-4 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#9ca3af] max-[760px]:hidden">
          <span>Date</span>
          <span>Time</span>
          <span>Experience / Table</span>
          <span>Guests</span>
          <span className="text-right">{isPast ? "Status" : "Actions"}</span>
        </div>

        {rows.length > 0 ? (
          rows.map((row) => <ReservationRow key={row._id || `${row.date}-${row.preferredTime}-${row.numberOfGuests}`} item={row} isPast={isPast} />)
        ) : (
          <p className="px-6 py-6 text-[0.95rem] text-[#6b7280]">No reservations found.</p>
        )}
      </div>
    </section>
  );
}

export default function MyReservationsPage() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("urbanSpoonToken");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:3000/api/reservations", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const raw = await res.text();
        let data = {};
        try {
          data = raw ? JSON.parse(raw) : {};
        } catch {
          throw new Error("Invalid server response format.");
        }
        if (!res.ok) throw new Error(data.message || "Failed to fetch reservations.");
        return data;
      })
      .then((data) => {
        setReservations(Array.isArray(data.reservations) ? data.reservations : []);
      })
      .catch((err) => {
        setError(err.message || "Unable to load reservations.");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const upcomingList = [];
    const pastList = [];

    reservations.forEach((r) => {
      const reservationDay = toDayStartTimestamp(r.date);
      if (reservationDay === null) {
        pastList.push(r);
        return;
      }
      if (reservationDay >= todayStart) upcomingList.push(r);
      else pastList.push(r);
    });

    return { upcoming: upcomingList, past: pastList };
  }, [reservations]);

  return (
    <div className="min-h-screen bg-[#f4f3f4] text-[#111827]">
      <main className="mx-auto max-w-[1080px] px-4 py-10">
        <div className="mb-8 flex items-start gap-4">
          <button onClick={() => navigate("/reservations")} className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#ef2c5b] shadow-sm">
            ←
          </button>
          <div>
            <h1 className="text-[3.2rem] font-bold leading-none text-[#0f1833] max-[760px]:text-[2rem]">My Reservations</h1>
            <p className="mt-2 text-[1rem] text-[#6b7280]">Manage your upcoming and past dining experiences.</p>
          </div>
        </div>

        {loading ? (
          <p className="text-[1rem] text-[#6b7280]">Loading reservations...</p>
        ) : error ? (
          <div className="rounded-[0.55rem] bg-[#ffe3ea] px-4 py-3 text-[0.9rem] font-semibold text-[#ef2c5b]">{error}</div>
        ) : (
          <div className="grid gap-10">
            <SectionTable title="Upcoming Reservations" rows={upcoming} isPast={false} />
            <SectionTable title="Past Reservations" rows={past} isPast />
          </div>
        )}
      </main>

      <footer className="mt-12 border-t border-[rgba(0,0,0,0.06)] px-6 py-8 text-[#8b93a3]">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between text-[0.8rem] max-[760px]:flex-col max-[760px]:gap-3">
          <p className="font-['Playfair_Display',serif] text-[1.2rem] text-[#ef7e9f]">Urban Spoon</p>
          <p>(c) 2024 Urban Spoon. High-End Gastronomy.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="text-[#8b93a3] no-underline hover:text-[#ef2c5b]">Privacy Policy</a>
            <a href="#terms" className="text-[#8b93a3] no-underline hover:text-[#ef2c5b]">Terms of Service</a>
            <a href="#contact" className="text-[#8b93a3] no-underline hover:text-[#ef2c5b]">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
