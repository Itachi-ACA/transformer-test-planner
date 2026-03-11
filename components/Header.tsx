"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Header() {

  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/10"
      style={{
        background:
          "linear-gradient(180deg, rgba(10,14,26,0.95) 0%, rgba(10,14,26,0.7) 100%)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-center gap-4">
        <Image
          src="/logo.svg"
          alt="Indo Tech"
          width={140}
          height={40}
          priority
          className="drop-shadow-[0_0_8px_rgba(212,35,40,0.5)]"
        />
      </div>
      <div className="text-center flex-1">
        <h1 className="text-2xl font-bold tracking-wider bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
          TEST SCHEDULE
        </h1>
        <p className="text-[11px] text-slate-400 tracking-[0.3em] uppercase mt-0.5">
          Transformer Testing Planning System
        </p>
      </div>
      <div className="w-[140px]"></div>
    </motion.header>
  );
}
