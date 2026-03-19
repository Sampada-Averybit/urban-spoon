import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="bg-[#f8f6f6] py-6 max-[640px]:py-5" id="home">
      <div className="mx-auto w-[min(1120px,calc(100%-2rem))] max-[640px]:w-[min(100%-1rem,1120px)]">
        <div className="relative grid min-h-[clamp(26rem,70vw,42rem)] place-items-center overflow-hidden rounded-[2rem] border border-[rgba(255,255,255,0.4)] bg-[rgba(255,255,255,0.88)] p-[clamp(1.5rem,4vw,3rem)] text-center shadow-[0_28px_60px_rgba(15,23,42,0.14)]">
          <div className="absolute inset-0">
            <img
              alt="Elegant restaurant interior with soft lighting"
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1970&q=80"
            />
            <div className="absolute inset-0 bg-[rgba(7,10,18,0.34)]"></div>
          </div>
          <div className="relative z-[1] grid max-w-[42rem] justify-items-center gap-6">
            <h2 className="text-[clamp(2.5rem,5vw,4.8rem)] leading-none text-white">
              Your table awaits
            </h2>
            <p className="max-w-[34rem] text-[clamp(1rem,2vw,1.2rem)] text-[rgba(255,255,255,0.9)]">
              Good food is just a click away. Experience the art of modern dining.
            </p>
            <Link
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#ea2e60] px-8 font-bold text-white no-underline shadow-[0_16px_30px_rgba(234,46,96,0.28)] transition-[transform,box-shadow] duration-200 ease-in hover:-translate-y-0.5 hover:shadow-[0_22px_34px_rgba(234,46,96,0.32)]"
              to="/menu"
            >
              Explore Full Menu
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
