"use client";

import { useState } from "react";
import { useAppState } from "@/lib/store";
import { TEST_NAMES, TEST_TYPES, SHIFTS, type Shift, type TestType } from "@/data/testNames";
import { motion, AnimatePresence } from "framer-motion";
import GlassPanel from "./GlassPanel";

export default function TestList() {
  const { days, selectedDay, units, testNames, addTestName, removeTestName, renameTestName, addScheduleEntry } = useAppState();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customTestName, setCustomTestName] = useState("");
  const [popup, setPopup] = useState<{ testName: string } | null>(null);
  const [selectedShift, setSelectedShift] = useState<Shift>("Day Test");
  // Multi-select for days
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  // Multi-select: array of selected unit names
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [selectedTestType, setSelectedTestType] = useState<TestType>("Routine Test");
  // Rename state
  const [editingTest, setEditingTest] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const filtered = testNames.filter((t) =>
    t.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCustomTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTestName.trim()) {
      addTestName(customTestName.trim());
      setCustomTestName("");
      setIsAddingCustom(false);
    }
  };

  const openPopup = (testName: string) => {
    setSelectedShift("Day Test");
    setSelectedDays([selectedDay]);
    setSelectedUnits(units.length > 0 ? [units[0]] : []);
    setSelectedTestType("Routine Test");
    setPopup({ testName });
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleUnit = (unit: string) => {
    setSelectedUnits((prev) =>
      prev.includes(unit) ? prev.filter((u) => u !== unit) : [...prev, unit]
    );
  };

  const handleAdd = () => {
    if (!popup || selectedUnits.length === 0 || selectedDays.length === 0) return;
    
    // Create one schedule entry per selected day AND per selected unit
    selectedDays.forEach((dayLabel) => {
      selectedUnits.forEach((unitName) => {
        addScheduleEntry({
          dayLabel,
          testName: popup.testName,
          shift: selectedShift,
          unitName,
          testType: selectedTestType,
          status: "Pending",
        });
      });
    });
    setPopup(null);
  };

  const canAdd = selectedUnits.length > 0 && selectedDays.length > 0;
  const totalEntries = selectedUnits.length * selectedDays.length;

  const startEditing = (testName: string) => {
    setEditingTest(testName);
    setEditValue(testName);
  };

  const commitRename = () => {
    if (editingTest && editValue.trim()) {
      renameTestName(editingTest, editValue.trim());
    }
    setEditingTest(null);
    setEditValue("");
  };

  return (
    <>
      <GlassPanel className="p-5 flex flex-col" delay={0.2}>
        <h2 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          Test Library
          <span className="ml-auto text-xs text-slate-500 font-normal">
            {filtered.length} tests
          </span>
        </h2>

        {/* Search & Add */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all shadow-inner"
            />
          </div>
          <button
            onClick={() => setIsAddingCustom(!isAddingCustom)}
            className="px-5 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-400/30 hover:bg-emerald-500/20 hover:border-emerald-400/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] backdrop-blur-md transition-all font-semibold"
            title="Add new custom test"
          >
            + New
          </button>
        </div>

        {/* Add custom test form */}
        <AnimatePresence>
          {isAddingCustom && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddCustomTest}
              className="flex gap-2 mb-3 overflow-hidden"
            >
              <input
                type="text"
                value={customTestName}
                onChange={(e) => setCustomTestName(e.target.value)}
                placeholder="Enter test name..."
                className="flex-1 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/30 transition-all shadow-inner"
                autoFocus
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/30 transition-all text-sm font-semibold shadow-[0_0_10px_rgba(16,185,129,0.1)]"
              >
                Add
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Scheduling context */}
        <div className="flex items-center gap-2 mb-3 text-xs">
          <span className="text-slate-500">Scheduling to:</span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-400/20">
            {selectedDay}
          </span>
        </div>

        {/* Test list */}
        <div className="flex-1 overflow-y-auto max-h-[420px] pr-1 space-y-1">
          {filtered.map((testName, idx) => (
            <motion.div
              key={testName}
              whileHover={{ x: 4 }}
              className="relative group"
            >
              {editingTest === testName ? (
                /* Inline rename editor */
                <div className="flex items-center gap-2 px-3 py-2">
                  <span className="text-cyan-500/60 text-xs font-mono min-w-[20px]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitRename();
                      if (e.key === "Escape") { setEditingTest(null); setEditValue(""); }
                    }}
                    onBlur={commitRename}
                    autoFocus
                    className="flex-1 bg-slate-800/60 border border-cyan-400/40 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-400/30"
                  />
                  <button
                    onClick={commitRename}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-semibold hover:bg-cyan-500/30 transition-colors cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => openPopup(testName)}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10 transition-all duration-200 cursor-pointer pr-20"
                  >
                    <span className="text-cyan-500/60 group-hover:text-cyan-400 mr-2 text-xs font-mono">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    {testName}
                  </button>

                  {/* Edit (pencil) button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(testName);
                    }}
                    className="absolute right-10 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-cyan-500/20 hover:scale-110 cursor-pointer"
                    title="Rename Test"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTestName(testName);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20 hover:scale-110 cursor-pointer"
                    title="Remove Test"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </>
              )}
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-6 text-slate-500 text-sm">
              No tests found. Click "+ New" to add one.
            </div>
          )}
        </div>
      </GlassPanel>

      {/* Scheduling Popup */}
      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={() => setPopup(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/10 p-6 max-h-[90vh] overflow-y-auto"
              style={{
                background:
                  "linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(10,14,26,0.99) 100%)",
                boxShadow:
                  "0 0 40px rgba(0,180,255,0.15), 0 20px 60px rgba(0,0,0,0.5)",
              }}
            >
              <h3 className="text-lg font-semibold text-white mb-1">
                Schedule Test
              </h3>
              <p className="text-sm text-cyan-400/80 mb-5 leading-relaxed">
                {popup.testName}
              </p>

              {/* Day info (Multi-select) */}
              <div className="mb-4">
                <label className="block text-[11px] uppercase tracking-[0.15em] text-cyan-400 mb-1">
                  Select Day(s)
                </label>
                <p className="text-[10px] text-cyan-500/70 mb-2">
                  Select multiple days if the test spans across them
                </p>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1 scrollbar-thin">
                  {days.map((d) => {
                    const isSelected = selectedDays.includes(d);
                    return (
                      <button
                        key={d}
                        onClick={() => toggleDay(d)}
                        className={`relative px-3 py-1.5 rounded-md text-[13px] font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_8px_rgba(0,180,255,0.2)]"
                            : "bg-white/5 text-slate-400 border border-white/10 hover:border-white/20 hover:text-slate-300"
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-500 text-white text-[8px] flex items-center justify-center font-bold">
                            ✓
                          </span>
                        )}
                        {d}
                      </button>
                    );
                  })}
                </div>
                {selectedDays.length === 0 && (
                  <p className="text-[10px] text-red-400/70 mt-1.5">
                    Please select at least one day
                  </p>
                )}
              </div>

              {/* Shift */}
              <div className="mb-4">
                <label className="block text-[11px] uppercase tracking-[0.15em] text-slate-400 mb-2">
                  Select Shift
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SHIFTS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedShift(s)}
                      className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        selectedShift === s
                          ? s === "Day Test"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                            : "bg-indigo-500/20 text-indigo-300 border border-indigo-400/50 shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                          : "bg-white/5 text-slate-400 border border-white/10 hover:border-white/20"
                      }`}
                    >
                      {s === "Day Test" ? "☀️" : "🌙"} {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Unit — multi-select */}
              <div className="mb-4">
                <label className="block text-[11px] uppercase tracking-[0.15em] text-slate-400 mb-1">
                  Select Unit(s)
                </label>
                <p className="text-[10px] text-slate-600 mb-2">
                  Select one or more units — a separate entry will be created for each
                </p>
                <div className="flex flex-wrap gap-2">
                  {units.map((u) => {
                    const isSelected = selectedUnits.includes(u);
                    return (
                      <button
                        key={u}
                        onClick={() => toggleUnit(u)}
                        className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-orange-500/20 text-orange-300 border border-orange-400/50 shadow-[0_0_10px_rgba(255,107,53,0.2)]"
                            : "bg-white/5 text-slate-400 border border-white/10 hover:border-white/20 hover:text-slate-300"
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] flex items-center justify-center font-bold">
                            ✓
                          </span>
                        )}
                        {u}
                      </button>
                    );
                  })}
                </div>
                {selectedUnits.length > 1 && (
                  <p className="text-[10px] text-orange-400/70 mt-1.5">
                    ⚡ Will add {selectedUnits.length} entries: {selectedUnits.join(", ")}
                  </p>
                )}
                {selectedUnits.length === 0 && (
                  <p className="text-[10px] text-red-400/70 mt-1.5">
                    Please select at least one unit
                  </p>
                )}
              </div>

              {/* Test Type */}
              <div className="mb-6">
                <label className="block text-[11px] uppercase tracking-[0.15em] text-slate-400 mb-2">
                  Test Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TEST_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTestType(t)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        selectedTestType === t
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-[0_0_10px_rgba(52,211,153,0.2)]"
                          : "bg-white/5 text-slate-400 border border-white/10 hover:border-white/20"
                      }`}
                    >
                      {t.replace(" Test", "")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setPopup(null)}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!canAdd}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                    canAdd
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/40 hover:bg-cyan-500/30 hover:shadow-[0_0_15px_rgba(0,180,255,0.3)]"
                      : "bg-white/5 text-slate-600 border-white/5 cursor-not-allowed"
                  }`}
                >
                  ✓ Add to Schedule
                  {totalEntries > 1 && ` (×${totalEntries})`}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
