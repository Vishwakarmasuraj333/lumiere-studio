"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, Lock, Mail, ArrowRight, Shield, AlertCircle, Key, Info } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDevCredentials, setShowDevCredentials] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyInitialCredentials = () => {
    setEmail("admin@lumiere.com");
    setPassword("admin123");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#D6B77A]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10">
        <Link href="/" className="inline-flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-full border border-[#D6B77A]/60 flex items-center justify-center bg-[#D6B77A]/10 group-hover:rotate-45 transition-transform duration-500">
            <Camera className="w-5 h-5 text-[#D6B77A]" />
          </div>
          <div className="text-left">
            <span className="font-serif text-2xl tracking-[0.2em] font-medium text-white block">
              LUMIÈRE STUDIO
            </span>
            <span className="text-[9px] tracking-[0.35em] text-[#D6B77A] uppercase -mt-1 block font-mono">
              Administrative Atelier
            </span>
          </div>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#141414] border border-[#D6B77A]/30 rounded-2xl p-8 sm:p-10 shadow-2xl relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl text-white">Staff Authentication</h2>
            <p className="text-xs text-[#A7A29A] mt-1 font-light">
              Enter verified studio director credentials to access the management portal.
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#D6B77A]/10 border border-[#D6B77A]/30 flex items-center justify-center text-[#D6B77A] flex-shrink-0">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center space-x-3">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#A7A29A] font-mono mb-2">
              Studio Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="director@lumiere-studio.com"
                required
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#0d0d0d] border border-white/10 focus:border-[#D6B77A] focus:outline-none text-sm text-white font-mono transition-colors"
              />
              <Mail className="w-4 h-4 text-[#D6B77A] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#A7A29A] font-mono mb-2">
              Secret Passphrase
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#0d0d0d] border border-white/10 focus:border-[#D6B77A] focus:outline-none text-sm text-white transition-colors"
              />
              <Lock className="w-4 h-4 text-[#D6B77A] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-xs tracking-[0.25em] uppercase font-bold text-[#090909] bg-gradient-to-r from-[#ECC880] to-[#D6B77A] rounded-lg hover:shadow-[0_0_20px_rgba(214,183,122,0.4)] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Enter Admin Suite</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Secure Environment Helper Accordion */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => setShowDevCredentials(!showDevCredentials)}
            className="w-full flex items-center justify-between text-[11px] text-[#A7A29A] hover:text-[#D6B77A] transition-colors"
          >
            <span className="flex items-center space-x-1.5 font-mono">
              <Info className="w-3.5 h-3.5" />
              <span>Initial Setup & Seeding Info</span>
            </span>
            <span>{showDevCredentials ? "▲" : "▼"}</span>
          </button>

          {showDevCredentials && (
            <div className="mt-3 p-3 rounded bg-[#0d0d0d] border border-white/10 text-[11px] text-[#A7A29A] space-y-2">
              <p>
                Default seeded account: <span className="font-mono text-white">admin@lumiere.com</span>
              </p>
              <p className="text-[10px] text-amber-300">
                ⚠ Note: Password changes can be performed directly inside the Admin Suite Settings tab.
              </p>
              <button
                type="button"
                onClick={handleApplyInitialCredentials}
                className="text-xs text-[#D6B77A] hover:underline flex items-center space-x-1 font-mono pt-1"
              >
                <Key className="w-3 h-3" />
                <span>Fill Initial Setup Credentials</span>
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-[#A7A29A] hover:text-[#D6B77A] transition-colors"
          >
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
