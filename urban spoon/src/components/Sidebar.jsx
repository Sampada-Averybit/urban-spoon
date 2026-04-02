import React from "react";
import { NavLink } from "react-router-dom";

const baseLinkClass =
  "inline-flex w-full items-center gap-3 rounded-full px-4 py-3 text-[0.92rem] font-semibold no-underline transition-all duration-200";

const defaultItems = [
  { key: "dashboard", to: "/admin", label: "Dashboard" },
  { key: "menu", to: "/admin/menu", label: "Menu Management" },
  { key: "orders", to: "/admin/orders", label: "Order Management" },
  { key: "reservations", to: "/admin/reservations", label: "Reservations" },
  { key: "coupons", to: "/admin/coupons", label: "Coupons Management" },
];

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full">
      <rect x="4" y="4" width="7" height="7" rx="1.4" fill="currentColor" />
      <rect x="13" y="4" width="7" height="7" rx="1.4" fill="currentColor" />
      <rect x="4" y="13" width="7" height="7" rx="1.4" fill="currentColor" />
      <rect x="13" y="13" width="7" height="7" rx="1.4" fill="currentColor" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full">
      <path d="M5 7H19M5 12H19M5 17H19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const iconMap = {
  dashboard: DashboardIcon,
  menu: ListIcon,
  orders: ListIcon,
  reservations: ListIcon,
  coupons: ListIcon,
};

function getLinkClass(isActive) {
  if (isActive) {
    return `${baseLinkClass} bg-[#ffe8ef] text-[#ef2c5b] shadow-[inset_0_-2px_0_#ef2c5b]`;
  }
  return `${baseLinkClass} text-[#172033] hover:bg-[rgba(239,44,91,0.08)] hover:text-[#ef2c5b]`;
}

export default function Sidebar({ title = "Admin Central", subtitle = "Management Suite", items = defaultItems }) {
  return (
    <aside className="border-r border-[rgba(234,46,96,0.08)] bg-[rgba(255,252,250,0.92)] px-6 py-6 backdrop-blur-md">
      <div className="mb-6">
        <h2 className="text-[1.35rem] font-semibold text-[#172033]">{title}</h2>
        <p className="mt-1 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-[#8b909e]">{subtitle}</p>
      </div>

      <nav className="grid gap-1.5">
        {items.map((item) => {
          const Icon = iconMap[item.key] || ListIcon;
          const targetPath = item.key === "dashboard" ? "/admin" : item.to;
          return (
            <NavLink key={item.key} to={targetPath} end={item.key === "dashboard"} className={({ isActive }) => getLinkClass(isActive)}>
              <span className="h-5 w-5">
                <Icon />
              </span>
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
