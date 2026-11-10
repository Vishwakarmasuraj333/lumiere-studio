"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  ShieldCheck,
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";

interface BookingSectionProps {
  preselectedService?: string;
}

const SERVICE_OPTIONS = [
  "Wedding Haute Couture",
  "Fashion & Editorial",
  "Fine-Art Personal Portraits",
  "Commercial & Luxury Goods",
  "Pre-Wedding Cinematic",
  "Gala & VIP Events",
  "Private Destination Monograph",
];

export default function BookingSection({ preselectedService }: BookingSectionProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    service: preselectedService || "Wedding Haute Couture",
    preferredDate: "",
    location: "",
    guestCount: "",
    message: "",
    honeypot: "", // Bot trap
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successBooking, setSuccessBooking] = useState<{
    reference: string;
    fullName: string;
    service: string;
    preferredDate: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const [prevSelected, setPrevSelected] = useState(preselectedService);
  if (preselectedService && preselectedService !== prevSelected) {
    setPrevSelected(preselectedService);
    setFormData((prev) => ({ ...prev, service: preselectedService }));
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic frontend validations
    if (!formData.fullName.trim()) {
      setErrorMessage("Please provide your full name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("Please provide a phone number for our concierge team.");
      return;
    }
    if (!formData.preferredDate) {
      setErrorMessage("Please select your preferred session date.");
      return;
    }
    if (!formData.location.trim()) {
      setErrorMessage("Please specify the anticipated destination or venue location.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to submit appointment request.");
      }

      setSuccessBooking({
        reference: data.booking.reference,
        fullName: data.booking.fullName,
        service: data.booking.service,
        preferredDate: data.booking.preferredDate,
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        service: "Wedding Haute Couture",
        preferredDate: "",
        location: "",
        guestCount: "",
        message: "",
        honeypot: "",
      });
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const copyReference = () => {
    if (successBooking) {
      navigator.clipboard.writeText(successBooking.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section id="booking" className="py-28 md:py-36 bg-[var(--bg-primary)] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#D6B77A] font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Consultations</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[var(--text-primary)] tracking-tight">
            COMMISSION YOUR SESSION
          </h2>
          <p className="mt-4 text-[var(--text-secondary)] text-sm sm:text-base font-light max-w-xl mx-auto">
            Due to our uncompromising dedication to medium-format mastery, we accept a strictly limited number of international commissions each season.
          </p>
          <div className="w-16 h-[1.5px] bg-[#D6B77A] mx-auto mt-6" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Studio Promise & Concierge Note */}
          <div className="lg:col-span-5 space-y-8 bg-[var(--bg-card)] border border-[var(--border-color)] p-8 sm:p-10 rounded-2xl shadow-xl">
            <h3 className="font-serif text-2xl text-[var(--text-primary)]">
              The Lumière Concierge Experience
            </h3>

            <div className="space-y-6 text-sm text-[var(--text-secondary)]">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full border border-[#D6B77A]/40 flex items-center justify-center flex-shrink-0 bg-[#D6B77A]/10 text-[#D6B77A]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-medium text-[var(--text-primary)]">
                    24-Hour Confidential Response
                  </h4>
                  <p className="text-xs font-light mt-1">
                    Our lead studio producer will personally review your itinerary and reply with date availability within one business day.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full border border-[#D6B77A]/40 flex items-center justify-center flex-shrink-0 bg-[#D6B77A]/10 text-[#D6B77A]">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-medium text-[var(--text-primary)]">
                    Creative Brief & Visual Moodboard
                  </h4>
                  <p className="text-xs font-light mt-1">
                    Before any shutter is pressed, Julian Vance and our styling team compose a bespoke lighting and wardrobe storyboard.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full border border-[#D6B77A]/40 flex items-center justify-center flex-shrink-0 bg-[#D6B77A]/10 text-[#D6B77A]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-medium text-[var(--text-primary)]">
                    Full Archival Guarantee & Discretion
                  </h4>
                  <p className="text-xs font-light mt-1">
                    Complete NDA protection upon request. Permanent dual-redundant vault storage for your lifetime monograph files.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Studio Numbers */}
            <div className="pt-6 border-t border-[var(--border-subtle)] text-xs font-mono space-y-1 text-[#A7A29A]">
              <p>Direct Concierge: +1 (212) 847-9200</p>
              <p>Paris Line: +33 1 42 68 55 00</p>
              <p className="text-[#D6B77A]">concierge@lumiere-studio.com</p>
            </div>
          </div>

          {/* Right Column: Interactive Real Booking Form */}
          <div className="lg:col-span-7 bg-[var(--bg-card)] border border-[var(--border-color)] p-8 sm:p-12 rounded-2xl shadow-2xl relative">
            {/* Success Modal / State */}
            <AnimatePresence>
              {successBooking && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[var(--bg-card)] rounded-2xl z-20 p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6"
                >
                  <div className="w-16 h-16 rounded-full bg-[#D6B77A]/20 border border-[#D6B77A] flex items-center justify-center text-[#D6B77A]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs tracking-[0.25em] uppercase text-[#D6B77A] font-mono">
                      Booking Request Received
                    </span>
                    <h3 className="font-serif text-3xl text-[var(--text-primary)]">
                      Thank You, {successBooking.fullName}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto font-light">
                      Your appointment request for{" "}
                      <strong className="text-[var(--text-primary)] font-medium">{successBooking.service}</strong> on{" "}
                      <span className="text-[#D6B77A]">{successBooking.preferredDate}</span> has been logged into our studio system.
                    </p>
                  </div>

                  {/* Reference Code Card */}
                  <div className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[#D6B77A]/40 flex items-center space-x-3 font-mono text-sm">
                    <span className="text-white/60">Reference:</span>
                    <span className="font-bold text-[#D6B77A]">{successBooking.reference}</span>
                    <button
                      onClick={copyReference}
                      className="p-1.5 rounded hover:bg-white/10 text-[#D6B77A] transition-colors"
                      title="Copy Reference"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] max-w-sm">
                    Our lead producer will contact you within 24 hours to coordinate your moodboard and contract details.
                  </p>

                  <button
                    onClick={() => setSuccessBooking(null)}
                    className="px-6 py-2.5 text-xs tracking-widest uppercase font-medium rounded border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[#D6B77A] hover:text-[#D6B77A] transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-lg bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center space-x-3">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bot Honeypot hidden input */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Row 1: Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium mb-2">
                    Full Name <span className="text-[#D6B77A]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Lady Genevieve Vance"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[#D6B77A] focus:outline-none text-[var(--text-primary)] text-sm transition-colors"
                    />
                    <User className="w-4 h-4 text-[#D6B77A] absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium mb-2">
                    Email Address <span className="text-[#D6B77A]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. genevieve@vance.com"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[#D6B77A] focus:outline-none text-[var(--text-primary)] text-sm transition-colors"
                    />
                    <Mail className="w-4 h-4 text-[#D6B77A] absolute left-3.5 top-3.5" />
                  </div>
                </div>
              </div>

              {/* Row 2: Phone & Service */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium mb-2">
                    Telephone Number <span className="text-[#D6B77A]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +1 (212) 555-0198"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[#D6B77A] focus:outline-none text-[var(--text-primary)] text-sm transition-colors"
                    />
                    <Phone className="w-4 h-4 text-[#D6B77A] absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium mb-2">
                    Photography Service <span className="text-[#D6B77A]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[#D6B77A] focus:outline-none text-[var(--text-primary)] text-sm appearance-none transition-colors cursor-pointer"
                    >
                      {SERVICE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#1c1c1c] text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                    <Camera className="w-4 h-4 text-[#D6B77A] absolute left-3.5 top-3.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 3: Preferred Date & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium mb-2">
                    Preferred Date <span className="text-[#D6B77A]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[#D6B77A] focus:outline-none text-[var(--text-primary)] text-sm transition-colors"
                    />
                    <Calendar className="w-4 h-4 text-[#D6B77A] absolute left-3.5 top-3.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium mb-2">
                    Destination / Venue <span className="text-[#D6B77A]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Villa d'Este, Lake Como or Paris"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[#D6B77A] focus:outline-none text-[var(--text-primary)] text-sm transition-colors"
                    />
                    <MapPin className="w-4 h-4 text-[#D6B77A] absolute left-3.5 top-3.5" />
                  </div>
                </div>
              </div>

              {/* Guest Count / Scope */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium mb-2">
                  Estimated Scope / Guests (Optional)
                </label>
                <input
                  type="text"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleChange}
                  placeholder="e.g. Intimate gathering of 80 guests, or Solo Atelier session"
                  className="w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[#D6B77A] focus:outline-none text-[var(--text-primary)] text-sm transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium mb-2">
                  Vision, Aesthetic Notes & Specific Requests
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about the atmosphere, attire, lighting preferences, or questions you have for Julian..."
                  className="w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[#D6B77A] focus:outline-none text-[var(--text-primary)] text-sm transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-xs tracking-[0.25em] uppercase font-bold text-[#090909] bg-gradient-to-r from-[#ECC880] via-[#D6B77A] to-[#C5A25D] hover:shadow-[0_0_25px_rgba(214,183,122,0.4)] rounded-lg transition-all flex items-center justify-center space-x-3 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Transmit Appointment Request</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

