"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles } from "lucide-react";

interface ShowcaseItem {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  aspect: string;
  imageUrl: string;
  series: string;
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: "sc-1",
    title: "Symphony in Chiffon",
    subtitle: "High Haute Couture editorial commission for Paris Fashion Week",
    location: "Place Vendôme · Paris",
    aspect: "Medium Format Monograph",
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=85&w=2000",
    series: "Editorial Series I",
  },
  {
    id: "sc-2",
    title: "Twilight on the Grand Canal",
    subtitle: "Private evening regatta celebration under Venetian lanterns",
    location: "Palazzo Grassi · Venice",
    aspect: "Atmospheric 35mm Grain",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=85&w=2000",
    series: "Venice Chronicles",
  },
  {
    id: "sc-3",
    title: "The Horizon of Light",
    subtitle: "Glacial alpine peaks reflecting the first golden rays of dawn",
    location: "Zermatt · Swiss Alps",
    aspect: "Panoramic Fine Art",
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=85&w=2000",
    series: "Alpine Solitude",
  },
  {
    id: "sc-4",
    title: "Gilded Hour in Provence",
    subtitle: "Romantic bridal walk through ancient lavender fields and cypress groves",
    location: "Château de Fonscolombe · Aix-en-Provence",
    aspect: "Natural Ambient Glow",
    imageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=85&w=2000",
    series: "French Estate Elegance",
  },
  {
    id: "sc-5",
    title: "Midnight at the Film Festival",
    subtitle: "Red carpet arrivals and private after-hours gala overlooking the Mediterranean",
    location: "Hôtel du Cap-Eden-Roc · Antibes",
    aspect: "Documentary Haute Poise",
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=85&w=2000",
    series: "Riviera Galas",
  },
];

export default function ShowcaseSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SHOWCASE_ITEMS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SHOWCASE_ITEMS.length) % SHOWCASE_ITEMS.length);
  }, []);

  // Autoplay
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, nextSlide]);

  // Touch and Swipe Support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const current = SHOWCASE_ITEMS[currentIndex];

  return (
    <section
      id="gallery"
      className="relative w-full h-[85vh] min-h-[620px] bg-black overflow-hidden flex items-center select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slides with Ken-Burns and Crossfade */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={current.imageUrl}
            alt={current.title}
            fill
            quality={92}
            className="object-cover object-center"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic Dark Gradient Layers */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

      {/* Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col justify-between h-full py-16">
        {/* Top Header Badge */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center space-x-2 text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#D6B77A] font-medium bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#D6B77A]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Collection · {current.series}</span>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs tracking-widest uppercase font-mono text-white/60">
              {current.location}
            </span>
          </div>
        </div>

        {/* Center Editorial Title */}
        <div className="max-w-2xl my-auto">
          <motion.p
            key={`aspect-${current.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs tracking-[0.25em] uppercase text-[#D6B77A] font-mono mb-2"
          >
            {current.aspect}
          </motion.p>

          <motion.h3
            key={`title-${current.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl text-white tracking-wide"
          >
            {current.title}
          </motion.h3>

          <motion.p
            key={`sub-${current.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-4 text-sm sm:text-base text-[#A7A29A] font-light max-w-lg"
          >
            {current.subtitle}
          </motion.p>
        </div>

        {/* Bottom Navigation & Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10">
          {/* Filmstrip Mini Thumbnails */}
          <div className="flex items-center space-x-3 overflow-x-auto max-w-full pb-2 sm:pb-0">
            {SHOWCASE_ITEMS.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Jump to ${item.title}`}
                className={`relative w-16 h-12 rounded overflow-hidden border transition-all duration-300 flex-shrink-0 ${
                  index === currentIndex
                    ? "border-[#D6B77A] scale-105 shadow-[0_0_15px_rgba(214,183,122,0.5)]"
                    : "border-white/20 opacity-50 hover:opacity-100"
                }`}
              >
                <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>

          {/* Interactive Player Controls */}
          <div className="flex items-center space-x-4 bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/15">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? "Pause auto slide" : "Start auto slide"}
              className="text-[#D6B77A] hover:text-white transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <span className="font-mono text-xs text-[#D6B77A]">
              0{currentIndex + 1} / 0{SHOWCASE_ITEMS.length}
            </span>

            <div className="h-4 w-[1px] bg-white/20" />

            <div className="flex items-center space-x-2">
              <button
                onClick={prevSlide}
                aria-label="Previous showcase"
                className="w-8 h-8 rounded-full border border-white/20 hover:border-[#D6B77A] hover:text-[#D6B77A] text-white flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next showcase"
                className="w-8 h-8 rounded-full border border-white/20 hover:border-[#D6B77A] hover:text-[#D6B77A] text-white flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

