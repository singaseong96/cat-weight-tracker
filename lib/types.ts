export type ActivityLevel =
  | "kitten_young"   // 새끼 4개월 미만
  | "kitten_old"     // 새끼 4~12개월
  | "neutered"       // 중성화 성묘
  | "intact"         // 미중성화 성묘
  | "inactive"       // 비활동적
  | "weight_loss";   // 체중 감량 중

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  kitten_young: "새끼 (4개월 미만)",
  kitten_old:   "새끼 (4~12개월)",
  neutered:     "중성화 성묘",
  intact:       "미중성화 성묘",
  inactive:     "비활동적",
  weight_loss:  "체중 감량 중",
};

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  kitten_young: 3.0,
  kitten_old:   2.0,
  neutered:     1.2,
  intact:       1.4,
  inactive:     1.0,
  weight_loss:  0.8,
};

export type Cat = {
  id: string;
  name: string;
  targetWeight?: number;
  activityLevel?: ActivityLevel;
  createdAt: string;
};

export type WeightEntry = {
  id: string;
  catId: string;
  weight: number;
  date: string;
  memo?: string;
  createdAt: string;
};
