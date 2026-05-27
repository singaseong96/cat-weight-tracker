import { describe, it, expect, beforeEach, vi } from "vitest";

// localStorage mock
const store: Record<string, string> = {};
vi.stubGlobal("localStorage", {
  getItem: (k: string) => store[k] ?? null,
  setItem: (k: string, v: string) => { store[k] = v; },
  removeItem: (k: string) => { delete store[k]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
});

// crypto.randomUUID mock
let uuidCounter = 0;
vi.stubGlobal("crypto", { randomUUID: () => `uuid-${++uuidCounter}` });

import { useCatStore } from "@/store/catStore";

beforeEach(() => {
  uuidCounter = 0;
  useCatStore.setState({ cats: [], entries: [] });
});

describe("CatStore — addCat", () => {
  it("고양이 추가", () => {
    useCatStore.getState().addCat("나비", 4.5);
    const { cats } = useCatStore.getState();
    expect(cats).toHaveLength(1);
    expect(cats[0].name).toBe("나비");
    expect(cats[0].targetWeight).toBe(4.5);
    expect(cats[0].id).toBe("uuid-1");
  });

  it("목표체중 없이 추가 가능", () => {
    useCatStore.getState().addCat("콩이");
    expect(useCatStore.getState().cats[0].targetWeight).toBeUndefined();
  });
});

describe("CatStore — updateCat", () => {
  it("이름과 목표체중 수정", () => {
    useCatStore.getState().addCat("나비", 4.5);
    const id = useCatStore.getState().cats[0].id;
    useCatStore.getState().updateCat(id, "나비야", 5.0);
    const cat = useCatStore.getState().cats[0];
    expect(cat.name).toBe("나비야");
    expect(cat.targetWeight).toBe(5.0);
  });
});

describe("CatStore — deleteCat (cascade)", () => {
  it("고양이 삭제 시 체중 기록도 함께 삭제", () => {
    useCatStore.getState().addCat("나비");
    const catId = useCatStore.getState().cats[0].id;
    useCatStore.getState().addWeightEntry(catId, 4.2, "2026-05-01");
    useCatStore.getState().addWeightEntry(catId, 4.3, "2026-05-10");
    expect(useCatStore.getState().entries).toHaveLength(2);

    useCatStore.getState().deleteCat(catId);
    expect(useCatStore.getState().cats).toHaveLength(0);
    expect(useCatStore.getState().entries).toHaveLength(0);
  });

  it("다른 고양이 기록은 남음", () => {
    useCatStore.getState().addCat("나비");
    useCatStore.getState().addCat("콩이");
    const [cat1, cat2] = useCatStore.getState().cats;
    useCatStore.getState().addWeightEntry(cat1.id, 4.2, "2026-05-01");
    useCatStore.getState().addWeightEntry(cat2.id, 3.8, "2026-05-01");

    useCatStore.getState().deleteCat(cat1.id);
    expect(useCatStore.getState().entries).toHaveLength(1);
    expect(useCatStore.getState().entries[0].catId).toBe(cat2.id);
  });
});

describe("CatStore — addWeightEntry", () => {
  it("체중 0.1 단위 반올림 저장", () => {
    useCatStore.getState().addCat("나비");
    const catId = useCatStore.getState().cats[0].id;
    useCatStore.getState().addWeightEntry(catId, 4.25, "2026-05-01");
    expect(useCatStore.getState().entries[0].weight).toBe(4.3);
  });

  it("같은 날 복수 기록 허용", () => {
    useCatStore.getState().addCat("나비");
    const catId = useCatStore.getState().cats[0].id;
    useCatStore.getState().addWeightEntry(catId, 4.2, "2026-05-01");
    useCatStore.getState().addWeightEntry(catId, 4.3, "2026-05-01");
    expect(useCatStore.getState().entries).toHaveLength(2);
  });
});

describe("CatStore — updateWeightEntry", () => {
  it("체중과 날짜 수정", () => {
    useCatStore.getState().addCat("나비");
    const catId = useCatStore.getState().cats[0].id;
    useCatStore.getState().addWeightEntry(catId, 4.2, "2026-05-01");
    const entryId = useCatStore.getState().entries[0].id;
    useCatStore.getState().updateWeightEntry(entryId, 4.5, "2026-05-15");
    const entry = useCatStore.getState().entries[0];
    expect(entry.weight).toBe(4.5);
    expect(entry.date).toBe("2026-05-15");
  });
});

describe("CatStore — deleteWeightEntry", () => {
  it("특정 기록만 삭제", () => {
    useCatStore.getState().addCat("나비");
    const catId = useCatStore.getState().cats[0].id;
    useCatStore.getState().addWeightEntry(catId, 4.2, "2026-05-01");
    useCatStore.getState().addWeightEntry(catId, 4.5, "2026-05-10");
    const entryId = useCatStore.getState().entries[0].id;
    useCatStore.getState().deleteWeightEntry(entryId);
    expect(useCatStore.getState().entries).toHaveLength(1);
  });
});
