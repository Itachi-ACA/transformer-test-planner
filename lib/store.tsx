"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { TEST_NAMES as DEFAULT_TEST_NAMES, type JobInfo, type ScheduleEntry, type Status } from "@/data/testNames";

interface AppState {
  jobInfo: JobInfo;
  setJobInfo: (info: JobInfo) => void;
  days: string[];
  addDay: () => void;
  removeDay: (day: string) => void;
  units: string[];
  addUnit: () => void;
  removeUnit: (unit: string) => void;
  testNames: string[];
  addTestName: (name: string) => void;
  removeTestName: (name: string) => void;
  renameTestName: (oldName: string, newName: string) => void;
  schedule: ScheduleEntry[];
  addScheduleEntry: (entry: Omit<ScheduleEntry, "id" | "createdAt">) => void;
  updateStatus: (id: string, status: Status) => void;
  deleteEntry: (id: string) => void;
  clearSchedule: () => void;
  selectedDay: string;
  setSelectedDay: (day: string) => void;
  isHydrated: boolean;
}

const AppContext = createContext<AppState | null>(null);

const DEFAULT_DAYS = Array.from({ length: 10 }, (_, i) => `Day ${i + 1}`);
const DEFAULT_UNITS = ["Unit 1"];

const DEFAULT_JOB: JobInfo = {
  workOrderNumber: "",
  customerName: "",
  transformerRating: "",
  voltageLevel: "",
  coolingType: "ONAN",
  numberOfWindings: "",
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Always initialize with defaults (same on server and client)
  const [jobInfo, setJobInfoState] = useState<JobInfo>(DEFAULT_JOB);
  const [days, setDays] = useState<string[]>(DEFAULT_DAYS);
  const [units, setUnits] = useState<string[]>(DEFAULT_UNITS);
  const [testNames, setTestNames] = useState<string[]>(DEFAULT_TEST_NAMES);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>("Day 1");
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage AFTER mount (client-only)
  useEffect(() => {
    try {
      const savedJob = localStorage.getItem("ttp_jobInfo");
      if (savedJob) setJobInfoState(JSON.parse(savedJob));

      const savedDays = localStorage.getItem("ttp_days");
      if (savedDays) setDays(JSON.parse(savedDays));

      const savedUnits = localStorage.getItem("ttp_units");
      if (savedUnits) setUnits(JSON.parse(savedUnits));

      // Clear stale test names cache so new defaults always load
      localStorage.removeItem("ttp_testNames");

      const savedSchedule = localStorage.getItem("ttp_schedule");
      if (savedSchedule) setSchedule(JSON.parse(savedSchedule));
    } catch {
      // If parse fails, keep defaults
    }
    setIsHydrated(true);
  }, []);

  // Persist to localStorage (skip the initial hydration write)
  useEffect(() => {
    if (isHydrated) localStorage.setItem("ttp_jobInfo", JSON.stringify(jobInfo));
  }, [jobInfo, isHydrated]);
  useEffect(() => {
    if (isHydrated) localStorage.setItem("ttp_days", JSON.stringify(days));
  }, [days, isHydrated]);
  useEffect(() => {
    if (isHydrated) localStorage.setItem("ttp_units", JSON.stringify(units));
  }, [units, isHydrated]);
  useEffect(() => {
    if (isHydrated) localStorage.setItem("ttp_testNames", JSON.stringify(testNames));
  }, [testNames, isHydrated]);
  useEffect(() => {
    if (isHydrated) localStorage.setItem("ttp_schedule", JSON.stringify(schedule));
  }, [schedule, isHydrated]);

  const setJobInfo = useCallback((info: JobInfo) => {
    setJobInfoState(info);
  }, []);

  const addDay = useCallback(() => {
    setDays((prev) => [...prev, `Day ${prev.length + 1}`]);
  }, []);

  const removeDay = useCallback((day: string) => {
    setDays((prev) => prev.filter((d) => d !== day));
    // Also remove from schedule
    setSchedule((prev) => prev.filter((e) => e.dayLabel !== day));
  }, []);

  const addUnit = useCallback(() => {
    setUnits((prev) => [...prev, `Unit ${prev.length + 1}`]);
  }, []);

  const removeUnit = useCallback((unit: string) => {
    setUnits((prev) => prev.filter((u) => u !== unit));
    // Also remove from schedule
    setSchedule((prev) => prev.filter((e) => e.unitName !== unit));
  }, []);

  const addTestName = useCallback((name: string) => {
    setTestNames((prev) => [...prev, name]);
  }, []);

  const removeTestName = useCallback((name: string) => {
    if (window.confirm("Are you sure you want to remove this test from the library?")) {
      setTestNames((prev) => prev.filter((t) => t !== name));
      setSchedule((prev) => prev.filter((e) => e.testName !== name));
    }
  }, []);

  const renameTestName = useCallback((oldName: string, newName: string) => {
    if (!newName.trim() || newName === oldName) return;
    setTestNames((prev) => prev.map((t) => (t === oldName ? newName.trim() : t)));
    // Also update any existing schedule entries with the old name
    setSchedule((prev) =>
      prev.map((e) => (e.testName === oldName ? { ...e, testName: newName.trim() } : e))
    );
  }, []);

  const addScheduleEntry = useCallback(
    (entry: Omit<ScheduleEntry, "id" | "createdAt">) => {
      let idStr = "";
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        idStr = crypto.randomUUID();
      } else {
        idStr = Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      }

      const newEntry: ScheduleEntry = {
        ...entry,
        id: idStr,
        createdAt: new Date().toISOString(),
      };
      setSchedule((prev) => [...prev, newEntry]);
    },
    []
  );

  const updateStatus = useCallback((id: string, status: Status) => {
    setSchedule((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setSchedule((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearSchedule = useCallback(() => {
    if (window.confirm("Are you sure you want to clear the entire schedule?")) {
      setSchedule([]);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        jobInfo,
        setJobInfo,
        days,
        addDay,
        removeDay,
        units,
        addUnit,
        removeUnit,
        testNames,
        addTestName,
        removeTestName,
        renameTestName,
        schedule,
        addScheduleEntry,
        updateStatus,
        deleteEntry,
        clearSchedule,
        selectedDay,
        setSelectedDay,
        isHydrated,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used within AppProvider");
  return ctx;
}
