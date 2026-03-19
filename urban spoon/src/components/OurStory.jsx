import React from "react";

export default function OurStory() {
  return (
    <section className="bg-[#f8f6f6] py-16 max-[640px]:py-12" id="about">
      <div className="mx-auto grid w-[min(1120px,calc(100%-2rem))] grid-cols-[minmax(0,1fr)] items-center gap-8 max-[640px]:w-[min(100%-1rem,1120px)] min-[960px]:grid-cols-2">
        <div className="overflow-hidden rounded-[2rem] shadow-[0_28px_60px_rgba(15,23,42,0.14)]">
          <img
            src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1300&q=80"
            alt="Chef plating a dish"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="grid gap-4">
          <span className="text-[0.95rem] font-bold uppercase tracking-[0.14em] text-[#ea2e60]">OUR STORY</span>
          <h2 className="max-w-[34rem] text-[clamp(2rem,4vw,3.4rem)] leading-[1.05] text-[#172033]">
            Where tradition meets modern urban living
          </h2>
          <p className="max-w-[40rem] leading-[1.7] text-[#61708c]">
            Founded in 2015, Urban Spoon began with a simple mission: to bring the warmth of a
            countryside kitchen to the heart of the city. We believe in slow food, fast service,
            and the magic of community.
          </p>
          <p className="max-w-[40rem] leading-[1.7] text-[#61708c]">
            Every ingredient we use is sourced from local organic farms within a 50-mile radius,
            ensuring that every bite you take supports both your health and our local ecosystem.
          </p>
          <button className="inline-flex min-h-[3.25rem] w-fit items-center rounded-full bg-[rgba(234,46,96,0.1)] px-6 font-bold text-[#ea2e60]" type="button">
            Learn More About Us
          </button>
          <div className="flex flex-wrap gap-6 pt-2">
            <div className="grid gap-1">
              <span className="text-[1.9rem] font-extrabold text-[#172033]">100%</span>
              <span className="text-[0.8rem] font-bold uppercase tracking-[0.12em] text-[#61708c]">Organic</span>
            </div>
            <div className="grid gap-1">
              <span className="text-[1.9rem] font-extrabold text-[#172033]">12k+</span>
              <span className="text-[0.8rem] font-bold uppercase tracking-[0.12em] text-[#61708c]">Happy Guests</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
