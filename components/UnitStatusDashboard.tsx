"use client";

import { useAppState } from "@/lib/store";
import GlassPanel from "./GlassPanel";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function UnitStatusDashboard() {
  const { schedule, units } = useAppState();

  const chartData = units.map((unit) => {
    const unitSchedule = schedule.filter((e) => e.unitName === unit);
    return {
      name: unit,
      Pending: unitSchedule.filter((e) => e.status === "Pending").length,
      "In Progress": unitSchedule.filter((e) => e.status === "In Progress").length,
      Completed: unitSchedule.filter((e) => e.status === "Completed").length,
      Failed: unitSchedule.filter((e) => e.status === "Failed").length,
    };
  });

  const hasData = schedule.length > 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-white/10 p-3 rounded-lg shadow-xl text-xs">
          <p className="font-semibold text-white mb-2 pb-1 border-b border-white/10">
            {label}
          </p>
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center gap-2 mb-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-300">{entry.name}:</span>
              <span className="text-white font-medium ml-auto">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <GlassPanel className="p-5" delay={0.4}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.8)]" />
          Unit Status Dashboard
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Pictorial representation of progress per Transformer Unit
        </p>
      </div>

      {!hasData ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-500 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
          <div className="text-4xl mb-3 opacity-30">📊</div>
          <p className="text-sm">No tests scheduled</p>
          <p className="text-xs text-slate-600 mt-1">
            Visual data will appear here once tests are added
          </p>
        </div>
      ) : (
        <div className="h-72 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="rgba(255,255,255,0.4)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="rgba(255,255,255,0.4)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(255,255,255,0.02)" }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: "11px", paddingTop: "20px" }}
              />
              <Bar
                dataKey="Pending"
                stackId="a"
                fill="#64748b" // slate-500
                radius={[0, 0, 0, 0]}
                barSize={32}
              />
              <Bar
                dataKey="In Progress"
                stackId="a"
                fill="#f59e0b" // amber-500
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="Failed"
                stackId="a"
                fill="#ef4444" // red-500
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="Completed"
                stackId="a"
                fill="#10b981" // emerald-500
                radius={[4, 4, 0, 0]} // round top edges
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassPanel>
  );
}
