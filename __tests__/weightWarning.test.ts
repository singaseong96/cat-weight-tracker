import { describe, it, expect } from "vitest";
import { getWeightWarning } from "@/lib/weightWarning";
import type { WeightEntry } from "@/lib/types";

function makeEntry(id: string, date: string, weight: number): WeightEntry {
  return { id, catId: "c1", weight, date, createdAt: date + "T00:00:00Z" };
}

describe("getWeightWarning", () => {
  it("returns null for fewer than 2 entries", () => {
    expect(getWeightWarning([])).toBeNull();
    expect(getWeightWarning([makeEntry("1", "2024-01-01", 4.0)])).toBeNull();
  });

  it("returns null when change is under 10%", () => {
    const entries = [
      makeEntry("1", "2024-01-10", 4.3),
      makeEntry("2", "2024-01-01", 4.0),
    ];
    expect(getWeightWarning(entries)).toBeNull();
  });

  it("detects 10%+ weight gain within 14 days", () => {
    const entries = [
      makeEntry("1", "2024-01-10", 4.5),
      makeEntry("2", "2024-01-01", 4.0),
    ];
    const w = getWeightWarning(entries);
    expect(w).not.toBeNull();
    expect(w!.percent).toBeCloseTo(12.5);
    expect(w!.from).toBe(4.0);
    expect(w!.to).toBe(4.5);
    expect(w!.days).toBe(9);
  });

  it("detects 10%+ weight loss within 14 days", () => {
    const entries = [
      makeEntry("1", "2024-01-10", 3.5),
      makeEntry("2", "2024-01-01", 4.0),
    ];
    const w = getWeightWarning(entries);
    expect(w).not.toBeNull();
    expect(w!.percent).toBeCloseTo(-12.5);
  });

  it("returns null when change is outside 14-day window", () => {
    const entries = [
      makeEntry("1", "2024-02-01", 4.5),
      makeEntry("2", "2024-01-01", 4.0),
    ];
    expect(getWeightWarning(entries)).toBeNull();
  });

  it("uses the oldest entry within 14-day window as baseline", () => {
    const entries = [
      makeEntry("1", "2024-01-15", 4.6),
      makeEntry("2", "2024-01-08", 4.1),
      makeEntry("3", "2024-01-01", 4.0),
    ];
    const w = getWeightWarning(entries);
    expect(w).not.toBeNull();
    // baseline = oldest in window: 2024-01-01 (14 days from Jan 15)
    expect(w!.from).toBe(4.0);
  });
});
