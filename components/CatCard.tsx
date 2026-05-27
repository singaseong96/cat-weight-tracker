"use client";

import Link from "next/link";
import type { Cat, WeightEntry } from "@/lib/types";

type Props = {
  cat: Cat;
  entries: WeightEntry[];
  onEdit: () => void;
  onDelete: () => void;
};

export default function CatCard({ cat, entries, onEdit, onDelete }: Props) {
  const sorted = [...entries].sort(
    (a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime() ||
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const latest = sorted[0];
  const prev = sorted[1];
  const diff = latest && prev ? latest.weight - prev.weight : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Link href={`/cats/${cat.id}`} className="flex items-center gap-2 flex-1">
          <span className="text-2xl">🐱</span>
          <span className="font-bold text-gray-800 text-lg">{cat.name}</span>
        </Link>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="text-sm text-gray-400 hover:text-pink-400 px-2 py-1 rounded-lg transition"
          >
            수정
          </button>
          <button
            onClick={onDelete}
            className="text-sm text-gray-400 hover:text-red-400 px-2 py-1 rounded-lg transition"
          >
            삭제
          </button>
        </div>
      </div>

      <Link href={`/cats/${cat.id}`}>
        {latest ? (
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-pink-500">
              {latest.weight}
              <span className="text-base font-normal text-gray-400 ml-1">kg</span>
            </span>
            {diff !== null && (
              <div className="flex flex-col pb-1">
                <span
                  className={`text-sm font-semibold leading-tight ${
                    diff > 0 ? "text-red-400" : diff < 0 ? "text-blue-400" : "text-gray-400"
                  }`}
                >
                  {diff > 0 ? "↑" : diff < 0 ? "↓" : "—"} {Math.abs(diff).toFixed(1)} kg
                </span>
                <span className="text-[10px] text-gray-400 leading-tight">이전 대비</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">아직 기록이 없어요</p>
        )}
        {cat.targetWeight && (
          <p className="text-xs text-gray-500 mt-1">목표: {cat.targetWeight} kg</p>
        )}
      </Link>
    </div>
  );
}
