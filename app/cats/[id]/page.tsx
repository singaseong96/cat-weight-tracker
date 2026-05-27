"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCatStore } from "@/store/catStore";
import WeightChart from "@/components/WeightChart";
import WeightEntryForm from "@/components/WeightEntryForm";
import Modal from "@/components/Modal";
import type { WeightEntry } from "@/lib/types";
import { ACTIVITY_LABELS } from "@/lib/types";
import { calcRER, calcDailyCalories } from "@/lib/calories";
import { getWeightWarning } from "@/lib/weightWarning";

export default function CatDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { cats, entries, addWeightEntry, updateWeightEntry, deleteWeightEntry } =
    useCatStore();

  const cat = cats.find((c) => c.id === id);
  const catEntries = entries
    .filter((e) => e.catId === id)
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime() ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const latestWeight = catEntries[0]?.weight;
  const weightWarning = getWeightWarning(catEntries);
  const rer = latestWeight ? calcRER(latestWeight) : null;
  const dailyCalories =
    latestWeight && cat?.activityLevel
      ? calcDailyCalories(latestWeight, cat.activityLevel)
      : null;

  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<WeightEntry | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<WeightEntry | null>(null);

  if (!cat) {
    router.replace("/");
    return null;
  }

  return (
    <main className="min-h-screen bg-pink-50 px-4 py-8 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="text-pink-400 hover:text-pink-600 text-xl">
          ←
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">
            🐱 {cat.name}
          </h1>
          {cat.targetWeight && (
            <p className="text-sm text-gray-400">목표: {cat.targetWeight} kg</p>
          )}
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-pink-400 hover:bg-pink-500 text-white font-semibold px-4 py-2 rounded-xl text-sm transition"
        >
          + 기록
        </button>
      </div>

      {weightWarning && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-4">
          <p className="text-sm font-semibold text-amber-700 mb-1">
            ⚠️ 체중 급변 감지
          </p>
          <p className="text-sm text-amber-600">
            {weightWarning.days}일 만에{" "}
            <span className="font-semibold">
              {weightWarning.from} kg → {weightWarning.to} kg
            </span>{" "}
            ({weightWarning.percent > 0 ? "+" : ""}
            {weightWarning.percent.toFixed(1)}%). 수의사 상담을 권장합니다.
          </p>
        </div>
      )}

      {/* 권장 섭취 칼로리 */}
      {rer !== null && (
        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-5 mb-4">
          <p className="text-xs font-semibold text-pink-400 uppercase tracking-wide mb-3">
            🔥 권장 섭취 칼로리
          </p>
          <div className="flex gap-3">
            <div className="flex-1 bg-pink-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">기초대사량 (RER)</p>
              <p className="text-xl font-bold text-gray-800">{rer}</p>
              <p className="text-xs text-gray-400">kcal/일</p>
            </div>
            {dailyCalories !== null ? (
              <div className="flex-1 bg-pink-100 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">
                  {ACTIVITY_LABELS[cat.activityLevel!]}
                </p>
                <p className="text-xl font-bold text-pink-600">{dailyCalories}</p>
                <p className="text-xs text-gray-400">kcal/일</p>
              </div>
            ) : (
              <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center flex items-center justify-center">
                <p className="text-xs text-gray-400 leading-relaxed">
                  고양이 정보에서<br />활동 수준을<br />설정해보세요
                </p>
              </div>
            )}
          </div>
          <p className="text-[10px] text-gray-400 mt-3">
            * 현재 체중 {latestWeight} kg 기준 · RER = 70 × 체중^0.75
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-5 mb-6">
        <WeightChart entries={catEntries} targetWeight={cat.targetWeight} />
      </div>

      <div className="flex flex-col gap-3">
        {catEntries.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-8">
            아직 기록이 없어요. + 기록 버튼으로 시작해보세요!
          </div>
        ) : (
          catEntries.map((entry, i) => {
            const next = catEntries[i + 1];
            const diff = next ? entry.weight - next.weight : null;
            return (
              <div
                key={entry.id}
                className="bg-white rounded-2xl border border-pink-100 px-5 py-4 flex items-center justify-between shadow-sm"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-400">{entry.date}</p>
                  <div className="flex items-end gap-2 mt-0.5">
                    <span className="text-xl font-bold text-pink-500">
                      {entry.weight} kg
                    </span>
                    {diff !== null && (
                      <div className="flex flex-col pb-0.5">
                        <span
                          className={`text-xs font-semibold leading-tight ${
                            diff > 0 ? "text-red-400" : diff < 0 ? "text-blue-400" : "text-gray-400"
                          }`}
                        >
                          {diff > 0 ? "↑" : diff < 0 ? "↓" : "—"} {Math.abs(diff).toFixed(1)}
                        </span>
                        <span className="text-[10px] text-gray-400 leading-tight">이전 대비</span>
                      </div>
                    )}
                  </div>
                  {entry.memo && (
                    <p className="text-xs text-gray-500 mt-1 truncate">{entry.memo}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditing(entry)}
                    className="text-sm text-gray-400 hover:text-pink-400 px-2 py-1 rounded-lg transition"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => setConfirmDelete(entry)}
                    className="text-sm text-gray-400 hover:text-red-400 px-2 py-1 rounded-lg transition"
                  >
                    삭제
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showAdd && (
        <Modal title="체중 기록" onClose={() => setShowAdd(false)}>
          <WeightEntryForm
            onSubmit={(weight, date, memo) => {
              addWeightEntry(id, weight, date, memo);
              setShowAdd(false);
            }}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}

      {editing && (
        <Modal title="체중 수정" onClose={() => setEditing(null)}>
          <WeightEntryForm
            initial={editing}
            onSubmit={(weight, date, memo) => {
              updateWeightEntry(editing.id, weight, date, memo);
              setEditing(null);
            }}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}

      {confirmDelete && (
        <Modal title="기록을 삭제할까요?" onClose={() => setConfirmDelete(null)}>
          <p className="text-sm text-gray-600 mb-4">
            {confirmDelete.date}의 {confirmDelete.weight} kg 기록이 삭제됩니다.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                deleteWeightEntry(confirmDelete.id);
                setConfirmDelete(null);
              }}
              className="flex-1 bg-red-400 hover:bg-red-500 text-white font-semibold py-2 rounded-xl transition"
            >
              삭제
            </button>
            <button
              onClick={() => setConfirmDelete(null)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 rounded-xl transition"
            >
              취소
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}
