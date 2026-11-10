"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun, Menu, X, Camera, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onOpenBooking?: (serviceName?: string) => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Check active section
      const sections = ["home", "about", "portfolio", "services", "gallery", "testimonials", "booking", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home", id: "home" },
    { label: "About", href: "#about", id: "about" },
    { label: "Portfolio", href: "#portfolio", id: "portfolio" },
    { label: "Services", href: "#services", id: "services" },
    { label: "Gallery", href: "#gallery", id: "gallery" },
    { label: "Testimonials", href: "#testimonials", id: "testimonials" },
    { label: "Contact", href: "#contact", id: "contact" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? "bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-[var(--border-color)] py-3.5 shadow-2xl"
            : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="#home"
            onClick={(e) => handleNavClick(e, "#home")}
            className="group flex items-center space-x-3 text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-full border border-[#D6B77A]/60 flex items-center justify-center transition-transform duration-500 group-hover:rotate-45 group-hover:border-[#D6B77A] bg-[#D6B77A]/10">
              <Camera className="w-4 h-4 text-[#D6B77A]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl md:text-2xl tracking-[0.22em] font-medium text-[var(--text-primary)] group-hover:text-[#D6B77A] transition-colors">
                LUMIÈRE
              </span>
              <span className="text-[9px] tracking-[0.35em] text-[#D6B77A] uppercase -mt-0.5">
                Studio Paris · NY
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative text-xs tracking-[0.2em] uppercase font-medium transition-colors py-1 ${
                    isActive
                      ? "text-[#D6B77A]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#D6B77A]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Actions: Theme Toggle, Book CTA, Admin link, Mobile toggle */}
          <div className="flex items-center space-x-4">
            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-full border border-[var(--border-subtle)] hover:border-[#D6B77A]/50 bg-white/5 text-[var(--text-primary)] hover:text-[#D6B77A] transition-all duration-300"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-[#D6B77A]" />
              ) : (
                <Moon className="w-4 h-4 text-[#B8934C]" />
              )}
            </button>

            {/* Admin Portal Shortcut */}
            <Link
              href="/admin"
              title="Admin Portal"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 text-[11px] tracking-widest uppercase rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[#D6B77A] hover:border-[#D6B77A]/40 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[#D6B77A]" />
              <span className="hidden xl:inline">Portal</span>
            </Link>

            {/* Book Session CTA */}
            <button
              onClick={() => {
                if (onOpenBooking) {
                  onOpenBooking();
                } else {
                  const el = document.getElementById("booking");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-semibold text-[#090909] bg-gradient-to-r from-[#ECC880] via-[#D6B77A] to-[#C5A25D] hover:shadow-[0_0_20px_rgba(214,183,122,0.4)] rounded transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Book Session
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open menu"
              className="lg:hidden p-2 rounded text-[var(--text-primary)] hover:text-[#D6B77A] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 lg:hidden bg-[var(--bg-primary)]/98 backdrop-blur-2xl pt-28 px-8 flex flex-col justify-between pb-10"
          >
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="font-serif text-2xl tracking-wider text-[var(--text-primary)] hover:text-[#D6B77A] transition-colors flex items-center justify-between border-b border-[var(--border-subtle)] pb-4"
                >
                  <span>{link.label}</span>
                  <span className="text-xs font-sans tracking-widest text-[#D6B77A]">0{navLinks.indexOf(link) + 1}</span>
                </a>
              ))}
            </div>

            <div className="space-y-4 pt-6">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenBooking) {
                    onOpenBooking();
                  } else {
                    const el = document.getElementById("booking");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="w-full py-4 text-center text-xs tracking-[0.25em] uppercase font-bold text-[#090909] bg-gradient-to-r from-[#ECC880] to-[#D6B77A] rounded shadow-lg"
              >
                Reserve Your Date
              </button>
              <div className="flex justify-between items-center text-xs text-[var(--text-secondary)] tracking-widest pt-2">
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#D6B77A] flex items-center space-x-1">
                  <Shield className="w-3.5 h-3.5 text-[#D6B77A]" />
                  <span>Admin Dashboard</span>
                </Link>
                <span>Paris · New York</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

