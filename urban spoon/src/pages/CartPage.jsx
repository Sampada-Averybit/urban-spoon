import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

// Simple Trash Icon
function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h5v2h-2v15a1 1 0 01-1 1H5a1 1 0 01-1-1V6H2V4h5zm2-1v1h6V3H9zm10 3H5v14h14V6h-2z" />
      <path d="M9 9h2v8H9V9zm4 0h2v8h-2V9z" />
    </svg>
  );
}

// Secure Payment Icon
function SecureIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

// Express Prep Icon
function FlashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems: items, updateQuantity, removeFromCart } = useCart();
  
  const availableCoupons = [
    { code: "URBAN20", desc: "20% off on your current order", type: "percent", value: 0.2, discountStr: "20% OFF" },
    { code: "FREEDEL", desc: "Free delivery / Zero platform fee", type: "flat", value: 2.00, discountStr: "FREE" }
  ];
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const gst = subtotal * 0.18;
  const platformFee = 2.00;
  
  let discountAmount = 0;
  if (appliedCoupon) {
    const activeCoupon = availableCoupons.find(c => c.code === appliedCoupon);
    if (activeCoupon) {
      discountAmount = activeCoupon.type === "percent" ? subtotal * activeCoupon.value : activeCoupon.value;
    }
  }
  
  const total = Math.max(0, subtotal + gst + platformFee - discountAmount);

  return (
    <div className="min-h-screen bg-[#fcfbfa] font-sans pb-20">
      {/* Header Area representing the back bar */}
      <div className="mx-auto flex max-w-[1240px] items-center px-6 pt-8 max-[760px]:px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-lg font-semibold text-[#12182f] transition-colors hover:text-[#ef2c5b]"
          aria-label="Go back"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef2c5b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </button>
      </div>

      {/* Title Section */}
      <div className="mx-auto max-w-[1240px] px-6 pt-6 pb-6 max-[760px]:px-4">
        <h1 className="text-[3rem] font-bold text-[#12182f] flex items-baseline gap-3 max-[480px]:text-[2.2rem]">
          Your 
          <span className="font-['Playfair_Display',serif] italic text-[#ef2c5b] text-[3.5rem] font-normal leading-none max-[480px]:text-[2.8rem]">
            Cart
          </span>
        </h1>
        <p className="mt-2 text-[1.05rem] text-[#6b7280]">
          Review your selection for today's urban feast.
        </p>
      </div>

      <main className="mx-auto max-w-[1240px] px-6 max-[760px]:px-4">
        <div className="grid grid-cols-[1fr_400px] gap-8 max-[1024px]:grid-cols-1">
          
          {/* Left Column: Items */}
          <div className="flex flex-col gap-5">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-[1.5rem] p-5 flex items-center gap-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-[#f3f4f6] max-[640px]:flex-col max-[640px]:items-stretch max-[640px]:gap-4"
              >
                {/* Image */}
                <div className="relative h-28 w-28 shrink-0 rounded-[1.2rem] overflow-hidden max-[640px]:w-full max-[640px]:h-48">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  {item.badge && (
                    <span className="absolute left-2 top-2 rounded bg-white/90 px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#134d38] backdrop-blur-sm">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="text-[1.15rem] font-bold text-[#12182f] leading-tight">{item.name}</h3>
                  <p className="mt-1 text-[0.85rem] text-[#6b7280] italic font-serif">{item.desc}</p>
                  <p className="mt-3 text-[1.1rem] font-bold text-[#ea2e60]">${item.price.toFixed(2)}</p>
                </div>

                {/* Controls & Total */}
                <div className="flex flex-col items-end justify-between gap-4 max-[640px]:flex-row max-[640px]:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex h-9 items-center rounded-full bg-[#fff0f4] px-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-[#ea2e60] transition-colors hover:bg-white/60"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-[0.95rem] font-bold text-[#12182f]">
                        {item.quantity.toString().padStart(2, '0')}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-[#ea2e60] transition-colors hover:bg-white/60"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-[1.2rem] font-bold text-[#12182f]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#9ca3af] transition-colors hover:text-[#ea2e60]"
                      aria-label="Remove item"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {items.length === 0 && (
              <div className="bg-white rounded-[1.5rem] p-12 text-center shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-[#f3f4f6]">
                <p className="text-xl font-bold text-[#12182f]">Your cart is empty.</p>
                <button 
                  onClick={() => navigate('/menu')}
                  className="mt-6 rounded-full bg-[#ef2c5b] px-8 py-3 text-[0.95rem] font-bold text-white shadow-[0_8px_20px_rgba(239,44,91,0.25)] transition-transform hover:-translate-y-1"
                >
                  Explore Menu
                </button>
              </div>
            )}

            {/* Upsell Banner */}
            <div className="relative overflow-hidden rounded-[1.5rem] bg-[#dcf0e8] p-8 max-[640px]:p-6 mt-2">
              <div className="relative z-10 w-[70%] max-[640px]:w-full">
                <h3 className="text-[1.3rem] font-bold text-[#134d38]">Complete the experience?</h3>
                <p className="mt-2 text-[#256c54] text-[0.95rem]">
                  Our signature Cold Brew pairs perfectly with your selection.
                </p>
                <button className="mt-6 rounded-full bg-white px-6 py-2.5 text-[0.9rem] font-bold text-[#134d38] shadow-sm transition-transform hover:-translate-y-0.5">
                  Add for $5.00
                </button>
              </div>
              <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-white/30 blur-2xl"></div>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div>
            <div className="sticky top-28 bg-white rounded-[1.5rem] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.05)] border border-[#f3f4f6]">
              <h2 className="text-[1.4rem] font-bold text-[#12182f] mb-6">Order Summary</h2>
              
              <div className="grid gap-4 text-[0.95rem] text-[#4b5563] pb-6 border-b border-dashed border-[#e5e7eb]">
                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span className="font-medium text-[#12182f]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span className="font-medium text-[#12182f]">${gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span className="font-medium text-[#12182f]">${platformFee.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#10b981] font-bold">
                    <span>Discount ({appliedCoupon})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>
              
              <div className="py-6 border-b border-dashed border-[#e5e7eb]">
                <label className="block text-[0.75rem] font-bold uppercase tracking-widest text-[#12182f] mb-3">
                  Available Offers
                </label>
                <div className="grid gap-3">
                  {availableCoupons.map((coupon) => (
                    <div key={coupon.code} onClick={() => setAppliedCoupon(appliedCoupon === coupon.code ? null : coupon.code)} className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 transition-colors hover:border-[#ea2e60] ${appliedCoupon === coupon.code ? 'border-[#10b981] bg-[#10b981]/5' : 'border-[#e5e7eb] bg-[#f9fafb]'}`}>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="rounded bg-[#ea2e60]/10 px-2 py-0.5 text-[0.7rem] font-bold text-[#ea2e60]">{coupon.code}</span>
                          <span className="text-[0.65rem] font-bold text-[#10b981] uppercase">{coupon.discountStr}</span>
                        </div>
                        <p className="text-[0.8rem] text-[#6b7280] leading-tight">{coupon.desc}</p>
                      </div>
                      <button 
                        className={`rounded-lg px-4 py-2 text-[0.75rem] font-bold transition-colors ${appliedCoupon === coupon.code ? 'bg-[#10b981] text-white' : 'bg-[#1a1a1a] text-white hover:bg-black'}`}
                      >
                        {appliedCoupon === coupon.code ? 'Applied' : 'Apply'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center py-6">
                <span className="font-bold text-[#12182f] text-[1.1rem]">Total Amount</span>
                <span className="font-bold text-[#ef2c5b] text-[1.8rem]">${total.toFixed(2)}</span>
              </div>

              <button className="w-full flex items-center justify-center gap-2 rounded-full bg-[#ef2c5b] py-4 text-[1.05rem] font-bold text-white shadow-[0_8px_20px_rgba(239,44,91,0.25)] transition-transform hover:-translate-y-1">
                Place Order
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 ml-1">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
              
              <p className="mt-4 text-center text-[0.7rem] text-[#9ca3af] px-4">
                By placing your order, you agree to Urban Spoon's <a href="#" className="underline">Terms of Service</a>.
              </p>
            </div>

            <div className="mt-6 flex justify-center gap-6 text-[#9ca3af]">
              <div className="flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-wider">
                <SecureIcon /> Secure Payment
              </div>
              <div className="flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-wider">
                <FlashIcon /> Express Prep
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
