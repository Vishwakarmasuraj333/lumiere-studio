"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, Compass, ArrowDown } from "lucide-react";

interface HeroSlide {
  id: string;
  imageUrl: string;
  tagline: string;
  title: string;
  location: string;
  category: string;
  cameraInfo: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=85&w=2000",
    tagline: "HAUTE COUTURE WEDDING MONOGRAPH",
    title: "CAPTURING TIMELESS MOMENTS.",
    location: "Villa Balbianello · Lake Como, Italy",
    category: "Haute Couture Wedding",
    cameraInfo: "Hasselblad H6D-100c · HC 100mm f/2.2",
  },
  {
    id: "slide-2",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=2000",
    tagline: "PARIS EDITORIAL CAMPAIGN",
    title: "LIGHT, SHADOW & SILHOUETTE.",
    location: "Grand Palais Éphémère · Paris, France",
    category: "Vogue High Fashion",
    cameraInfo: "Phase One IQ4 150MP · Schneider 80mm",
  },
  {
    id: "slide-3",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=85&w=2000",
    tagline: "CHIAROSCURO FINE-ART PORTRAITURE",
    title: "THE POETRY OF HUMAN PRESENCE.",
    location: "Tribeca Atelier · New York City",
    category: "Fine Art Portrait",
    cameraInfo: "Leica M11 · Noctilux 50mm f/0.95",
  },
  {
    id: "slide-4",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=85&w=2000",
    tagline: "PRIMEVAL NATURE & ARCHIVAL VISTAS",
    title: "STILLNESS BEFORE THE DAWN.",
    location: "Yosemite Granite Spires · California",
    category: "Nature & Fine Art",
    cameraInfo: "Hasselblad X2D 100C · XCD 38mm",
  },
];

interface HeroSectionProps {
  onOpenBooking?: () => void;
}

export default function HeroSection({ onOpenBooking }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [parallaxY, setParallaxY] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Parallax on mouse move or subtle scroll
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY * 0.35;
      setParallaxY(offset);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Automatic slide advancement
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const currentSlide = HERO_SLIDES[currentIndex];

  return (
    <section id="home" className="relative w-full h-screen min-h-[700px] overflow-hidden flex items-center justify-center">
      {/* Background Slides with Crossfade and Zoom */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ transform: `translateY(${parallaxY}px)` }}
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={currentSlide.imageUrl}
              alt={currentSlide.title}
              fill
              priority
              quality={90}
              className="object-cover object-center"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic Vignette and Dark Luxury Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-black/40 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Editorial Sub-badge */}
        <motion.div
          key={`tagline-${currentSlide.id}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#D6B77A]/40 bg-black/40 backdrop-blur-md mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D6B77A] animate-pulse" />
          <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#D6B77A] font-medium">
            {currentSlide.tagline}
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          key={`heading-${currentSlide.id}`}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.06em] leading-[1.08] text-[#F5F1E9] uppercase drop-shadow-2xl max-w-4xl"
        >
          {currentSlide.title}
        </motion.h1>

        {/* Luxury Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-[#A7A29A] font-light max-w-2xl tracking-wide italic font-serif"
        >
          &ldquo;Where every frame tells a beautiful story.&rdquo;
        </motion.p>

        {/* CTA Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
        >
          <a
            href="#portfolio"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#portfolio")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto px-8 py-4 rounded text-xs tracking-[0.25em] uppercase font-medium border border-[#D6B77A]/80 text-[#F5F1E9] bg-black/30 backdrop-blur-md hover:bg-[#D6B77A]/15 hover:border-[#D6B77A] transition-all duration-300 flex items-center justify-center space-x-2 group"
          >
            <span>Explore Portfolio</span>
            <Compass className="w-4 h-4 text-[#D6B77A] transition-transform duration-300 group-hover:rotate-45" />
          </a>

          <button
            onClick={() => {
              if (onOpenBooking) {
                onOpenBooking();
              } else {
                document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="w-full sm:w-auto px-9 py-4 rounded text-xs tracking-[0.25em] uppercase font-bold text-[#090909] bg-gradient-to-r from-[#ECC880] via-[#D6B77A] to-[#C5A25D] hover:shadow-[0_0_30px_rgba(214,183,122,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Book a Session
          </button>
        </motion.div>
      </div>

      {/* Bottom Floating Info & Controls Bar */}
      <div className="absolute bottom-8 left-0 right-0 z-20 max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        {/* EXIF / Location Badge */}
        <div className="hidden md:flex items-center space-x-3 text-[11px] tracking-wider text-[#A7A29A] bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <span className="text-[#D6B77A] uppercase font-medium">{currentSlide.location}</span>
          <span className="text-white/20">|</span>
          <span className="font-mono text-[10px] text-white/70">{currentSlide.cameraInfo}</span>
        </div>

        {/* Slide Indicators & Autoplay Control */}
        <div className="flex items-center space-x-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          {/* Pause / Play */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
            className="text-[#D6B77A] hover:text-white transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Indicator bars */}
          <div className="flex items-center space-x-2">
            {HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className="relative h-1 w-8 sm:w-12 bg-white/20 rounded-full overflow-hidden transition-all"
              >
                {index === currentIndex && (
                  <motion.div
                    className="absolute top-0 left-0 bottom-0 bg-[#D6B77A] rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: isPlaying ? "100%" : "100%" }}
                    transition={isPlaying ? { duration: 6.5, ease: "linear" } : { duration: 0.3 }}
                  />
                )}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-mono text-[#D6B77A]">
            0{currentIndex + 1} / 0{HERO_SLIDES.length}
          </span>
        </div>

        {/* Prev / Next Chevrons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="w-9 h-9 rounded-full border border-white/20 bg-black/40 hover:bg-[#D6B77A] hover:border-[#D6B77A] hover:text-[#090909] text-white flex items-center justify-center transition-all duration-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="w-9 h-9 rounded-full border border-white/20 bg-black/40 hover:bg-[#D6B77A] hover:border-[#D6B77A] hover:text-[#090909] text-white flex items-center justify-center transition-all duration-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Down Scroll Anchor */}
      <a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
        }}
        aria-label="Scroll down to about"
        className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[#D6B77A]/60 hover:text-[#D6B77A] transition-colors animate-bounce hidden lg:block"
      >
        <ArrowDown className="w-4 h-4" />
      </a>
    </section>
  );
}

