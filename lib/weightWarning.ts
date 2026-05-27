import type { WeightEntry } from "./types";

export type WeightWarning = {
  percent: number;  // 변화율 (양수 = 증가)
  days: number;     // 기간(일)
  from: number;     // 기준 체중
  to: number;       // 현재 체중
};

// 최근 기록 기준으로 14일 내 10% 이상 변화 시 경고 반환
export function getWeightWarning(entries: WeightEntry[]): WeightWarning | null {
  if (entries.length < 2) return null;

  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const latest = sorted[0];
  const latestDate = new Date(latest.date);

  // 14일 이전 기록 중 가장 오래된 것을 기준으로
  const cutoff = new Date(latestDate);
  cutoff.setDate(cutoff.getDate() - 14);

  const inWindow = sorted.filter(
    (e) => new Date(e.date) >= cutoff && e.id !== latest.id
  );
  if (inWindow.length === 0) return null;

  const oldest = inWindow[inWindow.length - 1];
  const percent = ((latest.weight - oldest.weight) / oldest.weight) * 100;

  if (Math.abs(percent) < 10) return null;

  const days = Math.round(
    (latestDate.getTime() - new Date(oldest.date).getTime()) / (1000 * 60 * 60 * 24)
  );

  return { percent, days, from: oldest.weight, to: latest.weight };
}
