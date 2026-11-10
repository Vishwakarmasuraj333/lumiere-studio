"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export default function AccoladesMarquee() {
  const accolades = [
    "VOGUE DIRECTORY BEST WEDDING EDITORIAL",
    "HASSELBLAD MASTERS NOMINEE 2025",
    "PARIS PHOTO AWARDS GOLD MEDAL",
    "LEICA ACADEMY DISTINGUISHED ARTIST",
    "CANNES LIONS LUXURY VISUALS",
    "HARPER'S BAZAAR RECOMMENDED",
    "ARCHITECTURAL DIGEST MASTER OF LIGHT",
    "CONDE NAST LUXURY TRAVEL HONOREE",
  ];

  return (
    <div className="w-full bg-[#111111] border-y border-[var(--border-color)] overflow-hidden py-4.5 relative z-20">
      <div className="flex select-none space-x-12 animate-marquee whitespace-nowrap">
        {[...accolades, ...accolades].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center space-x-4 text-[11px] md:text-xs tracking-[0.3em] uppercase font-medium text-[var(--text-secondary)] hover:text-[#D6B77A] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>{item}</span>
            <span className="text-white/20">/</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

