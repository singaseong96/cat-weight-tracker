"use client";

import { useState } from "react";
import type { WeightEntry } from "@/lib/types";

type Props = {
  initial?: WeightEntry;
  onSubmit: (weight: number, date: string, memo?: string) => void;
  onCancel: () => void;
};

const INPUT_CLS = "w-full rounded-xl border border-pink-200 px-4 py-2 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function WeightEntryForm({ initial, onSubmit, onCancel }: Props) {
  const [weight, setWeight] = useState(initial?.weight?.toString() ?? "");
  const [date, setDate] = useState(initial?.date ?? today());
  const [memo, setMemo] = useState(initial?.memo ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    if (!w || w <= 0) return;
    onSubmit(w, date, memo || undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={INPUT_CLS}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          체중 (kg) <span className="text-pink-400">*</span>
        </label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="예: 4.2"
          step="0.1"
          min="0.1"
          className={INPUT_CLS}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          메모 (선택)
        </label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="예: 병원 방문 후, 식욕 감소"
          rows={2}
          maxLength={100}
          className={`${INPUT_CLS} resize-none`}
        />
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 bg-pink-400 hover:bg-pink-500 text-white font-semibold py-2 rounded-xl transition"
        >
          {initial ? "수정" : "기록"}
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
