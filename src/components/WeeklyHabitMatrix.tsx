import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Check, 
  Flame, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Moon,
  GlassWater,
  Dumbbell,
  Utensils,
  Wallet,
  Plus
} from 'lucide-react';
import { sound } from '../utils/sound';

export const WeeklyHabitMatrix: React.FC = () => {
  const {
    habits,
    toggleHabit,
    setSelectedDate,
    prayerStatus,
    mealStatus,
    pushUpSets,
    expenses,
    user,
    setIsQuickModalOpen,
    setQuickModalTab
  } = useApp();

  // Week offset relative to selectedDate or current week (0 = current week, -1 = last week, etc.)
  const [weekOffset, setWeekOffset] = useState<number>(0);

  // Calculate 7 days for the selected week
  const weekDays = useMemo(() => {
    const base = new Date();
    // Apply weekOffset
    base.setDate(base.getDate() + weekOffset * 7);

    // Find Monday of this week (0=Sun, 1=Mon, ..., 6=Sat)
    const day = base.getDay();
    const diffToMonday = base.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(base.setDate(diffToMonday));

    const dayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const days = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const dateNum = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${dateNum}`;

      days.push({
        name: dayNames[i],
        dayNumber: d.getDate(),
        fullDate: dateStr,
        isToday: dateStr === new Date().toISOString().slice(0, 10),
      });
    }
    return days;
  }, [weekOffset]);

  // Formatted Week Title
  const weekTitle = useMemo(() => {
    if (weekDays.length === 0) return '';
    const first = new Date(weekDays[0].fullDate);
    const last = new Date(weekDays[6].fullDate);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    return `${first.getDate()} ${months[first.getMonth()]} - ${last.getDate()} ${months[last.getMonth()]} ${last.getFullYear()}`;
  }, [weekDays]);

  // Build matrix rows: custom habits + core tracked activities
  interface MatrixRow {
    id: string;
    title: string;
    category: string;
    icon?: React.ComponentType<{ className?: string }>;
    isCustom: boolean;
    isCompletedOnDate: (dateStr: string) => boolean;
  }

  const matrixRows: MatrixRow[] = useMemo(() => {
    const rows: MatrixRow[] = [];

    // 1. User Custom Habits
    habits.forEach((h) => {
      rows.push({
        id: h.id,
        title: h.title,
        category: h.category,
        isCustom: true,
        isCompletedOnDate: (d) => h.completedDates.includes(d),
      });
    });

    // 2. Core Tracking: Sholat 5 Waktu
    rows.push({
      id: 'core_prayer',
      title: 'Sholat 5 Waktu',
      category: 'prayer',
      icon: Moon,
      isCustom: false,
      isCompletedOnDate: (d) => {
        const p = prayerStatus[d];
        if (!p) return false;
        return Boolean(p.subuh && p.dzuhur && p.ashar && p.maghrib && p.isya);
      },
    });

    // 3. Core Tracking: Minum Air
    rows.push({
      id: 'core_water',
      title: `Minum Air (${user.waterDailyGoal || 8} Gelas)`,
      category: 'water',
      icon: GlassWater,
      isCustom: false,
      isCompletedOnDate: (d) => {
        const m = mealStatus[d];
        return Boolean(m && (m.waterGlasses || 0) >= (user.waterDailyGoal || 8));
      },
    });

    // 4. Core Tracking: Push Up
    rows.push({
      id: 'core_pushup',
      title: `Push Up (${user.pushUpDailyGoal || 50}x)`,
      category: 'fitness',
      icon: Dumbbell,
      isCustom: false,
      isCompletedOnDate: (d) => {
        const reps = pushUpSets
          .filter((s) => s.date === d)
          .reduce((sum, s) => sum + s.reps, 0);
        return reps >= (user.pushUpDailyGoal || 50);
      },
    });

    // 5. Core Tracking: Makan Teratur (minimal 3 sesi)
    rows.push({
      id: 'core_meal',
      title: 'Makan Teratur (3+ Sesi)',
      category: 'meal',
      icon: Utensils,
      isCustom: false,
      isCompletedOnDate: (d) => {
        const m = mealStatus[d];
        if (!m) return false;
        let count = 0;
        if (m.sarapan?.eaten) count++;
        if (m.susu_protein?.eaten) count++;
        if (m.siang?.eaten) count++;
        if (m.sore?.eaten) count++;
        if (m.malam?.eaten) count++;
        return count >= 3;
      },
    });

    // 6. Core Tracking: Tabungan Aman (Hemat)
    rows.push({
      id: 'core_finance',
      title: 'Tabungan Aman (Hemat)',
      category: 'finance',
      icon: Wallet,
      isCustom: false,
      isCompletedOnDate: (d) => {
        const dayExp = expenses
          .filter((e) => e.date === d && (e.type || 'expense') === 'expense')
          .reduce((sum, e) => sum + e.amount, 0);
        const pocket = user.dailyPocketMoney || 80000;
        // Check if there was activity and spent <= budget
        return dayExp <= pocket;
      },
    });

    return rows;
  }, [habits, prayerStatus, mealStatus, pushUpSets, expenses, user]);

  // Overall Weekly Calculations
  const stats = useMemo(() => {
    let totalPossible = matrixRows.length * 7;
    let totalDone = 0;

    matrixRows.forEach((row) => {
      weekDays.forEach((day) => {
        if (row.isCompletedOnDate(day.fullDate)) {
          totalDone++;
        }
      });
    });

    const completionRate = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

    // Calculate maximum current streak among habits
    const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);

    return {
      completionRate,
      totalDone,
      totalPossible,
      activeHabits: matrixRows.length,
      maxStreak,
    };
  }, [matrixRows, weekDays, habits]);

  // Handle cell click (toggle habit on date)
  const handleCellClick = (row: MatrixRow, fullDate: string) => {
    if (row.isCustom) {
      toggleHabit(row.id, fullDate);
      sound.playCheck();
    } else {
      // If clicking a core row, switch selectedDate so user can view/manage
      setSelectedDate(fullDate);
    }
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-rise-border/80 shadow-card space-y-4">
      {/* 1. Header with Week Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-rise-muted text-[11px] font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-[#E8733E]" />
            <span>Rekap Mingguan</span>
          </div>
          <h3 className="text-base font-extrabold text-rise-espresso mt-0.5">
            {weekTitle}
          </h3>
        </div>

        {/* Prev / Next Week Controls */}
        <div className="flex items-center gap-1 bg-rise-bg p-1 rounded-2xl border border-rise-border/60">
          <button
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="w-7 h-7 rounded-xl flex items-center justify-center text-rise-espresso hover:bg-white active:scale-95 transition-all"
            title="Minggu Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all ${
              weekOffset === 0
                ? 'bg-white text-rise-espresso shadow-2xs'
                : 'text-rise-muted hover:text-rise-espresso'
            }`}
          >
            Sekarang
          </button>
          <button
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className="w-7 h-7 rounded-xl flex items-center justify-center text-rise-espresso hover:bg-white active:scale-95 transition-all"
            title="Minggu Berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards (Matching user's reference image style) */}
      <div className="grid grid-cols-4 gap-2 text-center">
        {/* Completion % */}
        <div className="p-2.5 rounded-2xl bg-rise-bg/70 border border-rise-border/60">
          <span className="text-[9px] font-bold text-rise-muted uppercase tracking-wider block">
            Capaian
          </span>
          <span className="text-base font-black text-[#E8733E] mt-0.5 block">
            {stats.completionRate}%
          </span>
        </div>

        {/* Day Streak */}
        <div className="p-2.5 rounded-2xl bg-[#FFF3E8]/80 border border-[#E8733E]/20">
          <span className="text-[9px] font-bold text-[#E8733E] uppercase tracking-wider block flex items-center justify-center gap-0.5">
            <Flame className="w-2.5 h-2.5 stroke-[2.5]" /> Streak
          </span>
          <span className="text-base font-black text-rise-espresso mt-0.5 block">
            {stats.maxStreak} Hari
          </span>
        </div>

        {/* Checks Total */}
        <div className="p-2.5 rounded-2xl bg-[#EAF5EE]/80 border border-[#2A9D8F]/20">
          <span className="text-[9px] font-bold text-[#2A9D8F] uppercase tracking-wider block">
            Checklist
          </span>
          <span className="text-base font-black text-[#2A9D8F] mt-0.5 block">
            {stats.totalDone}
          </span>
        </div>

        {/* Active Habits */}
        <div className="p-2.5 rounded-2xl bg-rise-bg/70 border border-rise-border/60">
          <span className="text-[9px] font-bold text-rise-muted uppercase tracking-wider block">
            Rutinitas
          </span>
          <span className="text-base font-black text-rise-espresso mt-0.5 block">
            {stats.activeHabits}
          </span>
        </div>
      </div>

      {/* 3. The Habit Matrix Grid Table */}
      <div className="overflow-x-auto no-scrollbar -mx-2 px-2 pt-1">
        <table className="w-full border-collapse min-w-[340px]">
          {/* Table Header: Habit column + 7 Days + Rate */}
          <thead>
            <tr className="border-b border-rise-border/60 text-center">
              <th className="text-left pb-2.5 text-[11px] font-bold text-rise-muted tracking-tight w-28 sm:w-36">
                Aktivitas
              </th>
              {weekDays.map((d) => (
                <th key={d.fullDate} className="pb-2.5 px-0.5 text-center">
                  <div className={`flex flex-col items-center justify-center rounded-xl py-1 px-0.5 transition-all ${
                    d.isToday 
                      ? 'bg-[#362215] text-white font-bold shadow-2xs' 
                      : 'text-rise-espresso'
                  }`}>
                    <span className="text-[10px] font-bold block">{d.name}</span>
                    <span className={`text-[9px] font-medium block ${d.isToday ? 'text-white/80' : 'text-rise-muted'}`}>
                      {d.dayNumber}
                    </span>
                  </div>
                </th>
              ))}
              <th className="pb-2.5 pl-1.5 text-center text-[10px] font-bold text-rise-muted w-10">
                Laju
              </th>
            </tr>
          </thead>

          {/* Table Body: Each activity row */}
          <tbody className="divide-y divide-rise-border/40">
            {matrixRows.map((row) => {
              // Calculate row rate
              const completedDaysCount = weekDays.filter((d) => row.isCompletedOnDate(d.fullDate)).length;
              const rowPercent = Math.round((completedDaysCount / 7) * 100);

              const RowIcon = row.icon || Sparkles;

              return (
                <tr key={row.id} className="group hover:bg-rise-bg/40 transition-colors">
                  {/* Activity Name */}
                  <td className="py-2.5 pr-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-rise-bg border border-rise-border/60 flex items-center justify-center text-rise-espresso flex-shrink-0">
                        <RowIcon className="w-3.5 h-3.5 text-[#E8733E]" />
                      </div>
                      <span className="text-xs font-bold text-rise-espresso truncate max-w-[110px] sm:max-w-[140px] block" title={row.title}>
                        {row.title}
                      </span>
                    </div>
                  </td>

                  {/* 7 Checkbox Days */}
                  {weekDays.map((day) => {
                    const isDone = row.isCompletedOnDate(day.fullDate);
                    return (
                      <td key={day.fullDate} className="py-2.5 px-0.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleCellClick(row, day.fullDate)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 mx-auto rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                            isDone
                              ? 'bg-[#E8733E] text-white shadow-2xs ring-1 ring-[#E8733E]/20 scale-100'
                              : 'bg-rise-bg/80 border border-rise-border/80 text-transparent hover:border-[#E8733E]/50'
                          }`}
                          title={`${row.title} - ${day.name} ${day.dayNumber} (${isDone ? 'Selesai' : 'Belum'})`}
                        >
                          <Check className={`w-3.5 h-3.5 stroke-[3] transition-opacity ${
                            isDone ? 'opacity-100' : 'opacity-0'
                          }`} />
                        </button>
                      </td>
                    );
                  })}

                  {/* Row Completion Rate */}
                  <td className="py-2.5 pl-1.5 text-center">
                    <span className={`text-[10px] font-extrabold ${
                      rowPercent === 100
                        ? 'text-[#2A9D8F]'
                        : rowPercent >= 50
                        ? 'text-rise-espresso'
                        : 'text-rise-muted'
                    }`}>
                      {completedDaysCount}/7
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Quick Add Habit Hint */}
      <div className="pt-2 border-t border-rise-border/60 flex items-center justify-between">
        <span className="text-[11px] text-rise-muted font-medium">
          💡 Ketuk kotak untuk mencentang rutinitas
        </span>
        <button
          onClick={() => {
            setQuickModalTab('habit');
            setIsQuickModalOpen(true);
          }}
          className="text-xs font-bold text-[#E8733E] hover:underline flex items-center gap-1 active:scale-95 transition-transform"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Tambah Baru</span>
        </button>
      </div>
    </div>
  );
};
