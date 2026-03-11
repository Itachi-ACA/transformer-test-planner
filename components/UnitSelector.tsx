"use client";

import { useAppState } from "@/lib/store";
import { motion } from "framer-motion";
import GlassPanel from "./GlassPanel";

export default function UnitSelector() {
  const { units, addUnit, removeUnit } = useAppState();

  return (
    <GlassPanel className="p-5" delay={0.15}>
      <h2 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_6px_rgba(255,107,53,0.8)]" />
        Transformer Units
      </h2>
      <div className="flex flex-wrap gap-2">
        {units.map((unit) => (
          <div
            key={unit}
            className="flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-900/40 text-slate-200 border border-white/5 backdrop-blur-md group pr-10 relative shadow-inner"
          >
            <span className="text-orange-400 mr-1.5">⬡</span>
            {unit}
            {units.length > 1 && (
              <button
                onClick={() => removeUnit(unit)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer text-xs"
                title={`Remove ${unit}`}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addUnit}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-orange-500/10 text-orange-400 border border-orange-400/30 hover:bg-orange-500/20 hover:border-orange-400/50 hover:shadow-[0_0_15px_rgba(249,115,22,0.2)] backdrop-blur-md transition-all duration-300 cursor-pointer"
        >
          + Add Unit
        </motion.button>
      </div>
    </GlassPanel>
  );
}
