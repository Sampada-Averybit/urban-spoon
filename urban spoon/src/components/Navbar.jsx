import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const baseLinkClass =
  "inline-flex min-h-10 items-center justify-center rounded-full px-[0.95rem] text-[0.95rem] font-semibold text-[#172033] no-underline transition-[background,color,transform,box-shadow] duration-[220ms] ease-in hover:-translate-y-px hover:bg-[rgba(234,46,96,0.08)] hover:text-[#ea2e60] max-[768px]:min-h-[2.35rem] max-[768px]:px-[0.85rem] max-[480px]:w-full max-[480px]:px-[0.8rem] max-[480px]:py-[0.6rem]";

export default function Navbar() {
  const location = useLocation();
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
