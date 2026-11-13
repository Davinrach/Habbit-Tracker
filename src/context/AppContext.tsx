import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Habit,
  DayPrayerStatus,
  DayMealStatus,
  MealType,
  PushUpSet,
  WeightRecord,
  ExpenseRecord,
  ExpenseCategory,
  UserProfile,
  PrayerTimes
} from '../types';
import { INDONESIAN_CITIES, calculatePrayerTimes } from '../utils/prayer';

interface AppContextType {
  user: UserProfile;
  updateUser: (updated: Partial<UserProfile>) => void;
  selectedDate: string; // YYYY-MM-DD
  setSelectedDate: (date: string) => void;
  habits: Habit[];
  toggleHabit: (id: string, date?: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'streak'>) => void;
  updateHabit: (id: string, updated: Partial<Omit<Habit, 'id'>>) => void;
  deleteHabit: (id: string) => void;
  prayerTimes: PrayerTimes;
  prayerStatus: Record<string, DayPrayerStatus>;
  togglePrayer: (prayerName: keyof DayPrayerStatus, date?: string) => void;
  mealStatus: Record<string, DayMealStatus>;
  toggleMeal: (mealType: MealType, date?: string, note?: string) => void;
  updateWater: (count: number, date?: string) => void;
  pushUpSets: PushUpSet[];
  addPushUpSet: (reps: number, date?: string) => void;
  deletePushUpSet: (id: string) => void;
  weightRecords: WeightRecord[];
  addWeightRecord: (weightKg: number, note?: string, date?: string) => void;
  deleteWeightRecord: (id: string) => void;
  expenses: ExpenseRecord[];
  addExpense: (amount: number, category: ExpenseCategory, note?: string, date?: string) => void;
  deleteExpense: (id: string) => void;
  activeTab: 'today' | 'schedule' | 'worship' | 'fitness' | 'finance' | 'settings';
  setActiveTab: (tab: 'today' | 'schedule' | 'worship' | 'fitness' | 'finance' | 'settings') => void;
  isQuickModalOpen: boolean;
  setIsQuickModalOpen: (open: boolean) => void;
  quickModalTab: 'habit' | 'pushup' | 'weight' | 'meal' | 'expense';
  setQuickModalTab: (tab: 'habit' | 'pushup' | 'weight' | 'meal' | 'expense') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DEFAULT_USER: UserProfile = {
  name: 'Budi',
  avatar: 'tiger',
  city: 'Jakarta',
  heightCm: 172,
  weightGoalKg: 65,
  pushUpDailyGoal: 50,
  waterDailyGoal: 8,
  dailyPocketMoney: 80000,
};

const INITIAL_HABITS: Habit[] = [];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [activeTab, setActiveTab] = useState<'today' | 'schedule' | 'worship' | 'fitness' | 'finance' | 'settings'>('today');
  const [isQuickModalOpen, setIsQuickModalOpen] = useState(false);
  const [quickModalTab, setQuickModalTab] = useState<'habit' | 'pushup' | 'weight' | 'meal' | 'expense'>('habit');

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('rise_user_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_USER, ...parsed };
    }
    return DEFAULT_USER;
  });

  useEffect(() => {
    localStorage.setItem('rise_user_v2', JSON.stringify(user));
  }, [user]);

  const updateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  // Habits (Clean Slate)
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('rise_habits_v2');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  useEffect(() => {
    localStorage.setItem('rise_habits_v2', JSON.stringify(habits));
  }, [habits]);

  const toggleHabit = (id: string, date: string = selectedDate) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== id) return habit;
        const isCompleted = habit.completedDates.includes(date);
        const newDates = isCompleted
          ? habit.completedDates.filter((d) => d !== date)
          : [...habit.completedDates, date];
        
        const newStreak = isCompleted ? Math.max(0, habit.streak - 1) : habit.streak + 1;
        return {
          ...habit,
          completedDates: newDates,
          streak: newStreak
        };
      })
    );
  };

  const addHabit = (newH: Omit<Habit, 'id' | 'completedDates' | 'streak'>) => {
    const habit: Habit = {
      ...newH,
      id: 'h_' + Date.now(),
      streak: 0,
      completedDates: [],
    };
    setHabits((prev) => [habit, ...prev]);
  };

  const updateHabit = (id: string, updated: Partial<Omit<Habit, 'id'>>) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...updated } : h))
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  // Prayer Times calculation
  const cityLocation = INDONESIAN_CITIES.find((c) => c.name.toLowerCase() === user.city.toLowerCase()) || INDONESIAN_CITIES[0];
  const prayerTimes = calculatePrayerTimes(cityLocation, new Date());

  // Prayer status
  const [prayerStatus, setPrayerStatus] = useState<Record<string, DayPrayerStatus>>(() => {
    const saved = localStorage.getItem('rise_prayers');
    return saved ? JSON.parse(saved) : {
      [getTodayString()]: { subuh: true, dzuhur: false, ashar: false, maghrib: false, isya: false }
    };
  });

  useEffect(() => {
    localStorage.setItem('rise_prayers', JSON.stringify(prayerStatus));
  }, [prayerStatus]);

  const togglePrayer = (prayerName: keyof DayPrayerStatus, date: string = selectedDate) => {
    setPrayerStatus((prev) => {
      const currentDay = prev[date] || { subuh: false, dzuhur: false, ashar: false, maghrib: false, isya: false };
      return {
        ...prev,
        [date]: {
          ...currentDay,
          [prayerName]: !currentDay[prayerName]
        }
      };
    });
  };

  // Meal Status
  const [mealStatus, setMealStatus] = useState<Record<string, DayMealStatus>>(() => {
    const saved = localStorage.getItem('rise_meals_v2');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('rise_meals_v2', JSON.stringify(mealStatus));
  }, [mealStatus]);

  const toggleMeal = (mealType: MealType, date: string = selectedDate, note?: string) => {
    setMealStatus((prev) => {
      const currentDay = prev[date] || {
        sarapan: { eaten: false },
        susu_protein: { eaten: false },
        siang: { eaten: false },
        sore: { eaten: false },
        malam: { eaten: false },
        waterGlasses: 0
      };
      const wasEaten = currentDay[mealType]?.eaten;
      return {
        ...prev,
        [date]: {
          ...currentDay,
          [mealType]: {
            ...currentDay[mealType],
            eaten: !wasEaten,
            note: note !== undefined ? note : currentDay[mealType]?.note,
            time: !wasEaten ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined
          }
        }
      };
    });
  };

  const updateWater = (count: number, date: string = selectedDate) => {
    setMealStatus((prev) => {
      const currentDay = prev[date] || {
        sarapan: { eaten: false },
        siang: { eaten: false },
        malam: { eaten: false },
        waterGlasses: 0
      };
      return {
        ...prev,
        [date]: {
          ...currentDay,
          waterGlasses: Math.max(0, count)
        }
      };
    });
  };

  // Push-Up Sets (Clean Slate)
  const [pushUpSets, setPushUpSets] = useState<PushUpSet[]>(() => {
    const saved = localStorage.getItem('rise_pushups_v2');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('rise_pushups_v2', JSON.stringify(pushUpSets));
  }, [pushUpSets]);

  const addPushUpSet = (reps: number, date: string = selectedDate) => {
    const newSet: PushUpSet = {
      id: 'p_' + Date.now(),
      date,
      reps,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setPushUpSets((prev) => [newSet, ...prev]);
  };

  const deletePushUpSet = (id: string) => {
    setPushUpSets((prev) => prev.filter((s) => s.id !== id));
  };

  // Weight Records (Clean Slate)
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>(() => {
    const saved = localStorage.getItem('rise_weights_v2');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('rise_weights_v2', JSON.stringify(weightRecords));
  }, [weightRecords]);

  const addWeightRecord = (weightKg: number, note?: string, date: string = selectedDate) => {
    setWeightRecords((prev) => {
      // Overwrite if same date already exists
      const filtered = prev.filter((w) => w.date !== date);
      const newRecord: WeightRecord = {
        id: 'w_' + Date.now(),
        date,
        weightKg,
        note
      };
      return [...filtered, newRecord].sort((a, b) => a.date.localeCompare(b.date));
    });
  };

  const deleteWeightRecord = (id: string) => {
    setWeightRecords((prev) => prev.filter((w) => w.id !== id));
  };

  // Daily Expenses (Clean Slate)
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem('rise_expenses_v1');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('rise_expenses_v1', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (
    amount: number,
    category: ExpenseCategory,
    note?: string,
    date: string = selectedDate
  ) => {
    const newExpense: ExpenseRecord = {
      id: 'exp_' + Date.now(),
      date,
      amount,
      category,
      note,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        updateUser,
        selectedDate,
        setSelectedDate,
        habits,
        toggleHabit,
        addHabit,
        updateHabit,
        deleteHabit,
        prayerTimes,
        prayerStatus,
        togglePrayer,
        mealStatus,
        toggleMeal,
        updateWater,
        pushUpSets,
        addPushUpSet,
        deletePushUpSet,
        weightRecords,
        addWeightRecord,
        deleteWeightRecord,
        expenses,
        addExpense,
        deleteExpense,
        activeTab,
        setActiveTab,
        isQuickModalOpen,
        setIsQuickModalOpen,
        quickModalTab,
        setQuickModalTab
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

