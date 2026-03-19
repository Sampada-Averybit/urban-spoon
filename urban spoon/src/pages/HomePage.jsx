import React from "react";
import Hero from "../components/Hero";
import FeaturedPreview from "../components/FeaturedPreview";
import OurStory from "../components/OurStory";
import Testimonials from "../components/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedPreview />
      <OurStory />
      <Testimonials />
    </>
  );
}
