import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

function formatPrice(price) {
  if (typeof price === "number") return `$${price.toFixed(2)}`;
  const n = Number(price);
  if (!Number.isNaN(n)) return `$${n.toFixed(2)}`;
  return String(price || "$0");
}

export default function MenuCardPage() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/menu")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMenuItems(data);
      })
      .catch((err) => console.error("Failed to fetch menu:", err));
  }, []);

  const grouped = useMemo(() => {
    const map = {};

    menuItems.forEach((item) => {
      const rawCategory = String(item.category || "").trim();
      const category = rawCategory || "Uncategorized";
      if (!map[category]) map[category] = [];
      map[category].push({
        id: item._id || item.id || `${item.name}-${item.price}`,
        name: item.name,
        price: formatPrice(item.price),
      });
    });

    return map;
  }, [menuItems]);

  const orderedSections = useMemo(() => Object.keys(grouped), [grouped]);

  return (
    <div className="min-h-screen bg-[#f4f3f4] text-[#111827]">
      <main className="mx-auto max-w-[1240px] px-4 py-10">
        <section className="text-center">
          <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-[#ef2c5b]">URBAN SPOON SELECTION</p>
          <h1 className="mt-2 text-[2.6rem] font-bold leading-none text-[#0f1833] max-[760px]:text-[1.9rem]">
            The <span className="font-['Playfair_Display',serif] font-normal italic text-[#ef2c5b]">menu</span> Card
          </h1>
          <div className="mx-auto mt-3 h-[3px] w-20 rounded-full bg-[#f2a6b9]" />
        </section>

        <section className="mx-auto mt-9 max-w-[1040px] rounded-[1.2rem] border border-[#f1d6de] bg-[#f8f6f7] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] max-[760px]:p-5">
          <div className="grid gap-8">
            {orderedSections.map((section) => (
              <div key={section}>
                <div className="mb-3 flex items-center gap-2">
                  <h2 className="whitespace-nowrap text-[1.5rem] font-semibold text-[#1c2435]">{section}</h2>
                  <div className="h-px flex-1 bg-[#eddbe2]" />
                  <span className="rounded-full bg-[#d5ebe3] px-2.5 py-1 text-[0.6rem] font-bold tracking-[0.1em] text-[#2d8779]">
                    CATEGORY
                  </span>
                </div>

                <div className="grid gap-1.5">
                  {(grouped[section] || []).map((item) => (
                    <div key={item.id} className="flex items-end gap-2.5 py-1">
                      <p className="text-[1.1rem] text-[#202938]">{item.name}</p>
                      <div className="mb-2 h-px flex-1 border-b border-dotted border-[#e7ccd5]" />
                      <p className="text-[1.1rem] font-semibold text-[#ef2c5b]">{item.price}</p>
                    </div>
                  ))}
                  {(grouped[section] || []).length === 0 && (
                    <p className="text-[1rem] text-[#8b93a3]">No items available</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 border-t border-[#efe1e6] pt-6 text-center">
            <p className="font-['Playfair_Display',serif] text-[1.35rem] italic text-[#ef7e9f]">Savor every moment.</p>
            <p className="mt-1.5 text-[0.7rem] tracking-[0.1em] text-[#9ca3af]">MENU PRICES ARE SUBJECT TO SEASONAL CHANGE</p>
          </div>
        </section>

        <section className="py-9 text-center">
          <h3 className="text-[1.85rem] font-bold text-[#111827]">
            Experience it <span className="font-['Playfair_Display',serif] text-[#ef2c5b] italic font-normal">tonight</span>
          </h3>
          <p className="mx-auto mt-2 max-w-[620px] text-[0.95rem] text-[#6b7280]">
            Book a table or order now to experience our dishes.
          </p>
        </section>
      </main>

      <footer className="border-t border-[rgba(0,0,0,0.06)] px-6 py-8 text-[#8b93a3]">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between text-[0.74rem] max-[760px]:flex-col max-[760px]:gap-3">
          <p className="font-['Playfair_Display',serif] text-[1rem] text-[#ef7e9f]">Urban Spoon</p>
          <p>(c) 2024 Urban Spoon. An Urban Epicurean Experience.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="text-[#8b93a3] no-underline hover:text-[#ef2c5b]">Privacy Policy</a>
            <a href="#instagram" className="text-[#8b93a3] no-underline hover:text-[#ef2c5b]">Instagram</a>
            <a href="#press" className="text-[#8b93a3] no-underline hover:text-[#ef2c5b]">Press Kit</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
