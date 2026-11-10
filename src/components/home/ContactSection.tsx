"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Clock,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Globe,
} from "lucide-react";

interface StudioConfig {
  studioName: string;
  phone: string;
  email: string;
  address: string;
  parisAddress?: string;
  instagramUrl: string;
}

export default function ContactSection() {
  const [studio, setStudio] = useState<StudioConfig>({
    studioName: "LUMIÈRE STUDIO",
    phone: "+1 (212) 847-9200",
    email: "concierge@lumiere-studio.com",
    address: "740 Madison Avenue, New York, NY 10065",
    parisAddress: "18 Rue du Faubourg Saint-Honoré, 75008 Paris",
    instagramUrl: "https://instagram.com/lumiere.studio",
  });

  const [contactData, setContactData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    honeypot: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStudio() {
      try {
        const res = await fetch("/api/studio");
        if (res.ok) {
          const data = await res.json();
          setStudio(data);
        }
      } catch (err) {
        console.error("Error loading studio config:", err);
      }
    }
    loadStudio();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!contactData.fullName || !contactData.email || !contactData.subject || !contactData.message) {
      setError("Please complete all required fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSuccess(true);
      setContactData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        honeypot: "",
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error sending inquiry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-28 md:py-36 bg-[var(--bg-secondary)] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#D6B77A] font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Inquiries</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[var(--text-primary)] tracking-tight">
            CONNECT WITH OUR ATELIER
          </h2>
          <p className="mt-4 text-[var(--text-secondary)] text-sm sm:text-base font-light max-w-xl mx-auto">
            Whether inquiring about international editorial commissions, print acquisition, or gallery exhibitions, we welcome your correspondence.
          </p>
          <div className="w-16 h-[1.5px] bg-[#D6B77A] mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Studio Locations & Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            {/* New York Flagship */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-8 rounded-xl space-y-3">
              <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-[#D6B77A]">
                Manhattan Flagship Atelier
              </span>
              <h3 className="font-serif text-xl text-[var(--text-primary)]">New York Studio</h3>
              <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                {studio.address}
              </p>
              <div className="pt-2 text-xs font-mono text-[#D6B77A]">
                Tel: {studio.phone}
              </div>
            </div>

            {/* Paris Studio */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-8 rounded-xl space-y-3">
              <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-[#D6B77A]">
                European Bureau
              </span>
              <h3 className="font-serif text-xl text-[var(--text-primary)]">Paris Atelier</h3>
              <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                {studio.parisAddress || "18 Rue du Faubourg Saint-Honoré, 75008 Paris"}
              </p>
              <div className="pt-2 text-xs font-mono text-[#D6B77A]">
                Tel: +33 1 42 68 55 00
              </div>
            </div>

            {/* General Direct Lines */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-8 rounded-xl space-y-4 text-xs text-[var(--text-secondary)]">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#D6B77A]" />
                <span className="font-mono">{studio.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-[#D6B77A]" />
                <span>Mon – Sat: 9:00 AM – 7:00 PM (By Private Appointment)</span>
              </div>
            </div>

            {/* Social Channels */}
            <div className="pt-4 flex items-center space-x-4">
              <span className="text-xs tracking-widest uppercase font-mono text-[var(--text-muted)]">Follow:</span>
              <a
                href={studio.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram Atelier"
                className="w-10 h-10 rounded-full border border-[var(--border-subtle)] hover:border-[#D6B77A] flex items-center justify-center text-[var(--text-primary)] hover:text-[#D6B77A] transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://vogue.com"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-full border border-[var(--border-subtle)] hover:border-[#D6B77A] flex items-center space-x-1.5 text-xs text-[var(--text-primary)] hover:text-[#D6B77A] transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="font-mono text-[10px]">Vogue Guild</span>
              </a>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7 bg-[var(--bg-card)] border border-[var(--border-color)] p-8 sm:p-12 rounded-xl shadow-xl relative">
            <h3 className="font-serif text-2xl text-[var(--text-primary)] mb-6">
              Send an Atelier Inquiry
            </h3>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center space-y-4 bg-[var(--bg-secondary)] rounded-xl border border-[#D6B77A]/40"
              >
                <CheckCircle2 className="w-12 h-12 text-[#D6B77A] mx-auto" />
                <h4 className="font-serif text-2xl text-white">Message Transmitted</h4>
                <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
                  Thank you for your correspondence. A creative director will review your inquiry and reply within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 px-6 py-2 text-xs tracking-widest uppercase font-medium rounded border border-[#D6B77A]/40 text-[#D6B77A] hover:bg-[#D6B77A]/10 transition-colors"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="text"
                  name="honeypot"
                  value={contactData.honeypot}
                  onChange={handleChange}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {error && (
                  <div className="p-4 rounded bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-medium">
                      Your Name <span className="text-[#D6B77A]">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={contactData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Charlotte Dupont"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[#D6B77A] focus:outline-none text-[var(--text-primary)] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-medium">
                      Email Address <span className="text-[#D6B77A]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={contactData.email}
                      onChange={handleChange}
                      placeholder="e.g. charlotte@domain.com"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[#D6B77A] focus:outline-none text-[var(--text-primary)] text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-medium">
                      Telephone (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={contactData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +33 6 12 34 56 78"
                      className="w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[#D6B77A] focus:outline-none text-[var(--text-primary)] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-medium">
                      Inquiry Subject <span className="text-[#D6B77A]">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={contactData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Press kit / Editorial Commission"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[#D6B77A] focus:outline-none text-[var(--text-primary)] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-medium">
                    Message Details <span className="text-[#D6B77A]">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={contactData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Provide details about dates, venue, publication, or specific requirements..."
                    required
                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[#D6B77A] focus:outline-none text-[var(--text-primary)] text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 text-xs tracking-[0.25em] uppercase font-bold text-[#090909] bg-gradient-to-r from-[#ECC880] to-[#D6B77A] rounded hover:shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Submit Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Embedded Luxury Map Stylized Card */}
        <div className="mt-20 rounded-2xl overflow-hidden border border-[var(--border-color)] bg-[#111111] p-2 shadow-2xl">
          <div className="relative w-full h-80 rounded-xl overflow-hidden">
            <iframe
              title="Lumiere Studio Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.986877484439!2d-73.96695282343949!3d40.76757623453303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258ec2d829dc7%3A0x6436e84d4fa712cf!2s740%20Madison%20Ave%2C%20New%20York%2C%20NY%2010065!5e0!3m2!1sen!2sus!4v1714400000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(110%)" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Map Overlay Badge */}
            <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg border border-[#D6B77A]/40 text-xs text-white">
              <span className="text-[#D6B77A] font-semibold">Madison Avenue Atelier</span> · Manhattan, New York
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

