"use client";

import { useAppState } from "@/lib/store";
import { STATUSES, type Status } from "@/data/testNames";
import { motion, AnimatePresence } from "framer-motion";
import GlassPanel from "./GlassPanel";

const STATUS_STYLES: Record<Status, { bg: string; text: string; border: string; glow: string }> = {
  Pending: {
    bg: "bg-slate-500/15",
    text: "text-slate-400",
    border: "border-slate-400/30",
    glow: "",
  },
  "In Progress": {
    bg: "bg-orange-500/15",
    text: "text-orange-400",
    border: "border-orange-400/40",
    glow: "shadow-[0_0_8px_rgba(245,158,11,0.2)]",
  },
  Completed: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    border: "border-emerald-400/40",
    glow: "shadow-[0_0_8px_rgba(52,211,153,0.2)]",
  },
  Failed: {
    bg: "bg-red-500/15",
    text: "text-red-400",
    border: "border-red-400/40",
    glow: "shadow-[0_0_8px_rgba(239,68,68,0.2)]",
  },
};

export default function ScheduleTable() {
  const { schedule, updateStatus, deleteEntry, clearSchedule, selectedDay } = useAppState();

  const daySchedule = schedule.filter((e) => e.dayLabel === selectedDay);
  const allSchedule = schedule;

  return (
    <GlassPanel className="p-5" delay={0.25}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
          Schedule Board
        </h2>
        <div className="flex items-center gap-3 text-xs">
          {allSchedule.length > 0 && (
            <button
              onClick={clearSchedule}
              className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-400/20 hover:bg-red-500/20 hover:border-red-400/40 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 font-semibold"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Schedule
            </button>
          )}
          <span className="px-2 py-1.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-400/20">
            {selectedDay}: {daySchedule.length} tests
          </span>
          <span className="text-slate-500 px-2 py-1.5">
            Total: {allSchedule.length} tests
          </span>
        </div>
      </div>

      {allSchedule.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <div className="text-4xl mb-3 opacity-30">📋</div>
          <p className="text-sm">No tests scheduled yet</p>
          <p className="text-xs text-slate-600 mt-1">
            Select a day and click a test from the library to begin
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-3 text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                  Day
                </th>
                <th className="text-left py-3 px-3 text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                  Test Name
                </th>
                <th className="text-left py-3 px-3 text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                  Shift
                </th>
                <th className="text-left py-3 px-3 text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                  Unit
                </th>
                <th className="text-left py-3 px-3 text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                  Test Type
                </th>
                <th className="text-left py-3 px-3 text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                  Status
                </th>
                <th className="text-center py-3 px-3 text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {allSchedule.map((entry) => {
                  const style = STATUS_STYLES[entry.status];
                  return (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                        entry.dayLabel === selectedDay ? "" : "opacity-60"
                      }`}
                    >
                      <td className="py-3 px-3">
                        <span className="text-cyan-400 text-xs font-medium">
                          {entry.dayLabel}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300 max-w-xs">
                        {entry.testName}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            entry.shift === "Day Test"
                              ? "bg-amber-500/10 text-amber-400"
                              : "bg-indigo-500/10 text-indigo-400"
                          }`}
                        >
                          {entry.shift === "Day Test" ? "☀️ DAY" : "🌙 NIGHT"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-orange-400 text-xs font-medium">
                        {entry.unitName}
                      </td>
                      <td className="py-3 px-3 text-xs text-slate-400">
                        {entry.testType}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {STATUSES.map((s) => {
                            const st = STATUS_STYLES[s];
                            const isActive = entry.status === s;
                            return (
                              <button
                                key={s}
                                onClick={() => updateStatus(entry.id, s)}
                                className={`px-2 py-1 rounded text-[10px] font-medium border transition-all cursor-pointer ${
                                  isActive
                                    ? `${st.bg} ${st.text} ${st.border} ${st.glow}`
                                    : "bg-transparent text-slate-600 border-transparent hover:text-slate-400"
                                }`}
                              >
                                {s}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="text-red-500/50 hover:text-red-400 transition-colors cursor-pointer text-xs"
                          title="Delete"
                        >
                          ✕
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </GlassPanel>
  );
}
