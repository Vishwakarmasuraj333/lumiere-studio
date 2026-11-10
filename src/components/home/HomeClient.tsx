"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import AccoladesMarquee from "@/components/home/AccoladesMarquee";
import AboutSection from "@/components/home/AboutSection";
import PortfolioSection, { PhotoItem } from "@/components/home/PortfolioSection";
import ServicesSection, { ServiceItem } from "@/components/home/ServicesSection";
import ShowcaseSlider from "@/components/home/ShowcaseSlider";
import TestimonialsSection, { TestimonialItem } from "@/components/home/TestimonialsSection";
import BookingSection from "@/components/home/BookingSection";
import ContactSection from "@/components/home/ContactSection";
import Footer from "@/components/layout/Footer";

interface HomeClientProps {
  initialPhotos: PhotoItem[];
  initialServices: ServiceItem[];
  initialTestimonials: TestimonialItem[];
}

export default function HomeClient({
  initialPhotos,
  initialServices,
  initialTestimonials,
}: HomeClientProps) {
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string | undefined>(
    undefined
  );

  const handleOpenBooking = (serviceName?: string) => {
    if (serviceName) {
      setSelectedServiceForBooking(serviceName);
    }
    const el = document.getElementById("booking");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)]">
      {/* Sticky Navigation */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      {/* Hero Section */}
      <HeroSection onOpenBooking={() => handleOpenBooking()} />

      {/* Awards & Accolades Infinite Marquee */}
      <AccoladesMarquee />

      {/* Studio Philosophy & Introduction */}
      <AboutSection />

      {/* Curated Masonry Portfolio */}
      <PortfolioSection
        initialPhotos={initialPhotos}
        onOpenBooking={(cat) => handleOpenBooking(cat)}
      />

      {/* Bespoke Photography Services */}
      <ServicesSection
        initialServices={initialServices}
        onSelectService={(svc) => handleOpenBooking(svc)}
      />

      {/* Background Visual Showcase Slider */}
      <ShowcaseSlider />

      {/* Patron Testimonials */}
      <TestimonialsSection initialTestimonials={initialTestimonials} />

      {/* Appointment Booking System */}
      <BookingSection preselectedService={selectedServiceForBooking} />

      {/* Atelier Contact & Map */}
      <ContactSection />

      {/* Luxury Footer */}
      <Footer />
    </div>
  );
}

