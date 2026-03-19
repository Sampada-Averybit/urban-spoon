import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0b1220] px-0 pb-4 pt-6 text-[rgba(255,255,255,0.84)]">
      <div className="mx-auto grid w-[min(1120px,calc(100%-2rem))] grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 border-b border-[rgba(255,255,255,0.08)] pb-6 max-[640px]:w-[min(100%-1rem,1120px)]">
        <div className="grid content-start gap-3">
          <div className="inline-flex items-center gap-2 text-[1.05rem] font-bold text-white">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[rgba(234,46,96,0.2)] text-[#ea2e60]" aria-hidden="true">
              🍽️
            </span>
            <span>Urban Spoon</span>
          </div>
          <p className="text-[0.95rem] leading-[1.65] text-[rgba(255,255,255,0.72)]">
            Bringing the art of fine dining and cozy café culture to your neighborhood since 2015.
          </p>
          <div className="flex gap-3">
            <a href="#" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full bg-[rgba(255,255,255,0.08)] text-[#ea2e60] transition-[transform,background] duration-200 ease-in hover:-translate-y-0.5 hover:bg-[rgba(234,46,96,0.22)]">
              <svg className="h-[1.1rem] w-[1.1rem] fill-current" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Z" />
                <path d="M12 7.25a4.75 4.75 0 1 1 0 9.5 4.75 4.75 0 0 1 0-9.5Zm0 1.5a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5Z" />
                <path d="M17.75 6.75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Z" />
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full bg-[rgba(255,255,255,0.08)] text-[#ea2e60] transition-[transform,background] duration-200 ease-in hover:-translate-y-0.5 hover:bg-[rgba(234,46,96,0.22)]">
              <svg className="h-[1.1rem] w-[1.1rem] fill-current" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M13.5 2.25h2.5a.75.75 0 0 1 .75.75v2.25h-2.25c-1.382 0-2.25.868-2.25 2.25v1.875h3.375l-.438 3.375H12.5V21H9.5v-8.25H7.25V9.375H9.5V7.125c0-2.198 1.282-3.375 3.166-3.375Z" />
              </svg>
            </a>
            <a href="#" aria-label="Twitter" className="grid h-10 w-10 place-items-center rounded-full bg-[rgba(255,255,255,0.08)] text-[#ea2e60] transition-[transform,background] duration-200 ease-in hover:-translate-y-0.5 hover:bg-[rgba(234,46,96,0.22)]">
              <svg className="h-[1.1rem] w-[1.1rem] fill-current" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8.208 20.25c7.626 0 11.804-6.32 11.804-11.8 0-.18 0-.358-.012-.535A8.49 8.49 0 0 0 22 5.334a8.31 8.31 0 0 1-2.357.646 4.116 4.116 0 0 0 1.81-2.27 8.232 8.232 0 0 1-2.608.996A4.107 4.107 0 0 0 15.448 4c-2.27 0-4.108 1.84-4.108 4.108 0 .323.036.637.106.94A11.647 11.647 0 0 1 3.672 4.768a4.103 4.103 0 0 0-.556 2.066c0 1.426.726 2.683 1.83 3.421a4.096 4.096 0 0 1-1.86-.514v.052c0 1.99 1.417 3.645 3.297 4.018a4.123 4.123 0 0 1-1.853.07c.523 1.63 2.041 2.812 3.842 2.845a8.233 8.233 0 0 1-5.096 1.755c-.33 0-.657-.02-.98-.057A11.62 11.62 0 0 0 8.208 20.25Z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="grid content-start gap-3">
          <h3 className="text-base font-bold text-white">Quick Links</h3>
          <ul className="grid list-none gap-2">
            <li><a className="text-[rgba(255,255,255,0.72)] no-underline" href="#menu">Menu Highlights</a></li>
            <li><a className="text-[rgba(255,255,255,0.72)] no-underline" href="#reservation">Reservation Policy</a></li>
            <li><a className="text-[rgba(255,255,255,0.72)] no-underline" href="#events">Private Events</a></li>
            <li><a className="text-[rgba(255,255,255,0.72)] no-underline" href="#gift">Gift Cards</a></li>
          </ul>
        </div>

        <div className="grid content-start gap-3">
          <h3 className="text-base font-bold text-white">Contact Us</h3>
          <address className="grid gap-2 text-[0.95rem] not-italic leading-[1.65] text-[rgba(255,255,255,0.72)]">
            <div>
              <strong>123 Culinary Ave, Midtown,</strong>
              <br /> New York, NY 10001
            </div>
            <a className="text-[rgba(255,255,255,0.72)] no-underline" href="tel:+15551234567">+1 (555) 123-4567</a>
            <a className="text-[rgba(255,255,255,0.72)] no-underline" href="mailto:hello@urbanspoon.com">hello@urbanspoon.com</a>
          </address>
        </div>

        <div className="grid content-start gap-3">
          <h3 className="text-base font-bold text-white">Opening Hours</h3>
          <div className="grid gap-2 text-[0.95rem] leading-[1.65] text-[rgba(255,255,255,0.72)]">
            <div className="flex justify-between gap-4">
              <span>Mon - Thu</span>
              <span>8am – 10pm</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Fri – Sat</span>
              <span>8am – 11pm</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Sunday</span>
              <span>9am – 9pm</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-4 w-[min(1120px,calc(100%-2rem))] text-center max-[640px]:w-[min(100%-1rem,1120px)]">
        <p className="text-[0.85rem] text-[rgba(255,255,255,0.72)]">© {year} Urban Spoon. All rights reserved. Designed for excellence.</p>
      </div>
    </footer>
  );
}
