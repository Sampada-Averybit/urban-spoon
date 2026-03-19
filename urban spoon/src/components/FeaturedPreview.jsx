import React from "react";
import { Link } from "react-router-dom";

export default function FeaturedPreview() {
  const dishes = [
    {
      name: "Avocado Toast",
      description:
        "Fresh sourdough topped with hand-mashed organic avocado, chili flakes, and microgreens.",
      price: "$14.50",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Gourmet Pasta",
      description:
        "Handmade tagliatelle tossed in a rich truffle cream sauce with wild forest mushrooms.",
      price: "$22.00",
      image:
        "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Artisan Pastries",
      description:
        "A curated selection of our daily baked buttery croissants, danishes, and seasonal fruit tarts.",
      price: "$12.00",
      image:
        "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    },
  ];

  return (
    <section
      className="mx-auto w-[min(1120px,calc(100%-2rem))] py-16 max-[700px]:w-[min(100%-1rem,1120px)] max-[700px]:py-12"
      id="featured"
    >
      <div className="mb-8 flex items-end justify-between gap-4 max-[700px]:flex-col max-[700px]:items-start">
        <h2 className="relative pb-2 text-[clamp(2rem,4vw,2.6rem)] after:absolute after:bottom-0 after:left-0 after:h-1 after:w-14 after:rounded-full after:bg-[#ea2e60] after:content-['']">Chef's Recommendations</h2>
        <Link className="font-bold text-[#ea2e60] no-underline" to="/menu">
          View Full Menu →
        </Link>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
        {dishes.map((dish) => (
          <article className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_20px_45px_rgba(15,23,42,0.1)] transition-[transform,box-shadow] duration-200 ease-in hover:-translate-y-1 hover:shadow-[0_26px_52px_rgba(15,23,42,0.12)]" key={dish.name}>
            <div className="aspect-[16/10] overflow-hidden">
              <img className="h-full w-full object-cover" src={dish.image} alt={dish.name} />
            </div>
            <div className="grid flex-1 gap-4 p-6">
              <h3 className="text-[1.2rem]">{dish.name}</h3>
              <p className="leading-[1.65] text-[#61708c]">{dish.description}</p>
              <div className="mt-auto flex items-center justify-between gap-3 max-[700px]:flex-col max-[700px]:items-start">
                <span className="font-bold text-[#172033]">{dish.price}</span>
                <button className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[rgba(234,46,96,0.1)] px-4 font-bold text-[#ea2e60] transition-[transform,box-shadow] duration-200 ease-in hover:-translate-y-px hover:shadow-[0_10px_25px_rgba(15,23,42,0.06)]" type="button">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 4H3V6H5L8.68 14.39L7.24 16.04C6.9 16.42 6.87 16.97 7.17 17.38C7.48 17.79 7.99 18 8.52 18H19V16H8.53C8.44 16 8.37 15.95 8.34 15.87L8.34 15.86L9.1 15H16.55C17.3 15 17.96 14.58 18.3 13.97L21.88 7.97C21.95 7.83 22 7.67 22 7.5C22 6.67 21.33 6 20.5 6H6.21L5.27 3H1V1H4.27C4.73 1 5.13 1.31 5.26 1.75L6.23 4H7V4Z"
                      fill="currentColor"
                    />
                  </svg>
                  Order Now
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
