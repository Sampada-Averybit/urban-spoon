import React, { useState } from "react";
import { Link } from "react-router-dom";

// =======================
// SVG ICONS
// =======================
function BrandIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full">
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

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full">
      <path d="M5.5 5H4M5.5 5L7 16H18.5L20 8H6.5 M7 16V18.5C7 19.3 7.7 20 8.5 20C9.3 20 10 19.3 10 18.5 M15.5 16V18.5C15.5 19.3 16.2 20 17 20C17.8 20 18.5 19.3 18.5 18.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full">
      <path d="M12 3.5L14.5 8.8L20.2 9.4L16 13.3L17.2 19L12 16L6.8 19L8 13.3L3.8 9.4L9.5 8.8L12 3.5Z" fill="#FBBF24" />
    </svg>
  );
}

function AddToCartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full">
      <path d="M4 12H20M12 4V20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[70%] w-[70%]">
       <circle cx="12" cy="8" r="3.3" />
       <path d="M5.5 19C6.7 15.9 9 14.5 12 14.5C15 14.5 17.3 15.9 18.5 19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// =======================
// MOCK DATA
// =======================
const menuItems = [
  {
    id: 1,
    name: "Artisan Salmon Bowl",
    price: "$24.00",
    rating: 4.9,
    description: "Fresh Atlantic salmon, organic quinoa, and garden-picked...",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    category: "Lunch"
  },
  {
    id: 2,
    name: "Heritage Avocado Smash",
    price: "$16.50",
    rating: 4.7,
    description: "Sourdough, poached eggs, heirloom tomatoes, and feta crumble.",
    img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80",
    category: "Breakfast"
  },
  {
    id: 3,
    name: "Velvet Berry Stack",
    price: "$18.00",
    rating: 5.0,
    description: "Buttermilk pancakes, maple-infused berries, and honeycomb butter.",
    img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80",
    category: "Breakfast"
  },
  {
    id: 4,
    name: "Spiced Urban Shakshuka",
    price: "$19.50",
    rating: 4.8,
    description: "Middle Eastern spiced tomato sauce, cage-free eggs, and labneh.",
    img: "https://images.unsplash.com/photo-1590593162201-f67611a18b87?auto=format&fit=crop&w=600&q=80",
    category: "Breakfast"
  }
];

const recentOrders = [
  {
    id: "ORD-25841",
    date: "Oct 24, 2024",
    name: "The Urban Burger & Truffle Fries",
    status: "Delivered",
    price: "$32.50",
    iconBg: "bg-[#d8ece4]",
    iconColor: "text-[#3ebb8c]"
  },
  {
    id: "ORD-29775",
    date: "Oct 22, 2024",
    name: "Garden Pasta Trio",
    status: "Preparing",
    price: "$28.00",
    iconBg: "bg-[#ffe4eb]",
    iconColor: "text-[#ef2c5b]"
  }
];

