"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from "lucide-react";

export interface TestimonialItem {
  id: string;
  clientName: string;
  clientRole: string;
  eventType: string;
  venue: string;
  avatarUrl: string;
  rating: number;
  quote: string;
}

interface TestimonialsSectionProps {
  initialTestimonials?: TestimonialItem[];
}

export default function TestimonialsSection({ initialTestimonials = [] }: TestimonialsSectionProps) {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const res = await fetch("/api/testimonials");
        if (res.ok) {
          const data = await res.json();
          setTestimonials(data);
        }
      } catch (err) {
        console.error("Failed to load testimonials:", err);
      }
    }
    if (initialTestimonials.length === 0) {
      loadTestimonials();
    }
  }, [initialTestimonials.length]);

  useEffect(() => {
    if (isPaused || testimonials.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, testimonials.length]);

  const nextTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  return (
    <section
      id="testimonials"
      className="py-28 md:py-36 bg-[var(--bg-secondary)] relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#D6B77A]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#D6B77A] font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Patron Endorsements</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[var(--text-primary)] tracking-tight">
            WORDS FROM OUR CLIENTELE
          </h2>
          <div className="w-16 h-[1.5px] bg-[#D6B77A] mx-auto mt-6" />
        </div>

        {/* Testimonial Card Slider */}
        <div className="relative min-h-[380px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 sm:p-12 shadow-2xl relative"
            >
              <Quote className="w-12 h-12 text-[#D6B77A]/20 absolute top-8 right-8" />

              {/* 5-Star Gold Rating */}
              <div className="flex items-center space-x-1.5 mb-6">
                {[...Array(current.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#D6B77A] text-[#D6B77A]" />
                ))}
              </div>

              {/* Quote Text */}
              <blockquote className="font-serif text-lg sm:text-2xl md:text-3xl text-[var(--text-primary)] leading-relaxed italic">
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              {/* Client Info and Venue */}
              <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border border-[#D6B77A]/60 flex-shrink-0">
                    <Image
                      src={current.avatarUrl}
                      alt={current.clientName}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-medium text-[var(--text-primary)]">
                      {current.clientName}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] font-mono tracking-wider">
                      {current.clientRole} · {current.eventType}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] tracking-widest uppercase font-mono text-[#D6B77A] bg-[#D6B77A]/10 px-3 py-1 rounded">
                    {current.venue}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls and Dots */}
        <div className="mt-10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-[#D6B77A]"
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
              className="p-3 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[#D6B77A] hover:text-[#D6B77A] text-[var(--text-primary)] transition-colors shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextTestimonial}
              aria-label="Next testimonial"
              className="p-3 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[#D6B77A] hover:text-[#D6B77A] text-[var(--text-primary)] transition-colors shadow-md"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

