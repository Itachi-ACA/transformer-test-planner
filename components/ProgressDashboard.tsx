"use client";

import { useAppState } from "@/lib/store";
import { motion } from "framer-motion";
import GlassPanel from "./GlassPanel";

export default function ProgressDashboard() {
  const { schedule } = useAppState();

  const total = schedule.length;
  const pending = schedule.filter((e) => e.status === "Pending").length;
  const inProgress = schedule.filter((e) => e.status === "In Progress").length;
  const completed = schedule.filter((e) => e.status === "Completed").length;
  const failed = schedule.filter((e) => e.status === "Failed").length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    {
      label: "Total Tests",
      value: total,
      color: "from-cyan-400 to-blue-500",
      glow: "rgba(0,180,255,0.3)",
    },
    {
      label: "Pending",
      value: pending,
      color: "from-slate-400 to-slate-500",
      glow: "rgba(148,163,184,0.3)",
    },
    {
      label: "In Progress",
      value: inProgress,
      color: "from-orange-400 to-amber-500",
      glow: "rgba(245,158,11,0.3)",
    },
    {
      label: "Completed",
      value: completed,
      color: "from-emerald-400 to-green-500",
      glow: "rgba(52,211,153,0.3)",
    },
    {
      label: "Failed",
      value: failed,
      color: "from-red-400 to-rose-500",
      glow: "rgba(239,68,68,0.3)",
    },
  ];

  return (
    <GlassPanel className="p-5" delay={0.3}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.8)]" />
          Progress Dashboard
        </h2>
        {total > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"
              />
            </div>
            <span className="text-xs text-emerald-400 font-medium">
              {completionRate}%
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-xl border border-white/10 p-4 text-center"
            style={{
              background: "rgba(255,255,255,0.02)",
              boxShadow: stat.value > 0 ? `0 0 15px ${stat.glow}` : "none",
            }}
          >
            <div
              className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
            >
              {stat.value}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </GlassPanel>
  );
}
