"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, X } from "lucide-react";

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  tag: string;
  subtitle: string;
  description: string;
  priceStarting: string;
  duration: string;
  deliverables: string;
  imageUrl: string;
}

interface ServicesSectionProps {
  initialServices?: ServiceItem[];
  onSelectService?: (serviceName: string) => void;
}

export default function ServicesSection({ initialServices = [], onSelectService }: ServicesSectionProps) {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/services");
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      } catch (err) {
        console.error("Failed to load services:", err);
      }
    }
    if (initialServices.length === 0) {
      fetchServices();
    }
  }, [initialServices.length]);

  const handleBookService = (service: ServiceItem) => {
    setActiveModalService(null);
    if (onSelectService) {
      onSelectService(service.name);
    } else {
      const el = document.getElementById("booking");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="services" className="py-28 md:py-36 bg-[var(--bg-primary)] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center space-x-2 text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#D6B77A] font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bespoke Offerings</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[var(--text-primary)] tracking-tight">
            PHOTOGRAPHIC COMMISSIONS
          </h2>
          <p className="mt-4 text-[var(--text-secondary)] text-sm sm:text-base font-light max-w-xl mx-auto">
            From intimate private portraits to multi-day international haute couture weddings, each commission is executed with bespoke artistic direction.
          </p>
          <div className="w-16 h-[1.5px] bg-[#D6B77A] mx-auto mt-6" />
        </div>

        {/* 6 Luxury Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const deliverablesList = service.deliverables
              ? service.deliverables.split(",").map((s) => s.trim())
              : [];

            return (
              <motion.div
                key={service.id || service.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative rounded-xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[#D6B77A]/70 transition-all duration-500 shadow-xl hover:shadow-[0_15px_40px_rgba(214,183,122,0.12)] flex flex-col justify-between"
              >
                {/* Image Container with Luxury Overlay */}
                <div className="relative w-full h-64 overflow-hidden">
                  <Image
                    src={service.imageUrl}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-black/30 to-black/50" />

                  {/* Service Badge & Starting Rate */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-[10px] tracking-[0.2em] uppercase font-mono bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[#D6B77A] border border-[#D6B77A]/30">
                      {service.tag}
                    </span>
                    <span className="text-xs font-serif font-medium text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      {service.priceStarting}
                    </span>
                  </div>

                  {/* Title Over Image */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-serif text-2xl group-hover:text-[#D6B77A] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs text-white/70 italic font-light mt-0.5 line-clamp-1">
                      {service.subtitle}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-light line-clamp-3">
                    {service.description}
                  </p>

                  {/* Deliverables snippet */}
                  <div className="space-y-2 border-t border-[var(--border-subtle)] pt-4">
                    <p className="text-[11px] tracking-widest uppercase font-mono text-[#D6B77A]">
                      Key Inclusions:
                    </p>
                    <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                      {deliverablesList.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-[#D6B77A] flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Buttons */}
                  <div className="pt-2 flex items-center space-x-3">
                    <button
                      onClick={() => setActiveModalService(service)}
                      className="flex-1 py-3 text-xs tracking-[0.2em] uppercase font-medium rounded border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[#D6B77A] hover:text-[#D6B77A] transition-colors text-center"
                    >
                      Discover More
                    </button>
                    <button
                      onClick={() => handleBookService(service)}
                      className="px-4 py-3 text-xs tracking-[0.15em] uppercase font-bold text-[#090909] bg-gradient-to-r from-[#ECC880] to-[#D6B77A] rounded hover:shadow-lg transition-transform hover:scale-105 active:scale-95"
                    >
                      Reserve
                    </button>
                  </div>
                </div>

                {/* Golden Bottom Border Accent */}
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#D6B77A]/50 to-transparent group-hover:via-[#D6B77A] transition-colors" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Service Details Modal */}
      <AnimatePresence>
        {activeModalService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative max-w-2xl w-full bg-[var(--bg-card)] border border-[#D6B77A]/40 rounded-xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setActiveModalService(null)}
                aria-label="Close modal"
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:text-[#D6B77A] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-60 w-full">
                <Image
                  src={activeModalService.imageUrl}
                  alt={activeModalService.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-black/40 to-black/20" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[10px] tracking-widest uppercase font-mono text-[#D6B77A] bg-black/60 px-3 py-1 rounded">
                    {activeModalService.tag}
                  </span>
                  <h3 className="font-serif text-3xl text-white mt-2">
                    {activeModalService.name}
                  </h3>
                  <p className="text-xs text-[#D6B77A] font-light mt-1">
                    {activeModalService.subtitle}
                  </p>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  {activeModalService.description}
                </p>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-[var(--border-subtle)] text-xs">
                  <div>
                    <span className="text-[var(--text-muted)] uppercase tracking-wider block">Duration:</span>
                    <span className="font-medium text-[var(--text-primary)] text-sm">{activeModalService.duration}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] uppercase tracking-wider block">Starting Rate:</span>
                    <span className="font-medium text-[#D6B77A] text-sm">{activeModalService.priceStarting}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs tracking-widest uppercase font-mono text-[#D6B77A] mb-3">
                    Bespoke Deliverables Included:
                  </h4>
                  <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                    {activeModalService.deliverables.split(",").map((item, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <Check className="w-3.5 h-3.5 text-[#D6B77A]" />
                        <span>{item.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex justify-end space-x-4">
                  <button
                    onClick={() => setActiveModalService(null)}
                    className="px-6 py-3 text-xs tracking-widest uppercase text-[var(--text-secondary)] hover:text-white"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleBookService(activeModalService)}
                    className="px-8 py-3 text-xs tracking-widest uppercase font-bold text-[#090909] bg-gradient-to-r from-[#ECC880] to-[#D6B77A] rounded hover:shadow-lg"
                  >
                    Proceed to Booking
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

