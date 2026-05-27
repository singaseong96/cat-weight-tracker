import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import WeightChart from "@/components/WeightChart";
import type { WeightEntry } from "@/lib/types";

// Recharts ResizeObserver mock
vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
);

const makeEntry = (weight: number, date: string): WeightEntry => ({
  id: `e-${date}`,
  catId: "c1",
  weight,
  date,
  createdAt: new Date().toISOString(),
});

describe("WeightChart", () => {
  it("데이터 없으면 empty state 표시", () => {
    render(<WeightChart entries={[]} />);
    expect(screen.getByText(/체중을 기록하면/)).toBeTruthy();
  });

  it("min/max/avg 통계 올바르게 표시", () => {
    const entries = [
      makeEntry(4.0, "2026-05-01"),
      makeEntry(4.5, "2026-05-10"),
      makeEntry(4.2, "2026-05-20"),
    ];
    render(<WeightChart entries={entries} />);
    expect(screen.getByText("4 kg")).toBeTruthy();  // min
    expect(screen.getByText("4.5 kg")).toBeTruthy(); // max
    expect(screen.getByText("4.2 kg")).toBeTruthy(); // avg
  });
});
