export type HabitCategory = 'water' | 'meditate' | 'stretch' | 'walk' | 'prayer' | 'fitness' | 'meal' | 'custom';

export interface Habit {
  id: string;
  title: string;
  category: HabitCategory;
  streak: number;
  durationMinutes: number;
  timeTarget?: string; // e.g. "07:00"
  completedDates: string[]; // YYYY-MM-DD
  icon?: string;
  notes?: string;
}

export type PrayerName = 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya';

export interface PrayerTimes {
  subuh: string;
  terbit: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export interface DayPrayerStatus {
  subuh: boolean;
  dzuhur: boolean;
  ashar: boolean;
  maghrib: boolean;
  isya: boolean;
}

export type MealType = 'sarapan' | 'susu_protein' | 'siang' | 'sore' | 'malam';

export interface MealRecord {
  eaten: boolean;
  time?: string;
  note?: string;
}

export interface DayMealStatus {
  sarapan?: MealRecord;
  susu_protein?: MealRecord;
  siang?: MealRecord;
  sore?: MealRecord;
  malam?: MealRecord;
  waterGlasses: number;
}

export interface PushUpSet {
  id: string;
  date: string; // YYYY-MM-DD
  reps: number;
  timestamp: string;
}

export interface WeightRecord {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  note?: string;
}

export type ExpenseCategory = 'food' | 'snack' | 'transport' | 'bills' | 'lifestyle' | 'income' | 'other';

export interface ExpenseRecord {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  type?: 'expense' | 'income'; // default 'expense'
  category: ExpenseCategory;
  note?: string;
  timestamp: string; // HH:mm
}

export interface UserProfile {
  name: string;
  avatar: string;
  city: string;
  heightCm: number;
  weightGoalKg: number;
  pushUpDailyGoal: number;
  waterDailyGoal: number;
  dailyPocketMoney: number;
  savingsGoal?: number;
  savingsGoalTitle?: string;
}

