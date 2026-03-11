"use client";

import { useState } from "react";
import { useAppState } from "@/lib/store";
import { COOLING_TYPES } from "@/data/testNames";
import GlassPanel from "./GlassPanel";

export default function JobInfoForm() {
  const { jobInfo, setJobInfo } = useAppState();
  const [customCooling, setCustomCooling] = useState("");
  const [isCustomCooling, setIsCustomCooling] = useState(false);

  const handleChange = (field: string, value: string) => {
    setJobInfo({ ...jobInfo, [field]: value });
  };

  const inputClass =
    "w-full bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all duration-300 shadow-inner";
  const labelClass = "block text-[10px] uppercase tracking-widest text-cyan-200/60 mb-2 font-semibold";

  return (
    <GlassPanel className="p-6" glowColor="rgba(0,180,255,0.1)">
      <h2 className="text-lg font-semibold text-cyan-300 mb-5 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,180,255,0.8)]" />
        Job Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Work Order Number</label>
          <input
            type="text"
            value={jobInfo.workOrderNumber}
            onChange={(e) => handleChange("workOrderNumber", e.target.value)}
            placeholder="e.g. 6299"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Customer Name</label>
          <input
            type="text"
            value={jobInfo.customerName}
            onChange={(e) => handleChange("customerName", e.target.value)}
            placeholder="e.g. S. Amplus Sunbeat Pvt Ltd"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Transformer Rating</label>
          <input
            type="text"
            value={jobInfo.transformerRating}
            onChange={(e) => handleChange("transformerRating", e.target.value)}
            placeholder="e.g. 72/90 MVA"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Voltage Level</label>
          <input
            type="text"
            value={jobInfo.voltageLevel}
            onChange={(e) => handleChange("voltageLevel", e.target.value)}
            placeholder="e.g. 230/33 Kv"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Cooling Type</label>
          <div className="flex gap-2">
            {!isCustomCooling ? (
              <select
                value={jobInfo.coolingType}
                onChange={(e) => {
                  if (e.target.value === "CUSTOM") {
                    setIsCustomCooling(true);
                    setJobInfo({ ...jobInfo, coolingType: "" });
                  } else {
                    handleChange("coolingType", e.target.value);
                  }
                }}
                className={inputClass + " cursor-pointer flex-1"}
              >
                {COOLING_TYPES.map((ct) => (
                  <option key={ct} value={ct} className="bg-slate-900 text-white">
                    {ct}
                  </option>
                ))}
                <option value="CUSTOM" className="bg-slate-800 text-cyan-400 font-medium">
                  + Add Custom...
                </option>
              </select>
            ) : (
              <div className="flex gap-2 flex-1 relative">
                <input
                  type="text"
                  value={customCooling}
                  onChange={(e) => {
                    setCustomCooling(e.target.value);
                    handleChange("coolingType", e.target.value);
                  }}
                  placeholder="Enter custom type"
                  className={inputClass}
                  autoFocus
                />
                <button
                  onClick={() => setIsCustomCooling(false)}
                  className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Back to predefined list"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
        <div>
          <label className={labelClass}>Number of Windings</label>
          <input
            type="text"
            value={jobInfo.numberOfWindings}
            onChange={(e) => handleChange("numberOfWindings", e.target.value)}
            placeholder="e.g. 1"
            className={inputClass}
          />
        </div>
      </div>
    </GlassPanel>
  );
}
