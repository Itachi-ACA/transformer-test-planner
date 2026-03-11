"use client";

import dynamic from "next/dynamic";
import { AppProvider } from "@/lib/store";
import Header from "@/components/Header";
import JobInfoForm from "@/components/JobInfoForm";
import DaySelector from "@/components/DaySelector";
import UnitSelector from "@/components/UnitSelector";
import TestList from "@/components/TestList";
import ScheduleTable from "@/components/ScheduleTable";
import ProgressDashboard from "@/components/ProgressDashboard";
import ExcelExport from "@/components/ExcelExport";
import UnitStatusDashboard from "@/components/UnitStatusDashboard";
import GlassPanel from "@/components/GlassPanel";

const ParticleBackground = dynamic(
  () => import("@/components/ParticleBackground"),
  { ssr: false }
);

export default function Home() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#0a0e1a] text-white relative overflow-x-hidden">
        <ParticleBackground />

        {/* Header */}
        <Header />

        {/* Main content */}
        <main className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-6 py-8 space-y-8">
          {/* Hero */}
          <GlassPanel className="p-8 text-center" delay={0.1} glowColor="rgba(0,180,255,0.08)">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Transformer Testing
              </span>{" "}
              <span className="text-white/80">Planning System</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
              Plan, track, and export complex test sequences across multiple units with precision engineering.
            </p>
          </GlassPanel>

          {/* Job Information */}
          <JobInfoForm />

          {/* Day + Unit Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DaySelector />
            </div>
            <div>
              <UnitSelector />
            </div>
          </div>

          {/* Test Library */}
          <TestList />

          {/* Progress Dashboard */}
          <ProgressDashboard />

          {/* Schedule Board */}
          <ScheduleTable />

          {/* Export Controls */}
          <GlassPanel className="p-5 flex items-center justify-between" delay={0.35}>
            <div>
              <h2 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                Export & Controls
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Download the complete test schedule as an Excel file
              </p>
            </div>
            <ExcelExport />
          </GlassPanel>

          {/* Unit Status Dashboard */}
          <UnitStatusDashboard />

          {/* Footer */}
          <div className="text-center pt-16 pb-8 text-slate-500 text-xs font-serif italic">
            <p>Indo Tech — Transformer Testing Planning System v2.0</p>
            <p className="mt-1">Professional Industrial Scheduling Software</p>
            <p className="mt-4 text-[10px] tracking-widest uppercase text-cyan-500/50 font-sans font-bold not-italic">
              Website by KRISHNA RAJU
            </p>
          </div>
        </main>
      </div>
    </AppProvider>
  );
}
