import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import AdminTopbar from "../components/AdminTopbar";
import { apiUrl } from "../services/apiClient";

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full">
      <path d="M5 7H19M5 12H19M5 17H19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ReservationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full">
      <rect x="6" y="3.8" width="12" height="16.4" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 8.3H15M9 12H15M9 15.7H13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CouponIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full">
      <path d="M5 8.5A2.5 2.5 0 0 1 7.5 6H19V10A2 2 0 0 0 19 14V18H7.5A2.5 2.5 0 0 1 5 15.5V8.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10 8.8V15.2M12.8 10.2L14.8 12L12.8 13.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    activeOrders: 0,
    tableBookings: 0,
    activeCoupons: 0,
  });

  const storedUserRaw = localStorage.getItem("urbanSpoonUser");
  let firstName = "Manager";
  if (storedUserRaw) {
    try {
      const parsed = JSON.parse(storedUserRaw);
      firstName = parsed?.name ? String(parsed.name).split(" ")[0] : firstName;
    } catch {
      firstName = "Manager";
    }
  }

  useEffect(() => {
    const fetchMetrics = async () => {
      const token = localStorage.getItem("urbanSpoonToken");
      if (!token) return;

      try {
        const [ordersRes, reservationsRes, couponsRes] = await Promise.all([
          fetch(apiUrl("/api/orders/admin"), {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(apiUrl("/api/reservations/admin"), {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(apiUrl("/api/coupons"), {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [ordersRaw, reservationsRaw, couponsRaw] = await Promise.all([
          ordersRes.text(),
          reservationsRes.text(),
          couponsRes.text(),
        ]);

        let orders = [];
        let reservations = [];
        let coupons = [];

        if (ordersRes.ok) {
          try {
            const ordersData = ordersRaw ? JSON.parse(ordersRaw) : {};
            orders = Array.isArray(ordersData?.orders) ? ordersData.orders : [];
          } catch (e) {
            console.error("Failed to parse orders data:", e);
          }
        } else {
          console.error("Orders API failed:", ordersRes.status, ordersRaw);
        }

        if (reservationsRes.ok) {
          try {
            const reservationsData = reservationsRaw ? JSON.parse(reservationsRaw) : {};
            reservations = Array.isArray(reservationsData?.reservations) ? reservationsData.reservations : [];
          } catch (e) {
            console.error("Failed to parse reservations data:", e);
          }
        } else {
          console.error("Reservations API failed:", reservationsRes.status, reservationsRaw);
        }

        if (couponsRes.ok) {
          try {
            const couponsData = couponsRaw ? JSON.parse(couponsRaw) : {};
            coupons = Array.isArray(couponsData?.coupons) ? couponsData.coupons : [];
          } catch (e) {
            console.error("Failed to parse coupons data:", e);
          }
        } else {
          console.error("Coupons API failed:", couponsRes.status, couponsRaw);
        }

        const activeOrders = orders.filter(
          (order) => !["DELIVERED", "CANCELLED"].includes(String(order?.orderStatus || ""))
        ).length;

        const totalRevenue = orders.reduce((acc, order) => acc + (Number(order?.finalAmount) || 0), 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tableBookings = reservations.filter((reservation) => {
          const d = new Date(reservation?.date);
          if (Number.isNaN(d.getTime())) return false;
          d.setHours(0, 0, 0, 0);
          return d >= today;
        }).length;

        const now = new Date();
        const activeCoupons = coupons.filter((coupon) => {
          const expiry = new Date(coupon?.expiryDate);
          return Boolean(coupon?.isActive) && !Number.isNaN(expiry.getTime()) && expiry > now;
        }).length;

        setMetrics({
          totalRevenue,
          activeOrders,
          tableBookings,
          activeCoupons,
        });
      } catch (error) {
        console.error("Dashboard metrics fetch error:", error);
      }
    };

    fetchMetrics();
    const timer = setInterval(fetchMetrics, 10000);
    return () => clearInterval(timer);
  }, []);

  const statCards = useMemo(
    () => [
      {
        key: "revenue",
        label: "Total Revenue",
        value: `INR ${metrics.totalRevenue.toFixed(2)}`,
        sideText: "Live",
        bg: "bg-white",
        tint: "bg-[#ffeaf0] text-[#ef2c5b]",
        icon: <CouponIcon />,
      },
      {
        key: "orders",
        label: "Active Orders",
        value: String(metrics.activeOrders),
        sideText: "Live",
        bg: "bg-[#cfe7e2]",
        tint: "bg-white text-[#155c4d]",
        icon: <ListIcon />,
      },
      {
        key: "bookings",
        label: "Table Bookings",
        value: String(metrics.tableBookings),
        sideText: "Live",
        bg: "bg-white",
        tint: "bg-[#d8f1ea] text-[#108a75]",
        icon: <ReservationIcon />,
      },
      {
        key: "coupons",
        label: "Active Coupons",
        value: String(metrics.activeCoupons),
        sideText: "Live",
        bg: "bg-[#ffe8f1]",
        tint: "bg-white text-[#ef2c5b]",
        icon: <CouponIcon />,
      },
    ],
    [metrics]
  );

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#f4f4f6] text-[#11182f]">
      <AdminTopbar />

      <main className="mx-auto grid h-[calc(100dvh-5.5rem)] max-w-[1440px] grid-cols-[280px_1fr] max-[1100px]:grid-cols-1">
        <Sidebar />

        <section className="overflow-hidden px-8 py-6 max-[700px]:px-4">
          <h2 className="text-[2.35rem] font-bold leading-[1.05] text-[#11182f] max-[920px]:text-[1.95rem] max-[700px]:text-[1.6rem]">
            Your table{" "}
            <span className="font-['Playfair_Display',serif] text-[#ef2c5b] italic font-normal">awaits</span>
          </h2>
          <p className="mt-2 text-[0.98rem] text-[#3f516b] max-[920px]:text-[0.9rem]">
            Welcome back, {firstName}. Here is what&apos;s happening at Urban Spoon today.
          </p>

          <div className="mt-6 grid grid-cols-4 gap-4 max-[1300px]:grid-cols-2 max-[700px]:grid-cols-1">
            {statCards.map((card) => (
              <article
                key={card.key}
                className={`rounded-[1.2rem] border border-[#e6e8ed] p-4 shadow-[0_2px_4px_rgba(17,24,39,0.03)] ${card.bg}`}
              >
                <div className="flex items-center justify-between">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ${card.tint}`}>
                    <span className="h-5 w-5">
                      {card.icon}
                    </span>
                  </div>
                  <span className="text-[0.78rem] font-semibold text-[#52596a]">{card.sideText}</span>
                </div>
                <p className="mt-3 text-[0.82rem] font-medium text-[#596073]">{card.label}</p>
                <p className="mt-1 text-[1.35rem] font-bold text-[#0e1428]">{card.value}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
