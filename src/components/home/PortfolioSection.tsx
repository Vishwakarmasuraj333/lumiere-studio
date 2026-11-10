"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export interface PhotoItem {
  id: string;
  title: string;
  category: string;
  description?: string | null;
  imageUrl: string;
  cameraModel?: string | null;
  lensInfo?: string | null;
  aperture?: string | null;
  location?: string | null;
  year?: string | null;
  orientation?: string;
  featured?: boolean;
}

const CATEGORIES = [
  "All",
  "Wedding",
  "Fashion",
  "Portrait",
  "Nature",
  "Commercial",
  "Events",
];

interface PortfolioSectionProps {
  initialPhotos?: PhotoItem[];
  onOpenBooking?: (serviceName?: string) => void;
}

export default function PortfolioSection({ initialPhotos = [], onOpenBooking }: PortfolioSectionProps) {
  const [photos, setPhotos] = useState<PhotoItem[]>(initialPhotos);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch photos from API if not provided
  useEffect(() => {
    async function loadPhotos() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/photos");
        if (res.ok) {
          const data = await res.json();
          setPhotos(data);
        }
      } catch (err) {
        console.error("Error fetching photos:", err);
      } finally {
        setIsLoading(false);
      }
    }
    if (initialPhotos.length === 0) {
      loadPhotos();
    }
  }, [initialPhotos.length]);

  // Filter photos
  const filteredPhotos = useMemo(() => {
    if (selectedCategory === "All") return photos;
    return photos.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [photos, selectedCategory]);

  useEffect(() => {
    if (activeLightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [activeLightboxIndex]);

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setActiveLightboxIndex(null);
  }, []);

  const nextLightboxImage = useCallback(() => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) => ((prev! + 1) % filteredPhotos.length));
  }, [activeLightboxIndex, filteredPhotos.length]);

  const prevLightboxImage = useCallback(() => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) => ((prev! - 1 + filteredPhotos.length) % filteredPhotos.length));
  }, [activeLightboxIndex, filteredPhotos.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextLightboxImage();
      if (e.key === "ArrowLeft") prevLightboxImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLightboxIndex, closeLightbox, nextLightboxImage, prevLightboxImage]);

  const activePhoto = activeLightboxIndex !== null ? filteredPhotos[activeLightboxIndex] : null;

  return (
    <section id="portfolio" className="py-28 md:py-36 bg-[var(--bg-secondary)] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#D6B77A] font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Archive</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[var(--text-primary)] tracking-tight">
            SELECTED PHOTOGRAPHIC WORKS
          </h2>
          <p className="mt-4 text-[var(--text-secondary)] text-sm sm:text-base font-light max-w-xl mx-auto">
            A retrospective of global commissions across Paris, Lake Como, New York, and Tokyo. Captured in medium format and archival 35mm film.
          </p>
          <div className="w-16 h-[1.5px] bg-[#D6B77A] mx-auto mt-6" />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-14">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-5 py-2.5 rounded-full text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 ${
                  isSelected
                    ? "bg-[#D6B77A] text-[#090909] font-semibold shadow-[0_0_20px_rgba(214,183,122,0.35)]"
                    : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[#D6B77A]/40"
                }`}
              >
                {cat === "All" ? "All Works" : cat}
              </button>
            );
          })}
        </div>

        {/* Masonry / Responsive Grid */}
        {isLoading && photos.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-[#D6B77A]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#D6B77A]" />
          </div>
        ) : (
          <motion.div
            layout
            className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            <AnimatePresence>
              {filteredPhotos.map((photo, index) => {
                const isTall = photo.orientation === "portrait";
                return (
                  <motion.div
                    layout
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    onClick={() => openLightbox(index)}
                    className="break-inside-avoid relative group rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-card)] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-[#D6B77A]/60"
                  >
                    {/* Image with Aspect Ratio & Zoom */}
                    <div className={`relative w-full ${isTall ? "aspect-[3/4]" : "aspect-[4/3]"} overflow-hidden bg-black/40`}>
                      <Image
                        src={photo.imageUrl}
                        alt={photo.title}
                        fill
                        loading="lazy"
                        quality={85}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />

                      {/* Subtle Dark Luxury Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-between p-6" />

                      {/* Top Corner Badges */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-2 group-hover:translate-y-0">
                        <span className="text-[10px] tracking-[0.2em] uppercase font-mono bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[#D6B77A] border border-[#D6B77A]/30">
                          {photo.category}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white border border-white/20">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Bottom Caption & Specs */}
                      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <h3 className="font-serif text-lg font-medium tracking-wide drop-shadow-md">
                          {photo.title}
                        </h3>
                        {photo.location && (
                          <div className="flex items-center space-x-1.5 text-xs text-[#D6B77A] mt-1 font-sans">
                            <MapPin className="w-3 h-3" />
                            <span>{photo.location}</span>
                          </div>
                        )}
                        {photo.cameraModel && (
                          <p className="text-[10px] text-white/60 font-mono tracking-wider mt-2 border-t border-white/10 pt-1.5">
                            {photo.cameraModel} · {photo.lensInfo} · {photo.aperture}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              aria-label="Close Lightbox"
              className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-[#D6B77A] hover:text-[#090909] text-white transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Previous Arrow */}
            <button
              onClick={prevLightboxImage}
              aria-label="Previous photograph"
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-[#D6B77A] hover:text-[#090909] text-white transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Arrow */}
            <button
              onClick={nextLightboxImage}
              aria-label="Next photograph"
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-[#D6B77A] hover:text-[#090909] text-white transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Center Content: Photo and Editorial Info Panel */}
            <div className="relative max-w-6xl w-full max-h-[92vh] flex flex-col lg:flex-row items-center gap-8 overflow-y-auto lg:overflow-visible">
              {/* Image Frame */}
              <div className="relative w-full lg:w-2/3 h-[50vh] sm:h-[65vh] lg:h-[80vh] rounded-lg overflow-hidden border border-white/10 shadow-2xl bg-black">
                <Image
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  fill
                  quality={95}
                  priority
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>

              {/* Sidebar Info Card */}
              <div className="w-full lg:w-1/3 flex flex-col justify-between p-6 rounded-lg bg-[#141414] border border-[#D6B77A]/30 text-white shadow-2xl">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] tracking-[0.25em] uppercase font-mono text-[#D6B77A] bg-[#D6B77A]/10 px-3 py-1 rounded">
                      {activePhoto.category}
                    </span>
                    <span className="text-xs text-white/50 font-mono">
                      {activeLightboxIndex! + 1} / {filteredPhotos.length}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl text-white tracking-wide">
                    {activePhoto.title}
                  </h3>

                  {activePhoto.description && (
                    <p className="mt-3 text-sm text-[#A7A29A] leading-relaxed font-light">
                      {activePhoto.description}
                    </p>
                  )}

                  {/* Metadata Specs */}
                  <div className="mt-6 space-y-2.5 pt-4 border-t border-white/10 text-xs">
                    {activePhoto.location && (
                      <div className="flex items-center space-x-2 text-[#A7A29A]">
                        <MapPin className="w-4 h-4 text-[#D6B77A]" />
                        <span>{activePhoto.location}</span>
                      </div>
                    )}
                    {activePhoto.year && (
                      <div className="flex items-center space-x-2 text-[#A7A29A]">
                        <Calendar className="w-4 h-4 text-[#D6B77A]" />
                        <span>Monograph Archive {activePhoto.year}</span>
                      </div>
                    )}
                    {activePhoto.cameraModel && (
                      <div className="flex items-center space-x-2 text-[#A7A29A]">
                        <Camera className="w-4 h-4 text-[#D6B77A]" />
                        <span className="font-mono text-[11px]">{activePhoto.cameraModel}</span>
                      </div>
                    )}
                    {activePhoto.lensInfo && (
                      <div className="text-[11px] font-mono text-white/60 pl-6">
                        Lens: {activePhoto.lensInfo} ({activePhoto.aperture || "f/2.2"})
                      </div>
                    )}
                  </div>
                </div>

                {/* Direct Booking CTA */}
                <div className="mt-8 pt-4 border-t border-white/10">
                  <button
                    onClick={() => {
                      closeLightbox();
                      if (onOpenBooking) {
                        onOpenBooking(activePhoto.category);
                      } else {
                        document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="w-full py-3.5 px-4 text-xs tracking-[0.2em] uppercase font-bold text-[#090909] bg-gradient-to-r from-[#ECC880] to-[#D6B77A] rounded hover:shadow-[0_0_20px_rgba(214,183,122,0.4)] transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Inquire About This Style</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

