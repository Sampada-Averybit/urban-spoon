import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const tabs = ["Starters", "Main Course", "Drinks", "Dessert"];
const tabSectionMap = {
  Starters: ["starters"],
  "Main Course": ["main-course"],
  Drinks: ["drinks"],
  Dessert: ["dessert"],
};


function BackArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 12H5M5 12L12 19M5 12L12 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16L21 21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5V5.3M12 18.7V21.5M2.5 12H5.3M18.7 12H21.5M5.2 5.2L7.2 7.2M16.8 16.8L18.8 18.8M18.8 5.2L16.8 7.2M7.2 16.8L5.2 18.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function BurgerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 10.2C5.5 7.6 8 5.8 12 5.8C16 5.8 18.5 7.6 19 10.2H5Z" />
      <path d="M4.5 12.2H19.5V14.1C19.5 15.7 18.2 17 16.6 17H7.4C5.8 17 4.5 15.7 4.5 14.1V12.2Z" />
      <path d="M7 12.2V13.5M10 12.2V13.5M13 12.2V13.5M16 12.2V13.5" fill="none" stroke="#f7f4f2" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M6.4 9.1H17.6" fill="none" stroke="#f7f4f2" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.2 3.6C13.3 4 12.4 4.8 11.8 5.7C9.6 8.8 10.2 13.2 13.2 15.5C15 16.9 17.3 17.3 19.4 16.8C18.1 19.4 15.4 21.2 12.2 21.2C7.8 21.2 4.2 17.6 4.2 13.2C4.2 8.2 8.8 4 14.2 3.6Z" />
    </svg>
  );
}

function FooterFoodIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 3V14M10 3V14M8 14V21M15 3V8M19 3V21M15 8H19"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MedalIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 3H11L12 6L13 3H16L13.5 8H10.5L8 3Z" />
      <circle cx="12" cy="14.5" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 11.8L12.8 13.4L14.6 13.7L13.3 15L13.6 16.8L12 16L10.4 16.8L10.7 15L9.4 13.7L11.2 13.4L12 11.8Z" />
    </svg>
  );
}

function DribbbleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 7.5C10.5 8.5 13.5 11.8 15.2 17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16.8 9.2C14 9.1 10.9 9.8 8.3 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4.8 13.2C7.8 12.4 12.5 12.3 18.4 13.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function AtIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M15.6 13.6C15.3 14.6 14.4 15.3 13.4 15.3C11.8 15.3 10.6 13.9 10.6 12C10.6 10.1 11.8 8.7 13.4 8.7C15 8.7 16.2 10.1 16.2 12V13.7C16.2 14.8 17.5 15 18 14.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionIcon({ type }) {
  if (type === "sun") return <SunIcon />;
  if (type === "burger") return <BurgerIcon />;
  return <MoonIcon />;
}

function badgeClass(theme) {
  if (theme === "green") {
    return "inline-flex min-h-[1.75rem] items-center rounded-[0.5rem] bg-[#dff4da] px-[0.65rem] text-[0.78rem] font-bold uppercase text-[#217842]";
  }

  if (theme === "blue") {
    return "inline-flex min-h-[1.75rem] items-center rounded-[0.5rem] bg-[#d9e6ff] px-[0.65rem] text-[0.78rem] font-bold uppercase text-[#244eb7]";
  }

  return "inline-flex min-h-[1.75rem] items-center rounded-[0.5rem] pl-0 text-[0.78rem] font-bold uppercase text-[#ff6d8e]";
}

