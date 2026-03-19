import React, { useMemo, useState } from "react";

const tabs = ["Breakfast", "Lunch", "Dinner", "Drinks", "Dessert"];
const tabSectionMap = {
  Breakfast: ["morning"],
  Lunch: ["midday"],
  Dinner: ["evening"],
  Drinks: ["drinks"],
  Dessert: ["dessert"],
};

const sections = [
  {
    id: "morning",
    title: "Morning Favorites",
    icon: "sun",
    items: [
      {
        name: "Avocado Smash",
        price: "$16",
        description:
          "Sourdough, chili flakes, heirloom tomatoes, and organic radish.",
        badge: "Served Until 11 AM",
        badgeTheme: "pink",
        image:
          "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Buttermilk Stack",
        price: "$14",
        description:
          "Triple stack with Grade A maple syrup and seasonal berries.",
        badge: "Bestseller",
        badgeTheme: "pink",
        image:
          "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Mediterranean Omelette",
        price: "$15",
        description:
          "Free-range eggs, feta, spinach, olives, and roasted peppers.",
        badge: "Protein Rich",
        badgeTheme: "blue",
        image:
          "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Cinnamon Brioche Toast",
        price: "$13",
        description:
          "Thick-cut brioche, mascarpone cream, caramelized banana, and pecans.",
        badge: "Sweet Pick",
        badgeTheme: "pink",
        image:
          "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Berry Yogurt Parfait",
        price: "$11",
        description:
          "Greek yogurt, house granola, chia seeds, and macerated berries.",
        badge: "Light Start",
        badgeTheme: "green",
        image:
          "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Breakfast Burrito",
        price: "$16",
        description:
          "Scrambled eggs, turkey sausage, hash browns, cheddar, and salsa verde.",
        badge: "Hearty",
        badgeTheme: "blue",
        image:
          "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    id: "midday",
    title: "Midday Bites",
    icon: "burger",
    items: [
      {
        name: "Zen Garden Bowl",
        price: "$18",
        description:
          "Quinoa, roasted chickpeas, kale, tahini dressing, and lemon.",
        badge: "Vegan",
        badgeTheme: "green",
        image:
          "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "The Urban Burger",
        price: "$22",
        description:
          "Grass-fed wagyu, aged cheddar, secret sauce, on a brioche bun.",
        badge: "Chef's Choice",
        badgeTheme: "pink",
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Smoked Chicken Panini",
        price: "$19",
        description:
          "Ciabatta, smoked chicken, mozzarella, pesto, and tomato jam.",
        badge: "House Favorite",
        badgeTheme: "pink",
        image:
          "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Harvest Pasta Salad",
        price: "$17",
        description:
          "Gemelli, roasted squash, arugula, goat cheese, and basil vinaigrette.",
        badge: "Fresh",
        badgeTheme: "green",
        image:
          "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Paneer Tikka Wrap",
        price: "$19",
        description:
          "Charred paneer, mint chutney, pickled onions, and crunchy salad in naan.",
        badge: "Indian Favorite",
        badgeTheme: "pink",
        image:
          "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Roasted Tomato Flatbread",
        price: "$18",
        description:
          "Wood-fired flatbread, burrata, blistered tomatoes, and basil oil.",
        badge: "Vegetarian",
        badgeTheme: "green",
        image:
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    id: "evening",
    title: "Evening Specialties",
    icon: "moon",
    items: [
      {
        name: "Wild Atlantic Salmon",
        price: "$32",
        description:
          "Pan-seared, asparagus, purple potato mash, citrus glaze.",
        badge: "Gluten Free",
        badgeTheme: "blue",
        image:
          "https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Truffle Tagliatelle",
        price: "$28",
        description:
          "Fresh handmade pasta, wild mushrooms, white truffle oil, parm.",
        badge: "Premium",
        badgeTheme: "pink",
        image:
          "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Charred Ribeye",
        price: "$36",
        description:
          "12oz ribeye, rosemary butter, crispy shallots, and herb potatoes.",
        badge: "Signature",
        badgeTheme: "pink",
        image:
          "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Lemon Herb Risotto",
        price: "$26",
        description:
          "Creamy arborio rice, grilled zucchini, parmesan, and citrus zest.",
        badge: "Vegetarian",
        badgeTheme: "green",
        image:
          "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Braised Lamb Shank",
        price: "$34",
        description:
          "Slow-braised lamb, saffron couscous, roasted carrots, and jus.",
        badge: "Slow Cooked",
        badgeTheme: "pink",
        image:
          "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Miso Glazed Cod",
        price: "$31",
        description:
          "Black cod, sesame greens, jasmine rice, and ginger soy glaze.",
        badge: "Seafood",
        badgeTheme: "blue",
        image:
          "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    id: "drinks",
    title: "Signature Drinks",
    icon: "sun",
    items: [
      {
        name: "Mango Lassi",
        price: "$9",
        description:
          "Creamy yogurt blend with ripe mango puree, cardamom, and saffron.",
        badge: "Indian Classic",
        badgeTheme: "pink",
        image:
          "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Cold Brew Tonic",
        price: "$8",
        description:
          "Single-origin cold brew, tonic water, orange peel, and rosemary.",
        badge: "Refreshing",
        badgeTheme: "blue",
        image:
          "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Rose Lemon Spritz",
        price: "$10",
        description:
          "Sparkling citrus cooler with rose syrup, basil, and crushed ice.",
        badge: "Floral",
        badgeTheme: "pink",
        image:
          "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Masala Chai",
        price: "$7",
        description:
          "Slow-brewed black tea with milk, ginger, cinnamon, and clove.",
        badge: "Warm Favorite",
        badgeTheme: "blue",
        image:
          "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Cucumber Mint Cooler",
        price: "$8",
        description:
          "Fresh cucumber, mint, lime juice, and soda for a crisp finish.",
        badge: "Fresh",
        badgeTheme: "green",
        image:
          "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Lychee Mint Fizz",
        price: "$9",
        description:
          "Lychee nectar, mint leaves, lime, and sparkling soda over ice.",
        badge: "Tropical",
        badgeTheme: "green",
        image:
          "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    id: "dessert",
    title: "Dessert Favorites",
    icon: "moon",
    items: [
      {
        name: "Gulab Jamun Cheesecake",
        price: "$12",
        description:
          "Silky baked cheesecake topped with gulab jamun and rose syrup.",
        badge: "Indian Fusion",
        badgeTheme: "pink",
        image:
          "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Chocolate Lava Cake",
        price: "$11",
        description:
          "Warm chocolate cake with molten center and vanilla bean ice cream.",
        badge: "Bestseller",
        badgeTheme: "pink",
        image:
          "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Pistachio Kulfi",
        price: "$10",
        description:
          "Traditional frozen milk dessert with pistachio, cardamom, and saffron.",
        badge: "Chilled",
        badgeTheme: "blue",
        image:
          "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Berry Panna Cotta",
        price: "$10",
        description:
          "Vanilla panna cotta finished with macerated berries and mint.",
        badge: "Light",
        badgeTheme: "green",
        image:
          "https://images.unsplash.com/photo-1488477304112-4944851de03d?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Tiramisu Jar",
        price: "$9",
        description:
          "Espresso-soaked sponge, mascarpone cream, and cocoa in a glass jar.",
        badge: "Coffee Lover",
        badgeTheme: "blue",
        image:
          "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Caramel Apple Tart",
        price: "$11",
        description:
          "Buttery tart shell with cinnamon apples and salted caramel glaze.",
        badge: "Seasonal",
        badgeTheme: "pink",
        image:
          "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
];

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
  const [activeTab, setActiveTab] = useState("Breakfast");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

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
  }, [activeTab, searchQuery]);

  const cartTotal = cartItems.reduce((total, item) => total + item.priceValue * item.quantity, 0);

  function handleAddToCart(item) {
    const priceValue = Number(item.price.replace("$", ""));

    setCartItems((current) => {
      const existingItem = current.find((entry) => entry.name === item.name);

      if (existingItem) {
        return current.map((entry) =>
          entry.name === item.name
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry,
        );
      }

      return [...current, { ...item, priceValue, quantity: 1 }];
    });

    setCartOpen(true);
  }

  function handleCartQuantity(name, change) {
    setCartItems((current) =>
      current
        .map((item) =>
          item.name === name
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
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

        <section className="mb-8 flex items-end justify-between gap-6 max-[1024px]:flex-col max-[1024px]:items-start">
          <div>
            <h1 className="text-[clamp(3rem,5vw,4.2rem)] leading-[0.95] text-[#121a38] max-[640px]:text-[2.7rem]">Our Menu</h1>
            <p className="mt-2 max-w-[36rem] text-[1.05rem] text-[#6a7998]">Handcrafted flavors using locally sourced organic ingredients.</p>
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
                      <img className="block h-full w-full object-cover" src={item.image} alt={item.name} />
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
                          onClick={() => handleAddToCart(item)}
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

        {cartOpen && (
          <aside className="sticky bottom-4 ml-auto mt-6 w-[min(360px,100%)] rounded-[1rem] border border-[#f0e8e9] bg-white p-6 shadow-[0_18px_40px_rgba(17,27,51,0.08)] max-[640px]:w-full" aria-label="Shopping cart">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-[1.2rem] text-[#121a38]">Your Cart</h2>
              <button className="bg-transparent font-bold text-[#ff2457]" type="button" onClick={() => setCartOpen(false)}>
                Close
              </button>
            </div>

            {cartItems.length === 0 ? (
              <p className="leading-[1.55] text-[#6a7998]">Your cart is empty. Add a dish to get started.</p>
            ) : (
              <>
                <div className="grid gap-3">
                  {cartItems.map((item, index) => (
                    <div className={`flex items-center justify-between gap-3 ${index === 0 ? "pt-0" : "border-t border-[#f4eaed] pt-3"}`} key={item.name}>
                      <div>
                        <strong className="block">{item.name}</strong>
                        <span className="mt-1 block text-[#6a7998]">{item.price}</span>
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <button className="h-7 w-7 rounded-full bg-[#ffe3ea] font-bold text-[#ff2457]" type="button" onClick={() => handleCartQuantity(item.name, -1)}>
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button className="h-7 w-7 rounded-full bg-[#ffe3ea] font-bold text-[#ff2457]" type="button" onClick={() => handleCartQuantity(item.name, 1)}>
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#f4eaed] pt-4 text-[#121a38]">
                  <span>Total</span>
                  <strong>${cartTotal.toFixed(2)}</strong>
                </div>
              </>
            )}
          </aside>
        )}

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
