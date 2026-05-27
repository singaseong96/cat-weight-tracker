"use client";

import { useState } from "react";
import { useCatStore } from "@/store/catStore";
import CatCard from "@/components/CatCard";
import CatForm from "@/components/CatForm";
import Modal from "@/components/Modal";
import type { Cat } from "@/lib/types";

export default function Home() {
  const { cats, entries, addCat, updateCat, deleteCat } = useCatStore();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Cat | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Cat | null>(null);

  return (
    <main className="min-h-screen bg-pink-50 px-4 py-8 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🐾 냥이 체중 기록</h1>
          <p className="text-sm text-gray-500 mt-0.5">우리 고양이들의 건강을 기록해요</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-pink-400 hover:bg-pink-500 text-white font-semibold px-4 py-2 rounded-xl text-sm transition"
        >
          + 추가
        </button>
      </div>

      {cats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="text-6xl mb-4">🐱</span>
          <p className="text-gray-500 font-medium">등록된 고양이가 없어요</p>
          <p className="text-gray-400 text-sm mt-1">+ 추가 버튼으로 시작해보세요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {cats.map((cat) => (
            <CatCard
              key={cat.id}
              cat={cat}
              entries={entries.filter((e) => e.catId === cat.id)}
              onEdit={() => setEditing(cat)}
              onDelete={() => setConfirmDelete(cat)}
            />
          ))}
        </div>
      )}

      {showAdd && (
        <Modal title="고양이 추가" onClose={() => setShowAdd(false)}>
          <CatForm
            onSubmit={(name, targetWeight, activityLevel) => {
              addCat(name, targetWeight, activityLevel);
              setShowAdd(false);
            }}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}

      {editing && (
        <Modal title="고양이 수정" onClose={() => setEditing(null)}>
          <CatForm
            initial={editing}
            onSubmit={(name, targetWeight, activityLevel) => {
              updateCat(editing.id, name, targetWeight, activityLevel);
              setEditing(null);
            }}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}

      {confirmDelete && (
        <Modal title="정말 삭제할까요?" onClose={() => setConfirmDelete(null)}>
          <p className="text-sm text-gray-600 mb-4">
            <strong>{confirmDelete.name}</strong>의 모든 체중 기록이 함께 삭제됩니다.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                deleteCat(confirmDelete.id);
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
