"use client";

import { motion } from "framer-motion";
import React from "react";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  glowColor?: string;
}

export default function GlassPanel({
  children,
  className = "",
  delay = 0,
  glowColor = "rgba(0,180,255,0.15)",
}: GlassPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={`relative rounded-3xl border border-white/5 backdrop-blur-2xl ${className}`}
      style={{
        background:
          "linear-gradient(135deg, rgba(15,23,42,0.4) 0%, rgba(10,14,26,0.6) 100%)",
        boxShadow: `0 0 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(255,255,255,0.02)`,
      }}
    >
      {children}
    </motion.div>
  );
}
