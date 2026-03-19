import React from "react";

export default function Testimonials() {
  const reviews = [
    {
      name: "Sarah Richardson",
      role: "Local Guide",
      initials: "SR",
      quote:
        "The atmosphere is just incredible. It's my favorite spot to grab a coffee and a pastry on weekend mornings. Simply magical.",
    },
    {
      name: "James Miller",
      role: "Food Blogger",
      initials: "JM",
      quote:
        "The pasta is comparable to what I had in Florence. You can tell they use authentic recipes and the best ingredients available.",
    },
    {
      name: "Emily Davis",
      role: "Designer",
      initials: "ED",
      quote:
        "Perfect for business lunches. The staff is attentive but not intrusive, and the food comes out quickly and perfectly presented.",
    },
  ];

  return (
    <section className="mx-auto w-[min(1120px,calc(100%-2rem))] py-16 max-[640px]:w-[min(100%-1rem,1120px)] max-[640px]:py-12" id="reviews">
      <h2 className="text-center text-[clamp(2rem,4vw,2.8rem)] text-[#172033]">What Our Guests Say</h2>
      <p className="mx-auto mt-3 max-w-[42rem] text-center leading-[1.7] text-[#61708c]">
        Real stories from the people who make Urban Spoon their second home.
      </p>

      <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
        {reviews.map((review) => (
          <figure className="grid gap-4 rounded-3xl border border-[rgba(23,32,51,0.08)] bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.06)]" key={review.name}>
            <div className="flex gap-[0.15rem] text-[#ea2e60]" aria-hidden="true">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>
            <blockquote className="italic leading-[1.7] text-[#61708c]">"{review.quote}"</blockquote>
            <figcaption className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-[rgba(234,46,96,0.1)] font-bold text-[#ea2e60]">{review.initials}</div>
              <div>
                <div className="font-bold text-[#172033]">{review.name}</div>
                <div className="text-[0.9rem] text-[#61708c]">{review.role}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