// =======================
// COMPONENT
// =======================
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("Breakfast");

  return (
    <div className="min-h-screen bg-[#faf9f8] text-[#12182f] font-sans">


      <main className="mx-auto max-w-[1240px] px-6 py-8 max-[760px]:px-4 max-[760px]:py-6 grid gap-12">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-[1.5rem] bg-[#1a1a1a] shadow-xl pt-[6rem] pb-[5rem] px-12 max-[760px]:px-6 max-[760px]:pt-[5rem] max-[760px]:pb-[4rem]">
          {/* Background Image Overlay */}
          <div 
            className="absolute inset-0 opacity-50 bg-center bg-cover bg-no-repeat pointer-events-none"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1600&q=80")' }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-[500px]">
            <h1 className="text-[3rem] font-bold leading-[1.1] text-white max-[760px]:text-[2.25rem]">
              Good morning, <br />
              <span className="text-[#cbfce1]">Julian!</span>
            </h1>
            <p className="mt-4 text-[1.05rem] leading-[1.6] text-[#cbd5e1] max-w-[400px]">
              The city is waking up, and your table <em className="font-['Playfair_Display',serif] text-[#ef2c5b] not-italic">awaits.</em> Ready for a culinary adventure?
            </p>
            
            <div className="mt-8 flex items-center gap-4 max-[480px]:flex-col max-[480px]:items-stretch">
              <button className="flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full bg-[#ef2c5b] px-8 text-[0.95rem] font-bold text-white shadow-[0_8px_20px_rgba(239,44,91,0.3)] transition-transform hover:-translate-y-1">
                Order Now 
                <span className="text-[1.2rem] leading-none">›</span>
              </button>
              <button className="flex min-h-[3.25rem] items-center justify-center rounded-full border-2 border-[rgba(255,255,255,0.2)] bg-black/20 px-8 text-[0.95rem] font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/10">
                Book a Table
              </button>
            </div>
          </div>

          {/* Floating Chef's Special Card */}
          <div className="absolute right-12 top-10 rotate-[4deg] rounded-xl bg-[#e6f4ed] px-6 py-4 shadow-2xl backdrop-blur-md max-[900px]:hidden">
             <span className="block text-[0.8rem] font-bold uppercase tracking-wider text-[#4a5568]">Chef's Special</span>
             <span className="block font-['Playfair_Display',serif] text-[1.4rem] font-bold text-[#ef2c5b]">Truffle Risotto</span>
          </div>
        </section>

        {/* EXCLUSIVE OFFERS */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[1.5rem] font-bold text-[#12182f]">
              Exclusive <span className="text-[#ef2c5b]">Offers</span>
            </h2>
            <a href="#offers" className="text-[0.9rem] font-bold text-[#ef2c5b] no-underline hover:underline">View all</a>
          </div>
          
          <div className="grid grid-cols-2 gap-6 max-[760px]:grid-cols-1">
            {/* Offer 1 */}
            <div className="relative overflow-hidden rounded-[1.25rem] bg-[#ffe4eb] p-8 max-[480px]:p-6">
               <div className="relative z-10 max-w-[200px]">
                 <h3 className="text-[2rem] font-bold leading-none text-[#ef2c5b]">50% OFF</h3>
                 <p className="mt-2 text-[0.95rem] text-[#6d5b61]">On your next breakfast order</p>
                 <div className="mt-6 inline-flex rounded-md bg-white px-3 py-1.5 text-[0.85rem] font-bold text-[#ef2c5b] shadow-sm">
                   URBAN50
                 </div>
               </div>
               {/* Decorative Graphic */}
               <div className="absolute -right-4 -bottom-4 h-40 w-40 rounded-full bg-[rgba(239,44,91,0.1)] blur-2xl pointer-events-none" />
               <div className="absolute right-6 bottom-6 h-12 w-16 rounded-md bg-[rgba(239,44,91,0.4)] rotate-[-12deg] pointer-events-none flex items-center justify-center text-white">
                  <StarIcon />
               </div>
            </div>

            {/* Offer 2 */}
            <div className="relative overflow-hidden rounded-[1.25rem] bg-[#dcf0e8] p-8 max-[480px]:p-6">
               <div className="relative z-10 max-w-[200px]">
                 <h3 className="text-[2rem] font-bold leading-none text-[#1b7b59]">FREE DESSERT</h3>
                 <p className="mt-2 text-[0.95rem] text-[#5e776e]">With any main course</p>
                 <div className="mt-6 inline-flex rounded-md bg-white px-3 py-1.5 text-[0.85rem] font-bold text-[#1b7b59] shadow-sm">
                   SWEETTOOTH
                 </div>
               </div>
               {/* Decorative Graphic */}
               <div className="absolute -right-4 -top-4 h-40 w-40 rounded-full bg-[rgba(27,123,89,0.1)] blur-2xl pointer-events-none" />
               <div className="absolute right-8 bottom-6 pointer-events-none">
                 <svg className="h-[4.5rem] w-[4.5rem] text-[rgba(27,123,89,0.3)]" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M12 2C8.13 2 5 5.13 5 9C5 11.38 6.19 13.47 8 14.74V17C8 18.1 8.9 19 10 19H14C15.1 19 16 18.1 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.13 15.87 2 12 2ZM10 20H14V22H10V20Z" />
                 </svg>
               </div>
            </div>
          </div>
        </section>

        {/* MENU PREVIEW */}
        <section>
          <div className="mb-6 flex items-end justify-between max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-4">
            <h2 className="text-[1.5rem] font-bold text-[#12182f]">
              Our <span className="font-['Playfair_Display',serif] text-[1.8rem] font-normal italic text-[#ef2c5b]">Menu</span>
            </h2>
            
            <div className="flex gap-2 rounded-full bg-white p-1 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
              {["Breakfast", "Lunch", "Dinner"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-5 py-2 text-[0.9rem] font-bold transition-colors ${
                    activeTab === tab 
                      ? "bg-[#fff1f4] text-[#ef2c5b]" 
                      : "text-[#64748b] hover:text-[#12182f]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 max-[1100px]:grid-cols-2 max-[640px]:grid-cols-1">
            {menuItems.map((item) => (
              <div key={item.id} className="flex flex-col overflow-hidden rounded-[1.25rem] bg-white p-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-transform hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#f1f5f9]">
                  <img src={item.img} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[0.8rem] font-bold backdrop-blur-sm">
                    <span className="h-3 w-3"><StarIcon /></span>
                    {item.rating}
                  </div>
                </div>
                
                <div className="flex flex-1 flex-col p-3 pt-4">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="flex-1 text-[1rem] font-bold leading-tight text-[#1a202c]">{item.name}</h3>
                    <span className="font-bold text-[#ef2c5b]">{item.price}</span>
                  </div>
                  <p className="mb-4 text-[0.85rem] leading-[1.6] text-[#64748b] line-clamp-2">
                    {item.description}
                  </p>
                  <div className="mt-auto">
                    <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#fff1f4] py-[0.6rem] text-[0.9rem] font-bold text-[#ef2c5b] transition-colors hover:bg-[#ffe3ea]">
                      <span className="h-[1.1rem] w-[1.1rem]"><AddToCartIcon /></span>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RECENT ORDERS */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[1.5rem] font-bold text-[#12182f] border-b-2 border-transparent">
              Recent Orders
            </h2>
            <a href="#orders" className="text-[0.9rem] font-bold text-[#ef2c5b] no-underline hover:underline">Track all orders</a>
          </div>

          <div className="grid gap-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-6 rounded-[1.25rem] bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-4">
                <div className="flex flex-1 items-center gap-4">
                  <div className={`flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-xl ${order.iconBg} ${order.iconColor}`}>
                    {/* Placeholder for food icon */}
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9C5 11.38 6.19 13.47 8 14.74V17C8 18.1 8.9 19 10 19H14C15.1 19 16 18.1 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.13 15.87 2 12 2ZM10 20H14V22H10V20Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[1rem] font-bold text-[#1a202c]">{order.name}</h3>
                    <p className="text-[0.85rem] text-[#94a3b8]">{order.id} • {order.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 max-[640px]:w-full max-[640px]:justify-between">
                  <div className="flex items-center gap-1.5 mr-6 max-[640px]:mr-0">
                    <span className={`block h-2 w-2 rounded-full ${order.status === 'Delivered' ? 'bg-[#3ebb8c]' : 'bg-[#eab308]'}`} />
                    <span className={`text-[0.9rem] font-bold ${order.status === 'Delivered' ? 'text-[#3ebb8c]' : 'text-[#eab308]'}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <span className="font-bold text-[#1a202c] mr-6 max-[640px]:hidden">{order.price}</span>
                  
                  <button className="min-w-[6rem] rounded-full border-[1.5px] border-[#ef2c5b] py-1.5 text-[0.85rem] font-bold text-[#ef2c5b] transition-colors hover:bg-[#ef2c5b] hover:text-white">
                    {order.status === 'Delivered' ? 'Reorder' : 'Track'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="mt-8 border-t border-[rgba(0,0,0,0.06)] bg-white py-10 px-6 max-[760px]:px-4">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-6 max-[760px]:items-center text-center">
          <div className="font-['Playfair_Display',serif] text-[1.4rem] font-bold italic text-[#12182f]">
            Urban Spoon
          </div>
          
          <div className="flex flex-wrap gap-6 text-[0.9rem] font-semibold text-[#64748b]">
            <a href="#privacy" className="no-underline hover:text-[#ef2c5b]">Privacy Policy</a>
            <a href="#terms" className="no-underline hover:text-[#ef2c5b]">Terms of Service</a>
            <a href="#contact" className="no-underline hover:text-[#ef2c5b]">Contact Us</a>
            <a href="#locations" className="no-underline hover:text-[#ef2c5b]">Locations</a>
          </div>

          <p className="text-[0.85rem] text-[#94a3b8]">
            © 2024 Urban Spoon. Crafted for the Urban Epicurean.
          </p>
        </div>
      </footer>
    </div>
  );
}
