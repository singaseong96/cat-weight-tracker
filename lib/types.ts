export type Cat = {
  id: string;
  name: string;
  targetWeight?: number;
  createdAt: string;
};

export type WeightEntry = {
  id: string;
  catId: string;
  weight: number;
  date: string;
  createdAt: string;
};
