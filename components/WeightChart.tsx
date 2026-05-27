"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import type { WeightEntry } from "@/lib/types";

type Props = {
  entries: WeightEntry[];
  targetWeight?: number;
};

export default function WeightChart({ entries, targetWeight }: Props) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
        <span className="text-3xl mb-2">📈</span>
        체중을 기록하면 그래프가 나타나요
      </div>
    );
  }

  const sorted = [...entries].sort(
    (a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime() ||
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const data = sorted.map((e) => ({
    date: e.date.slice(5),
    weight: e.weight,
  }));

  const weights = entries.map((e) => e.weight);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const avg = Math.round((weights.reduce((a, b) => a + b, 0) / weights.length) * 10) / 10;

  return (
    <div>
      <div className="flex gap-4 text-sm mb-4">
        <Stat label="최소" value={`${min} kg`} color="text-blue-400" />
        <Stat label="최대" value={`${max} kg`} color="text-red-400" />
        <Stat label="평균" value={`${avg} kg`} color="text-gray-500" />
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} />
          <YAxis
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            domain={[
              (dataMin: number) => Math.min(dataMin, targetWeight ?? dataMin),
              (dataMax: number) => Math.max(dataMax, targetWeight ?? dataMax),
            ]}
          />
          <Tooltip
            formatter={(v) => [`${v} kg`, "체중"]}
            contentStyle={{ borderRadius: 12, border: "1px solid #fbcfe8" }}
          />
          {targetWeight && (
            <ReferenceLine
              y={targetWeight}
              stroke="#a78bfa"
              strokeDasharray="4 4"
              label={{ value: `목표 ${targetWeight}kg`, fill: "#a78bfa", fontSize: 11 }}
            />
          )}
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#f472b6"
            strokeWidth={2}
            dot={{ r: 4, fill: "#f472b6" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-center bg-white rounded-xl px-4 py-2 shadow-sm border border-pink-50 flex-1">
      <span className="text-xs text-gray-400">{label}</span>
      <span className={`font-bold text-sm ${color}`}>{value}</span>
    </div>
  );
}
