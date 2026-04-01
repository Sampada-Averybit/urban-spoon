import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full">
      <path
        d="M8 9V7.5C8 5.6 9.6 4 11.5 4C13.4 4 15 5.6 15 7.5V9M6.5 9H16.5L15.5 19.5H7.5L6.5 9Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FloatingCart() {
  const { cartSize } = useCart();
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const cartRelevantRoutes = ["/menu", "/", "/dashboard"];
  const showOnThisRoute = cartRelevantRoutes.includes(location.pathname);

  if (
    isLoading ||
    !isLoggedIn ||
    cartSize < 1 ||
    location.pathname === "/cart" ||
    !showOnThisRoute
  ) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 w-[min(360px,calc(100%-1rem))]">
      <div className="pointer-events-auto flex items-center justify-between gap-2 rounded-[1rem] bg-[#f8d9e2] px-3 py-2.5 shadow-[0_16px_34px_rgba(239,44,91,0.26)]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3b9c9] text-[#ef2c5b]">
            <span className="h-4 w-4">
              <BagIcon />
            </span>
          </div>
          <div>
            <p className="text-[0.72rem] font-bold uppercase tracking-wide text-[#ef2c5b]">
              Your Cart
            </p>
            <p className="text-[1.05rem] font-bold leading-none text-[#11182f]">
              {cartSize} {cartSize === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/cart")}
          className="inline-flex min-h-[2.5rem] items-center justify-center rounded-full bg-[#ef2c5b] px-5 text-[0.95rem] font-bold text-white transition-colors hover:bg-[#da2551]"
        >
          View Cart
          <span className="ml-1.5 text-[1.1rem] leading-none">›</span>
        </button>
      </div>
    </div>
  );
}
