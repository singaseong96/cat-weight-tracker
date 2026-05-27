import type { ActivityLevel } from "./types";
import { ACTIVITY_MULTIPLIERS } from "./types";

export function calcRER(weightKg: number): number {
  return Math.round(70 * Math.pow(weightKg, 0.75));
}

export function calcDailyCalories(weightKg: number, level: ActivityLevel): number {
  return Math.round(calcRER(weightKg) * ACTIVITY_MULTIPLIERS[level]);
}
