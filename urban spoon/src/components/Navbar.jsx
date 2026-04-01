import React, { useMemo, useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const baseNavLinkClass =
  "inline-flex min-h-10 items-center justify-center rounded-full px-4 text-[0.92rem] font-semibold no-underline transition-all duration-200";

const NAV_CONFIG = {
  guest: [
    { key: "home", to: "/", label: "Home", priority: 1 },
    { key: "menu", to: "/menu-card", label: "Menu", priority: 2, activeOn: ["/menu"] },
    { key: "login", to: "/login", label: "Login", priority: 3 },
    { key: "register", to: "/register", label: "Register", priority: 4, highlight: true },
  ],
  user: [
    { key: "dashboard", to: "/dashboard", label: "Dashboard", priority: 1 },
    { key: "menu", to: "/menu", label: "Order Now", priority: 2, activeOn: ["/menu-card"] },
    { key: "reservations", to: "/reservations", label: "Reserve", priority: 3 },
    { key: "myReservations", to: "/my-reservations", label: "My Reservations", priority: 4 },
  ],
  admin: [
    { key: "admin", to: "/admin", label: "Admin", priority: 5 },
  ],
}

function isItemActive(item, pathname) {
  if (pathname === item.to) return true;
  if (Array.isArray(item.activeOn) && item.activeOn.some((route) => pathname.startsWith(route))) return true;
  return false;
}

function getContextualItems({ isLoggedIn, pathname, userRole }) {
  let items = isLoggedIn ? [...NAV_CONFIG.user] : [...NAV_CONFIG.guest];

  if (userRole === "admin") {
    items = [...items, ...NAV_CONFIG.admin];
  }

  // Reduce clutter on auth pages for guests.
  if (!isLoggedIn && pathname === "/login") {
    items = items.filter((item) => item.key !== "login");
  }
  if (!isLoggedIn && pathname === "/register") {
    items = items.filter((item) => item.key !== "register");
  }

  // Hide "My Reservations" until the user reaches reservation-oriented routes.
  if (isLoggedIn && !["/my-reservations", "/reservations"].includes(pathname)) {
    items = items.filter((item) => item.key !== "myReservations");
  }

  return items.sort((a, b) => a.priority - b.priority);
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const { isLoggedIn, user, isLoading, logout } = useAuth();

  const userRole = user?.role || "user";
  const userName = user?.name ? user.name.split(" ")[0] : "Profile";

  const navItems = useMemo(
    () => getContextualItems({ isLoggedIn, pathname: location.pathname, userRole }),
    [isLoggedIn, location.pathname, userRole]
  );

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    logout();
    window.location.replace("/");
  };

  const getLinkClass = (item, isActive) => {
    const active = isActive || isItemActive(item, location.pathname);
    if (active) {
      return `${baseNavLinkClass} bg-[#ffe8ef] text-[#ef2c5b] shadow-[inset_0_-2px_0_#ef2c5b]`;
    }
    if (item.highlight) {
      return `${baseNavLinkClass} border border-[rgba(239,44,91,0.2)] bg-[rgba(255,255,255,0.8)] text-[#172033] hover:border-[rgba(239,44,91,0.35)] hover:text-[#ef2c5b]`;
    }
    return `${baseNavLinkClass} text-[#172033] hover:bg-[rgba(239,44,91,0.08)] hover:text-[#ef2c5b]`;
  };

  if (isLoading) {
    return (
      <nav className="sticky top-0 z-30 border-b border-[rgba(234,46,96,0.08)] bg-[rgba(255,252,250,0.92)] backdrop-blur-md">
        <div className="mx-auto h-[4.5rem] w-full max-w-[1240px] px-4 max-[1024px]:px-5 max-[480px]:px-3" />
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-30 border-b border-[rgba(234,46,96,0.08)] bg-[rgba(255,252,250,0.92)] backdrop-blur-md">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-3 max-[1024px]:px-5 max-[480px]:px-3" ref={menuRef}>
        <div className="flex items-center justify-between gap-3">
          <NavLink className="font-['Playfair_Display',serif] inline-flex items-center text-[1.2rem] font-bold text-[#ea2e60] no-underline" to={isLoggedIn ? "/dashboard" : "/"}>
            Urban Spoon
          </NavLink>

          <div className="ml-auto hidden items-center justify-end gap-1.5 md:flex">
            {navItems.map((item) => (
              <NavLink key={item.key} to={item.to} className={({ isActive }) => getLinkClass(item, isActive)}>
                {item.label}
              </NavLink>
            ))}
            {isLoggedIn && (
              <>
                <NavLink to="/profile" className={({ isActive }) => getLinkClass({ key: "profile", to: "/profile", label: "Profile" }, isActive)}>
                  Profile
                </NavLink>
                <button onClick={handleLogout} className="inline-flex h-10 items-center justify-center rounded-full border border-[rgba(239,44,91,0.18)] px-4 text-[0.88rem] font-semibold text-[#ef2c5b] transition-colors hover:bg-[#fff0f4]">
                  Logout
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-[rgba(23,32,51,0.1)] px-3 text-[#334155] transition-colors hover:border-[rgba(239,44,91,0.2)] hover:bg-[#fff0f4] hover:text-[#ef2c5b] md:hidden"
            aria-label="Toggle mobile navigation"
          >
            <span className="text-[0.76rem] font-semibold">{isMobileMenuOpen ? "Close" : "Menu"}</span>
          </button>
        </div>

        <div
          className={`grid transition-[grid-template-rows,opacity,margin] duration-200 ease-out md:hidden ${
            isMobileMenuOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="rounded-2xl border border-[rgba(23,32,51,0.08)] bg-white p-3 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
              <div className="grid gap-1.5">
                {navItems.map((item) => (
                  <NavLink key={item.key} to={item.to} className={({ isActive }) => getLinkClass(item, isActive)}>
                    {item.label}
                  </NavLink>
                ))}
              </div>

              {isLoggedIn && (
                <div className="mt-3 border-t border-[rgba(23,32,51,0.08)] pt-3">
                  <p className="px-1 text-[0.78rem] font-medium text-[#64748b]">Signed in as {userName}</p>
                  <div className="mt-2 grid gap-1.5">
                    <NavLink to="/profile" className={getLinkClass({ key: "profile", to: "/profile", label: "Profile" }, false)}>
                      Profile
                    </NavLink>
                    <button onClick={handleLogout} className="inline-flex min-h-10 items-center justify-center rounded-full border border-[rgba(239,44,91,0.18)] px-4 text-[0.92rem] font-semibold text-[#ef2c5b] transition-colors hover:bg-[#fff0f4]">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