export default function Menu() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState("Starters");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/menu")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const groupedData = data.reduce((acc, item) => {
            const rawCategory = String(item.category || "").trim().toLowerCase();
            let cat = "Starters";
            if (rawCategory === "starters" || rawCategory === "starter") cat = "Starters";
            else if (rawCategory === "main course" || rawCategory === "maincourse" || rawCategory === "main-course") cat = "Main Course";
            else if (rawCategory === "drinks" || rawCategory === "drink") cat = "Drinks";
            else if (rawCategory === "dessert" || rawCategory === "desserts") cat = "Dessert";

            if (!acc[cat]) acc[cat] = [];
            acc[cat].push({
              name: item.name,
              price: typeof item.price === "number" ? `$${item.price}` : item.price,
              description: item.description,
              image: item.imageUrl || "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=900&q=80",
              badge: "New",
              badgeTheme: "green"
            });
            return acc;
          }, {});

          const newSections = [
            { id: "starters", title: "Starters", icon: "sun", items: groupedData["Starters"] || [] },
            { id: "main-course", title: "Main Course", icon: "burger", items: groupedData["Main Course"] || [] },
            { id: "drinks", title: "Signature Drinks", icon: "sun", items: groupedData["Drinks"] || [] },
            { id: "dessert", title: "Dessert Favorites", icon: "moon", items: groupedData["Dessert"] || [] },
          ].filter((s) => s.items.length > 0);

          setSections(newSections);
        }
      })
      .catch((err) => console.error("Failed to fetch backend menu:", err));
  }, []);

  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const allowedSectionIds = new Set(tabSectionMap[activeTab] || []);

    return sections
      .filter((section) => allowedSectionIds.has(section.id))
      .map((section) => ({
        ...section,
        items: query
          ? section.items.filter((item) => {
              const text = `${item.name} ${item.description} ${item.badge}`.toLowerCase();
              return text.includes(query);
            })
          : section.items,
      }))
      .filter((section) => section.items.length > 0);
  }, [activeTab, searchQuery, sections]);

  function handleAddToCartLocal(item) {
    const priceValue = Number(item.price.replace("$", ""));
    addToCart({ ...item, price: priceValue });
  }

  return (
    <main className="min-h-screen bg-[#f7f4f2] text-[#0f1833]">
      <div className="mx-auto w-[min(1100px,calc(100%-2rem))] py-8 pb-12 max-[1024px]:pt-6 max-[640px]:w-[min(100%-1rem,1100px)] max-[640px]:py-6 max-[640px]:pb-8">
        <div className="mb-6 ml-auto flex justify-end" aria-label="Quick actions">
          <button
            className={`grid h-[2.875rem] w-[2.875rem] place-items-center rounded-[0.875rem] p-3 text-[#ff2457] ${showSearch ? "bg-[#ffd7e1]" : "bg-[#f8dfe6]"}`}
            type="button"
            aria-label="Search"
            aria-expanded={showSearch}
            onClick={() => setShowSearch((current) => !current)}
          >
            <span className="h-full w-full">
              <SearchIcon />
            </span>
          </button>
        </div>

        <section className="mb-8 flex flex-col items-start gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex h-10 items-center justify-center gap-2 rounded-full border border-[#f0e8e9] bg-white px-4 text-[0.95rem] font-bold text-[#1a243d] transition-colors hover:bg-[#f8f9fa]"
          >
            <span className="h-4 w-4"><BackArrowIcon /></span>
            Back
          </button>
          <div className="flex w-full items-end justify-between gap-6 max-[1024px]:flex-col max-[1024px]:items-start">
            <div>
              <h1 className="text-[clamp(3rem,5vw,4.2rem)] leading-[0.95] text-[#121a38] max-[640px]:text-[2.7rem]">Our Menu</h1>
              <p className="mt-2 max-w-[36rem] text-[1.05rem] text-[#6a7998]">Handcrafted flavors using locally sourced organic ingredients.</p>
            </div>
          </div>
        </section>

        {showSearch && (
          <div className="mb-6 grid gap-2 rounded-[1rem] border border-[#f0e8e9] bg-white p-4 shadow-[0_2px_8px_rgba(17,27,51,0.04)]">
            <label className="text-[0.8rem] font-bold uppercase tracking-[0.08em] text-[#6a7998]" htmlFor="menu-search">
              Search dishes
            </label>
            <input
              id="menu-search"
              className="box-border w-full rounded-[0.875rem] border border-[#ead4da] bg-[#fff9fa] px-4 py-[0.9rem] text-[0.98rem] text-[#1d2a4a] outline-[2px] outline-transparent focus:border-[#ff9ab3] focus:outline-[rgba(255,36,87,0.18)]"
              type="search"
              placeholder="Search by dish, ingredient, or tag"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        )}

        <div className="mb-8 flex flex-wrap gap-6 border-b border-[#f1d9df] pb-3 max-[640px]:gap-4" role="tablist" aria-label="Dining sessions">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              className={`relative bg-transparent pb-2 text-[0.92rem] font-bold uppercase tracking-[0.14em] ${activeTab === tab ? "text-[#ff2457] after:absolute after:bottom-[-0.9rem] after:left-0 after:right-0 after:h-1 after:rounded-full after:bg-[#ff2457] after:content-['']" : "text-[#98a7c1]"}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid gap-8">
          {filteredSections.map((section) => (
            <section className="grid gap-4" key={section.id}>
              <div className="flex items-center gap-3">
                <span className="h-7 w-7 text-[#ff2457]">
                  <SectionIcon type={section.icon} />
                </span>
                <h2 className="text-[1.45rem] font-bold text-[#121a38]">{section.title}</h2>
              </div>

              <div className="grid grid-cols-2 gap-4 max-[1024px]:grid-cols-1">
                {section.items.map((item) => (
                  <article className="flex gap-4 rounded-[0.875rem] border border-[#f0e8e9] bg-white p-4 shadow-[0_2px_8px_rgba(17,27,51,0.04)] max-[640px]:flex-col" key={item.name}>
                    <div className="h-28 w-28 shrink-0 overflow-hidden rounded-[0.75rem] bg-[#edf0f4] max-[640px]:h-[220px] max-[640px]:w-full">
                      <a href={item.image} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
                        <img className="block h-full w-full object-cover transition-transform duration-300 hover:scale-110" src={item.image} alt={item.name} onError={(e) => { e.target.onerror = null; e.target.src="https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=900&q=80" }} />
                      </a>
                    </div>
                    <div className="grid min-w-0 flex-1 gap-3">
                      <div className="flex items-start justify-between gap-3 max-[640px]:flex-col max-[640px]:items-start">
                        <h3 className="text-[1.05rem] font-bold text-[#131a35]">{item.name}</h3>
                        <span className="whitespace-nowrap text-[1.05rem] font-bold text-[#ff2457]">{item.price}</span>
                      </div>
                      <p className="leading-[1.55] text-[#6a7998]">{item.description}</p>
                      <div className="flex items-center justify-between gap-3 max-[640px]:flex-col max-[640px]:items-start">
                        <span className={badgeClass(item.badgeTheme)}>
                          {item.badge}
                        </span>
                        <button
                          className="min-h-10 whitespace-nowrap rounded-full bg-[#ffe3ea] px-[0.95rem] font-bold text-[#ff2457] hover:bg-[#ffd3df] max-[640px]:w-full"
                          type="button"
                          onClick={() => handleAddToCartLocal(item)}
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}

          {filteredSections.length === 0 && (
            <div className="rounded-[1rem] border border-[#f0e8e9] bg-white p-6">
              <h2 className="text-[1.45rem] font-bold text-[#121a38]">No dishes found</h2>
              <p className="mt-2 leading-[1.55] text-[#6a7998]">Try a different search term or clear the search to see the full menu.</p>
            </div>
          )}
        </div>

        <div className="my-20 mb-4 h-px bg-[#f1d9df]" />

        <footer className="grid justify-items-center gap-3 text-center text-[#95a2bb]" id="contact">
          <div className="inline-flex items-center gap-2 text-[1.15rem] uppercase tracking-[0.14em] text-[#f38da4]">
            <span className="h-[1.375rem] w-[1.375rem]"><FooterFoodIcon /></span>
            <span>Urban Spoon</span>
          </div>
          <p>© 2024 Urban Spoon Dining Group. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="h-6 w-6 text-[#95a2bb]" href="#" aria-label="Awards">
              <MedalIcon />
            </a>
            <a className="h-6 w-6 text-[#95a2bb]" href="#" aria-label="Dribbble">
              <DribbbleIcon />
            </a>
            <a className="h-6 w-6 text-[#95a2bb]" href="mailto:hello@urbanspoon.com" aria-label="Email">
              <AtIcon />
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
