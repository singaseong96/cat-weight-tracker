"use client";

import { useState } from "react";
import type { Cat } from "@/lib/types";

type Props = {
  initial?: Cat;
  onSubmit: (name: string, targetWeight?: number) => void;
  onCancel: () => void;
};

export default function CatForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [targetWeight, setTargetWeight] = useState(
    initial?.targetWeight?.toString() ?? ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const tw = targetWeight ? parseFloat(targetWeight) : undefined;
    onSubmit(name.trim(), tw && tw > 0 ? Math.round(tw * 10) / 10 : undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          이름 <span className="text-pink-400">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 나비"
          className="w-full rounded-xl border border-pink-200 px-4 py-2 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          목표 체중 (kg, 선택)
        </label>
        <input
          type="number"
          value={targetWeight}
          onChange={(e) => setTargetWeight(e.target.value)}
          placeholder="예: 4.5"
          step="0.1"
          min="0.1"
          className="w-full rounded-xl border border-pink-200 px-4 py-2 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 bg-pink-400 hover:bg-pink-500 text-white font-semibold py-2 rounded-xl transition"
        >
          {initial ? "수정" : "추가"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 rounded-xl transition"
        >
          취소
        </button>
      </div>
    </form>
  );
}
