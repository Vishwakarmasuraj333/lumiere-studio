"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Camera, Sparkles } from "lucide-react";

interface StatItem {
  label: string;
  value: number;
  suffix: string;
  description: string;
}

const STATS: StatItem[] = [
  { label: "Years of Mastery", value: 14, suffix: "+", description: "In Paris & New York" },
  { label: "Luxury Events", value: 420, suffix: "+", description: "Across 24 countries" },
  { label: "Global Awards", value: 28, suffix: "", description: "Hasselblad & Vogue" },
  { label: "Client Satisfaction", value: 99.8, suffix: "%", description: "Bespoke clientele" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    const increment = value / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start * 10) / 10);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#D6B77A]">
      {value % 1 === 0 ? Math.floor(count) : count.toFixed(1)}
      {suffix}
    </span>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="relative py-28 md:py-36 bg-[var(--bg-primary)] overflow-hidden">
      {/* Subtle background ambient light */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#D6B77A]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#D6B77A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center space-x-2 text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#D6B77A] font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Studio Philosophy</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[var(--text-primary)] tracking-tight">
            THE ART OF TIMELESS VISUAL STORYTELLING
          </h2>
          <div className="w-16 h-[1.5px] bg-[#D6B77A] mx-auto mt-6" />
        </div>

        {/* 2-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Overlapping Luxury Images with Hover Tilt */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Photographer Portrait */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative h-[480px] sm:h-[580px] w-full rounded-lg overflow-hidden border border-[var(--border-color)] shadow-2xl group"
              >
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=85&w=1200"
                  alt="Julian Vance - Creative Director & Principal Photographer"
                  fill
                  className="object-cover object-top filter grayscale contrast-105 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="font-serif text-xl tracking-wide">Julian & Elena Vance</p>
                  <p className="text-xs text-[#D6B77A] tracking-[0.2em] uppercase font-mono mt-1">
                    Founders & Creative Directors · Hasselblad Ambassadors
                  </p>
                </div>
              </motion.div>

              {/* Offset Secondary Image (Atelier Atmosphere) */}
              <motion.div
                initial={{ opacity: 0, x: 30, y: 30 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="hidden sm:block absolute -bottom-10 -right-8 w-56 h-64 rounded-lg overflow-hidden border-2 border-[#D6B77A]/60 shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-10 group"
              >
                <Image
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=85&w=600"
                  alt="Lumiere Atelier Portraiture"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="240px"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] tracking-widest uppercase font-mono text-[#D6B77A] bg-black/70 px-2 py-0.5 rounded">
                    Atelier 18 Rue St-Honoré
                  </span>
                </div>
              </motion.div>

              {/* Subtle Gold Accent Frame */}
              <div className="absolute -top-4 -left-4 w-32 h-32 border-t-2 border-l-2 border-[#D6B77A]/50 pointer-events-none rounded-tl-lg" />
            </div>
          </div>

          {/* Right Column: Studio Story & Philosophy */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <span className="text-xs tracking-[0.25em] text-[#D6B77A] uppercase font-semibold">
                Since 2012 · Paris & New York
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl text-[var(--text-primary)] leading-snug">
                Where light is sculpted with reverence, and intimacy is captured forever.
              </h3>
            </div>

            <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed font-light">
              Founded by master portraitist Julian Vance and creative director Elena Vance,{" "}
              <strong className="text-[var(--text-primary)] font-medium">LUMIÈRE STUDIO</strong> stands at the pinnacle of luxury photographic art. Operating between private ateliers in Paris and Manhattan, we craft editorial legacies for discerning couples, private dynasties, and world-renowned fashion houses.
            </p>

            <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed font-light">
              We reject formulaic trends and synthetic filters. Instead, we employ medium-format digital sensors delivering 100+ megapixels of tactile tonal richness, complemented by authentic 35mm and 120mm silver-halide film. Every frame is treated as a museum monograph, balancing haute-couture poise with genuine human emotion.
            </p>

            {/* Signature & Director Credentials */}
            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <div>
                <p className="font-serif italic text-2xl text-[var(--text-primary)]">Julian Vance</p>
                <p className="text-[11px] tracking-widest uppercase text-[#D6B77A] font-mono mt-0.5">
                  Principal Photographer & Fellow of the Royal Photographic Society
                </p>
              </div>

              {/* Official Seal / Crest */}
              <div className="w-14 h-14 rounded-full border border-[#D6B77A]/40 flex flex-col items-center justify-center text-center p-1 bg-[#D6B77A]/5">
                <Camera className="w-4 h-4 text-[#D6B77A]" />
                <span className="text-[7px] tracking-tighter uppercase text-[var(--text-secondary)] mt-0.5">EST. 2012</span>
              </div>
            </div>
          </div>
        </div>

        {/* Experience Statistics Row with Animated Counters */}
        <div className="mt-24 pt-16 border-t border-[var(--border-color)]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center">
            {STATS.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="flex flex-col items-center p-6 rounded-lg bg-[var(--bg-secondary)]/50 border border-[var(--border-subtle)] hover:border-[#D6B77A]/40 transition-all duration-300 group hover:-translate-y-1"
              >
                <Counter value={stat.value} suffix={stat.suffix} />
                <h4 className="font-serif text-base sm:text-lg text-[var(--text-primary)] mt-2 font-medium">
                  {stat.label}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] font-light mt-1">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

