import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full">
      <path
        d="M15 17H9M18 17H6C7 15.7 8 14.2 8 10.8C8 8.3 9.8 6.3 12 6.3C14.2 6.3 16 8.3 16 10.8C16 14.2 17 15.7 18 17Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10.6 19.2C10.9 19.8 11.4 20.2 12 20.2C12.6 20.2 13.1 19.8 13.4 19.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function AdminBellNotifications() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const lastSeenRef = useRef(new Date(localStorage.getItem("urbanSpoonAdminLastSeenNotif") || 0));
  const clearBeforeRef = useRef(new Date(localStorage.getItem("urbanSpoonAdminNotifClearedBefore") || 0));

  const unreadCount = useMemo(
    () => notifications.filter((n) => new Date(n.time) > lastSeenRef.current).length,
    [notifications]
  );

  const fetchNotifications = async () => {
    const token = localStorage.getItem("urbanSpoonToken");
    if (!token) return;

    setLoading(true);
    try {
      const [ordersRes, reservationsRes] = await Promise.all([
        fetch("http://localhost:3000/api/orders/admin", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:3000/api/reservations/admin", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [ordersRaw, reservationsRaw] = await Promise.all([ordersRes.text(), reservationsRes.text()]);
      const ordersData = ordersRaw ? JSON.parse(ordersRaw) : {};
      const reservationsData = reservationsRaw ? JSON.parse(reservationsRaw) : {};

      if (!ordersRes.ok || !reservationsRes.ok) return;

      const orderNotifications = (ordersData.orders || [])
        .filter((o) => o.orderStatus === "PLACED")
        .map((o) => ({
          id: `order-${o._id}`,
          kind: "order",
          text: `New order placed by ${o.userSnapshot?.name || "customer"}`,
          time: o.createdAt || o.orderDate,
          targetPath: "/admin/orders",
          targetId: o._id,
        }));

      const reservationNotifications = (reservationsData.reservations || [])
        .filter((r) => r.status !== "CONFIRMED")
        .map((r) => ({
          id: `reservation-${r._id}`,
          kind: "reservation",
          text: `New table reservation by ${r.name || "customer"}`,
          time: r.createdAt,
          targetPath: "/admin/reservations",
          targetId: r._id,
        }));

      const merged = [...orderNotifications, ...reservationNotifications]
        .filter((n) => n.time)
        .filter((n) => new Date(n.time) > clearBeforeRef.current)
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 12);

      setNotifications(merged);
    } catch {
      // Keep bell non-blocking even if notifications fail to load.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const timer = setInterval(fetchNotifications, 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      const now = new Date();
      lastSeenRef.current = now;
      localStorage.setItem("urbanSpoonAdminLastSeenNotif", now.toISOString());
    }
  };

  const clearNotifications = () => {
    const now = new Date();
    clearBeforeRef.current = now;
    localStorage.setItem("urbanSpoonAdminNotifClearedBefore", now.toISOString());
    setNotifications([]);
  };

  const handleNotificationClick = (notification) => {
    const now = new Date();
    lastSeenRef.current = now;
    localStorage.setItem("urbanSpoonAdminLastSeenNotif", now.toISOString());
    setOpen(false);

    navigate(notification.targetPath, {
      state: {
        notificationType: notification.kind,
        notificationId: notification.targetId,
      },
    });
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button onClick={toggle} className="relative grid h-10 w-10 place-items-center rounded-full text-[#6b7280] transition-colors hover:bg-[#f4f4f6]">
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#ef2c5b] px-1 text-[0.65rem] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[22rem] overflow-hidden rounded-xl border border-[#e6e7ec] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
          <div className="flex items-center justify-between border-b border-[#eef0f4] px-4 py-3">
            <p className="text-[0.9rem] font-semibold text-[#1f2937]">Notifications</p>
            <button
              onClick={clearNotifications}
              className="text-[0.75rem] font-semibold text-[#ef2c5b] hover:underline"
            >
              Clear all
            </button>
          </div>
          <div className="max-h-[22rem] overflow-y-auto">
            {loading && (
              <p className="px-4 py-4 text-[0.86rem] text-[#64748b]">Loading...</p>
            )}
            {!loading && notifications.length === 0 && (
              <p className="px-4 py-4 text-[0.86rem] text-[#64748b]">No new notifications</p>
            )}
            {!loading &&
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className="w-full border-b border-[#f3f4f6] px-4 py-3 text-left transition-colors hover:bg-[#fff7fa] last:border-b-0"
                >
                  <p className="text-[0.84rem] font-medium text-[#334155]">{n.text}</p>
                  <p className="mt-1 text-[0.75rem] text-[#94a3b8]">{formatDate(n.time)}</p>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
