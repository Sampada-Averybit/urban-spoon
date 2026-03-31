import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

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

function HamburgerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartSize } = useCart();
  const { isLoggedIn, user, isLoading, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Close menu on route change
    setIsMenuOpen(false);
  }, [location.pathname]);

  let userName = "Profile";
  if (user && user.name) {
    userName = user.name.split(' ')[0]; // Show first name
  }

  const handleLogout = () => {
    navigate("/");
    setTimeout(() => {
      logout();
    }, 10);
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

  // Still loading auth state
  if (isLoading) {
    return (
      <nav className="sticky top-0 z-30 border-b border-[rgba(234,46,96,0.08)] bg-[rgba(255,252,250,0.88)] backdrop-blur-md opacity-30 pointer-events-none transition-opacity duration-300">
        <div className="mx-auto flex h-[4.5rem] w-[1240px] px-6 max-[1024px]:px-5 max-[480px]:px-3"></div>
      </nav>
    );
  }

  // Authenticated Nav
  if (isLoggedIn) {
    return (
      <nav className="sticky top-0 z-30 border-b border-[rgba(234,46,96,0.08)] bg-[rgba(255,252,250,0.88)] backdrop-blur-md">
       <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-4 px-6 py-4 max-[1024px]:px-5 max-[480px]:px-3">
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
        
        <div className="flex items-center gap-4">
          {location.pathname !== "/cart" && (
            <NavLink to="/cart" className="relative flex items-center justify-center text-[#4a5568] transition-colors hover:text-[#ef2c5b]">
              <CartIcon />
              {cartSize > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-[1.125rem] w-[1.125rem] items-center justify-center rounded-full border-[1.5px] border-white bg-[#ef2c5b] text-[0.65rem] font-bold text-white">
                  {cartSize}
                </span>
              )}
            </NavLink>
          )}
          
          <div className="relative ml-2" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#172033] transition-colors hover:bg-[rgba(234,46,96,0.08)] hover:text-[#ea2e60]"
              aria-label="Toggle menu"
            >
              <HamburgerIcon />
            </button>

            {/* Dropdown Menu */}
            <div 
              className={`absolute right-0 top-full mt-3 w-[15rem] transform overflow-hidden rounded-[1.25rem] border border-[rgba(0,0,0,0.06)] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isMenuOpen 
                  ? "translate-y-0 opacity-100 visible" 
                  : "-translate-y-2 opacity-0 invisible"
              }`}
            >
              <div className="border-b border-[rgba(0,0,0,0.06)] px-5 py-4">
                <p className="text-[0.85rem] font-medium text-[#7a879e]">Signed in as</p>
                <p className="truncate text-[1.05rem] font-bold text-[#12182f]">{userName}</p>
              </div>
              
              <div className="p-2">
                <NavLink 
                  to="/profile"
                  className="flex w-full items-center rounded-[0.75rem] px-3 py-2.5 text-[0.95rem] font-semibold text-[#4a5568] transition-colors hover:bg-[#fff0f4] hover:text-[#ea2e60] no-underline"
                >
                  Profile
                </NavLink>
                <button 
                  className="flex w-full items-center rounded-[0.75rem] px-3 py-2.5 text-left text-[0.95rem] font-semibold text-[#4a5568] transition-colors hover:bg-[#f3f4f6]"
                >
                  Settings
                </button>
              </div>

              <div className="border-t border-[rgba(0,0,0,0.06)] p-2">
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center rounded-[0.75rem] px-3 py-2.5 text-left text-[0.95rem] font-semibold text-[#ea2e60] transition-colors hover:bg-[#fff0f4]"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
       </div>
      </nav>
    );
  }

  // Unauthenticated Nav
  if (location.pathname !== "/") {
    return null;
  }

  return (
    <nav className="sticky top-0 z-30 border-b border-[rgba(234,46,96,0.08)] bg-[rgba(255,252,250,0.88)] backdrop-blur-[16px]">
     <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-4 px-4 py-[0.875rem] max-[1024px]:px-5 max-[480px]:flex-col max-[480px]:items-start max-[480px]:px-3">
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
     </div>
    </nav>
  );
}
