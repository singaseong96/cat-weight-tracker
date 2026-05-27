import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import WeightEntryForm from "@/components/WeightEntryForm";

describe("WeightEntryForm — 유효성 검사", () => {
  it("체중 0 이하 입력 시 onSubmit 호출 안됨", () => {
    const onSubmit = vi.fn();
    render(<WeightEntryForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText("예: 4.2"), {
      target: { value: "0" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "기록" }).closest("form")!);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("유효한 체중 입력 시 onSubmit 호출됨", () => {
    const onSubmit = vi.fn();
    render(<WeightEntryForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText("예: 4.2"), {
      target: { value: "4.2" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "기록" }).closest("form")!);
    expect(onSubmit).toHaveBeenCalledWith(4.2, expect.any(String), undefined);
  });

  it("수정 모드에서 기존 값이 채워짐", () => {
    const initial = {
      id: "e1",
      catId: "c1",
      weight: 3.8,
      date: "2026-05-10",
      createdAt: new Date().toISOString(),
    };
    render(<WeightEntryForm initial={initial} onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByDisplayValue("3.8")).toBeTruthy();
    expect(screen.getByDisplayValue("2026-05-10")).toBeTruthy();
    expect(screen.getByRole("button", { name: "수정" })).toBeTruthy();
  });
});
