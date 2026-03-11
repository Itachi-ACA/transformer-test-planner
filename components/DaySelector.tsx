"use client";

import { useAppState } from "@/lib/store";
import { motion } from "framer-motion";
import GlassPanel from "./GlassPanel";

export default function DaySelector() {
  const { days, addDay, removeDay, selectedDay, setSelectedDay } = useAppState();

  const handleRemove = (e: React.MouseEvent, day: string) => {
    e.stopPropagation();
    removeDay(day);
    if (selectedDay === day) {
      // If we remove the selected day, select the first available day or nothing
      const remaining = days.filter((d) => d !== day);
      setSelectedDay(remaining.length > 0 ? remaining[0] : "");
    }
  };

  return (
    <GlassPanel className="p-5" delay={0.1}>
      <h2 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,180,255,0.8)]" />
        Testing Days
      </h2>
      <div className="flex flex-wrap gap-2">
        {days.map((day) => {
          const isSelected = day === selectedDay;
          return (
            <motion.div
              key={day}
              className="relative group"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDay(day)}
                className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer pr-10 backdrop-blur-md ${
                  isSelected
                    ? "bg-cyan-500/20 text-cyan-100 border border-cyan-400/40 shadow-[0_0_20px_rgba(0,180,255,0.2)]"
                    : "bg-slate-900/40 text-slate-400 border border-white/5 hover:border-white/20 hover:text-white"
                }`}
              >
                {day}
                {isSelected && (
                  <motion.div
                    layoutId="dayGlow"
                    className="absolute inset-0 rounded-lg border border-cyan-400/30"
                    style={{
                      boxShadow: "0 0 15px rgba(0,180,255,0.2)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
              
              {days.length > 1 && (
                <button
                  onClick={(e) => handleRemove(e, day)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer z-10 text-xs"
                  title={`Remove ${day}`}
                >
                  ✕
                </button>
              )}
            </motion.div>
          );
        })}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addDay}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-orange-500/10 text-orange-400 border border-orange-400/30 hover:bg-orange-500/20 hover:border-orange-400/50 hover:shadow-[0_0_15px_rgba(249,115,22,0.2)] backdrop-blur-md transition-all duration-300 cursor-pointer"
        >
          + Add Day
        </motion.button>
      </div>
    </GlassPanel>
  );
}
