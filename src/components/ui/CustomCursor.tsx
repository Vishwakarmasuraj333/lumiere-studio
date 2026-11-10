"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Smooth springs for cursor dot and ring
  const mouseX = useSpring(0, { stiffness: 600, damping: 40 });
  const mouseY = useSpring(0, { stiffness: 600, damping: 40 });
  const ringX = useSpring(0, { stiffness: 220, damping: 28 });
  const ringY = useSpring(0, { stiffness: 220, damping: 28 });

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    
    if (!hasFinePointer || isReduced) {
      return;
    }

    const timer = setTimeout(() => {
      setEnabled(true);
    }, 0);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const checkHoverable = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive =
        target.closest("button") ||
        target.closest("a") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("select") ||
        target.closest("[data-cursor='pointer']") ||
        target.getAttribute("role") === "button";

      setIsHovered(!!isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousemove", checkHoverable);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", checkHoverable);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, ringX, ringY]);

  if (!enabled || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block">
      {/* Central pinpoint gold dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#D6B77A] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{
          x: mouseX,
          y: mouseY,
          scale: isClicking ? 0.6 : isHovered ? 1.5 : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Trailing golden halo ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-[#D6B77A]/50 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200"
        style={{
          x: ringX,
          y: ringY,
          width: isHovered ? 56 : 34,
          height: isHovered ? 56 : 34,
          backgroundColor: isHovered ? "rgba(214, 183, 122, 0.12)" : "transparent",
          borderColor: isHovered ? "rgba(214, 183, 122, 0.85)" : "rgba(214, 183, 122, 0.35)",
          scale: isClicking ? 0.85 : 1,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
      />
    </div>
  );
}
