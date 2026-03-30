import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const baseLinkClass =
  "inline-flex min-h-10 items-center justify-center rounded-full px-[0.95rem] text-[0.95rem] font-semibold text-[#172033] no-underline transition-[background,color,transform,box-shadow] duration-[220ms] ease-in hover:-translate-y-px hover:bg-[rgba(234,46,96,0.08)] hover:text-[#ea2e60] max-[768px]:min-h-[2.35rem] max-[768px]:px-[0.85rem] max-[480px]:w-full max-[480px]:px-[0.8rem] max-[480px]:py-[0.6rem]";

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path d="M5.5 5H4M5.5 5L7 16H18.5L20 8H6.5 M7 16V18.5C7 19.3 7.7 20 8.5 20C9.3 20 10 19.3 10 18.5 M15.5 16V18.5C15.5 19.3 16.2 20 17 20C17.8 20 18.5 19.3 18.5 18.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
       <circle cx="12" cy="8" r="3.3" />
       <path d="M5.5 19C6.7 15.9 9 14.5 12 14.5C15 14.5 17.3 15.9 18.5 19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("urbanSpoonToken");

  const handleLogout = () => {
    localStorage.removeItem("urbanSpoonToken");
    localStorage.removeItem("urbanSpoonUser");
    navigate("/");
  };

  const navItems = [
    { to: "/", label: "Home", className: baseLinkClass },
    { to: "/menu", label: "Menu", className: baseLinkClass },
    {
      to: "/login",
      label: "Login",
      className: `${baseLinkClass} text-black`,
    },
    {
      to: "/register",
      label: "Register",
      className: `${baseLinkClass} border border-[rgba(234,46,96,0.18)] bg-[rgba(255,255,255,0.8)]`,
    },
  ];

  const visibleNavItems = navItems.filter((item) => item.to !== location.pathname);

  // Authenticated Nav
  if (isLoggedIn) {
    return (
      <nav className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[rgba(234,46,96,0.08)] bg-[rgba(255,252,250,0.88)] px-6 py-4 backdrop-blur-md max-[1024px]:px-5 max-[480px]:px-3">
        <NavLink className="font-['Playfair_Display',serif] inline-flex items-center gap-2 text-[1.2rem] font-bold text-[#ea2e60] no-underline max-[480px]:text-[1.08rem]" to="/dashboard">
          <span className="inline-flex h-[1.125rem] w-[1.125rem] text-inherit" aria-hidden="true">
            <svg className="block h-full w-full" viewBox="0 0 24 24">
              <path
                d="M6 3V14M10 3V14M8 14V21M15 3V8M19 3V21M15 8H19"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          Urban Spoon
        </NavLink>
        
        <div className="flex items-center gap-5">
          <button className="relative flex items-center justify-center gap-2 text-[#4a5568] transition-colors hover:text-[#ef2c5b]">
            <CartIcon />
            <span className="max-[640px]:hidden font-semibold text-[0.95rem]">Cart</span>
            <span className="absolute -right-2 -top-1.5 flex h-[1.125rem] w-[1.125rem] items-center justify-center rounded-full border-[1.5px] border-white bg-[#ef2c5b] text-[0.65rem] font-bold text-white">
              2
            </span>
          </button>
          
          <NavLink to="/profile" className="flex items-center gap-2 text-[#4a5568] transition-colors hover:text-[#ef2c5b] no-underline">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#f4e6d4] text-[#aa8b66]">
              <UserIcon />
            </div>
            <span className="text-[0.95rem] font-semibold max-[640px]:hidden">Julian</span>
          </NavLink>

          <button onClick={handleLogout} className="ml-2 rounded-full border border-[rgba(234,46,96,0.2)] px-4 py-1.5 text-[0.9rem] font-semibold text-[#ea2e60] transition-colors hover:bg-[rgba(234,46,96,0.08)]">
            Logout
          </button>
        </div>
      </nav>
    );
  }

  // Unauthenticated Nav
  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[rgba(234,46,96,0.08)] bg-[rgba(255,252,250,0.88)] px-4 py-[0.875rem] backdrop-blur-[16px] max-[1024px]:px-5 max-[480px]:flex-col max-[480px]:items-start max-[480px]:px-3">
      <NavLink className="font-['Playfair_Display',serif] inline-flex items-center gap-2 text-[1.2rem] font-bold text-[#ea2e60] no-underline max-[480px]:text-[1.08rem]" to="/">
        <span className="inline-flex h-[1.125rem] w-[1.125rem] text-inherit" aria-hidden="true">
          <svg className="block h-full w-full" viewBox="0 0 24 24">
            <path
              d="M6 3V14M10 3V14M8 14V21M15 3V8M19 3V21M15 8H19"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        Urban Spoon
      </NavLink>
      <ul className="m-0 flex list-none items-center gap-2 p-0 max-[768px]:w-full max-[768px]:justify-end max-[480px]:w-full max-[480px]:flex-wrap">
        {visibleNavItems.map((item) => (
          <li className="max-[480px]:flex-[1_1_calc(50%-0.5rem)]" key={item.to}>
            <NavLink className={item.className} to={item.to}>
              {item.label}
            </NavLink>
          </li>
        ))}
        <li className="max-[480px]:flex-[1_1_calc(50%-0.5rem)]">
          <a className={baseLinkClass} href="/#about">
            About
          </a>
        </li>
      </ul>
    </nav>
  );
}
