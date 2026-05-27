"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ActivityLevel, Cat, WeightEntry } from "@/lib/types";

type CatStore = {
  cats: Cat[];
  entries: WeightEntry[];
  addCat: (name: string, targetWeight?: number, activityLevel?: ActivityLevel) => void;
  updateCat: (id: string, name: string, targetWeight?: number, activityLevel?: ActivityLevel) => void;
  deleteCat: (id: string) => void;
  addWeightEntry: (catId: string, weight: number, date: string) => void;
  updateWeightEntry: (id: string, weight: number, date: string) => void;
  deleteWeightEntry: (id: string) => void;
};

const safeStorage = createJSONStorage(() => {
  try {
    return localStorage;
  } catch {
    return sessionStorage;
  }
});

export const useCatStore = create<CatStore>()(
  persist(
    (set) => ({
      cats: [],
      entries: [],

      addCat: (name, targetWeight, activityLevel) =>
        set((s) => ({
          cats: [
            ...s.cats,
            {
              id: crypto.randomUUID(),
              name,
              targetWeight,
              activityLevel,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateCat: (id, name, targetWeight, activityLevel) =>
        set((s) => ({
          cats: s.cats.map((c) =>
            c.id === id ? { ...c, name, targetWeight, activityLevel } : c
          ),
        })),

      deleteCat: (id) =>
        set((s) => ({
          cats: s.cats.filter((c) => c.id !== id),
          entries: s.entries.filter((e) => e.catId !== id),
        })),

      addWeightEntry: (catId, weight, date) =>
        set((s) => ({
          entries: [
            ...s.entries,
            {
              id: crypto.randomUUID(),
              catId,
              weight: Math.round(weight * 10) / 10,
              date,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateWeightEntry: (id, weight, date) =>
        set((s) => ({
          entries: s.entries.map((e) =>
            e.id === id
              ? { ...e, weight: Math.round(weight * 10) / 10, date }
              : e
          ),
        })),

      deleteWeightEntry: (id) =>
        set((s) => ({
          entries: s.entries.filter((e) => e.id !== id),
        })),
    }),
    {
      name: "cat-weight-store",
      storage: safeStorage,
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("localStorage rehydration failed, resetting:", error);
        }
      },
    }
  )
);
