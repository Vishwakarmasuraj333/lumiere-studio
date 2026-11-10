"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Camera, ArrowUp, Check, Mail } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#070707] text-white border-t border-[var(--border-color)] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-12">
        {/* Top Row: Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full border border-[#D6B77A]/60 flex items-center justify-center bg-[#D6B77A]/10">
                <Camera className="w-5 h-5 text-[#D6B77A]" />
              </div>
              <div>
                <span className="font-serif text-2xl tracking-[0.2em] font-medium text-white block">
                  LUMIÈRE STUDIO
                </span>
                <span className="text-[9px] tracking-[0.35em] text-[#D6B77A] uppercase -mt-1 block">
                  Paris · New York · Lake Como
                </span>
              </div>
            </div>

            <p className="text-xs text-[#A7A29A] leading-relaxed max-w-sm font-light mt-4">
              An international luxury photography agency devoted to medium-format mastery, emotional stillness, and cinematic monographs for discerning clientele worldwide.
            </p>
          </div>

          {/* Newsletter / Monograph Dispatch */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="text-[11px] tracking-[0.25em] uppercase font-mono text-[#D6B77A] mb-2">
              The Lumière Gazette
            </span>
            <h4 className="font-serif text-xl sm:text-2xl text-white mb-4">
              Receive private invitations to seasonal print exhibitions and travel dates.
            </h4>

            {subscribed ? (
              <div className="p-3 bg-[#D6B77A]/15 border border-[#D6B77A]/40 rounded-lg text-xs text-[#D6B77A] flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>You have been subscribed to our private patron circular.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your confidential email..."
                    required
                    className="w-full pl-10 pr-4 py-3 rounded bg-white/5 border border-white/15 focus:border-[#D6B77A] focus:outline-none text-xs text-white"
                  />
                  <Mail className="w-4 h-4 text-[#D6B77A] absolute left-3.5 top-3.5" />
                </div>
                <button
                  type="submit"
                  className="px-8 py-3 text-xs tracking-widest uppercase font-bold text-[#090909] bg-gradient-to-r from-[#ECC880] to-[#D6B77A] rounded hover:shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  Join Patron List
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle Row: Quick Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-12 text-xs">
          <div>
            <h5 className="font-mono text-[11px] tracking-widest uppercase text-[#D6B77A] mb-4">
              Portfolio
            </h5>
            <ul className="space-y-2.5 text-[#A7A29A]">
              <li><a href="#portfolio" className="hover:text-white transition-colors">Haute Couture Wedding</a></li>
              <li><a href="#portfolio" className="hover:text-white transition-colors">Paris Fashion & Editorial</a></li>
              <li><a href="#portfolio" className="hover:text-white transition-colors">Fine-Art Studio Portraits</a></li>
              <li><a href="#portfolio" className="hover:text-white transition-colors">Luxury Goods & Horology</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-[11px] tracking-widest uppercase text-[#D6B77A] mb-4">
              Services
            </h5>
            <ul className="space-y-2.5 text-[#A7A29A]">
              <li><a href="#services" className="hover:text-white transition-colors">Destination Monograph</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Analog Film Archive</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Museum Print Folios</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Executive Portraiture</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-[11px] tracking-widest uppercase text-[#D6B77A] mb-4">
              Atelier
            </h5>
            <ul className="space-y-2.5 text-[#A7A29A]">
              <li><a href="#about" className="hover:text-white transition-colors">Philosophy & Heritage</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors">Patron Reviews</a></li>
              <li><a href="#gallery" className="hover:text-white transition-colors">Visual Showcase</a></li>
              <li><Link href="/admin" className="hover:text-[#D6B77A] transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-[11px] tracking-widest uppercase text-[#D6B77A] mb-4">
              Flagships
            </h5>
            <ul className="space-y-2 text-[#A7A29A] text-[11px]">
              <li className="font-medium text-white">New York:</li>
              <li>740 Madison Ave, NY 10065</li>
              <li className="font-medium text-white pt-1">Paris:</li>
              <li>18 Rue du Faubourg St-Honoré</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A7A29A]">
          <p>© {new Date().getFullYear()} LUMIÈRE STUDIO Inc. All rights reserved. Registered trademark.</p>

          <div className="flex items-center space-x-6">
            <Link href="/admin" className="text-[11px] tracking-widest uppercase text-white/50 hover:text-[#D6B77A] transition-colors">
              Staff Access
            </Link>
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1.5 text-[#D6B77A] hover:text-white transition-colors"
            >
              <span>Return to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

