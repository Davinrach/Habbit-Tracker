import React, { useState } from 'react';
import { Header } from '../components/Header';
import { DateStrip } from '../components/DateStrip';
import { TimelineRoutine } from '../components/TimelineRoutine';
import { useApp } from '../context/AppContext';
import { getNextPrayer } from '../utils/prayer';
import { sound } from '../utils/sound';
import { setAndroidAlarm } from '../utils/alarm';
import { 
  Moon, 
  Dumbbell, 
  GlassWater, 
  Utensils, 
  Plus, 
  Minus, 
  Check, 
  ChevronRight,
  Bell
} from 'lucide-react';
import { DayPrayerStatus } from '../types';

export const TodayView: React.FC = () => {
  const {
    habits,
    prayerTimes,
    prayerStatus,
    togglePrayer,
    mealStatus,
    toggleMeal,
    updateWater,
    pushUpSets,
    addPushUpSet,
    selectedDate,
    user,
    setActiveTab,
  } = useApp();

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSetAlarm = (timeStr: string, title: string) => {
    const res = setAndroidAlarm(timeStr, title);
    setToastMsg(res.message);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const nextPrayer = getNextPrayer(prayerTimes);
  const todayPrayers = prayerStatus[selectedDate] || {
    subuh: false,
    dzuhur: false,
    ashar: false,
    maghrib: false,
    isya: false,
  };
  const completedPrayers = Object.values(todayPrayers).filter(Boolean).length;

  const todayMeals = mealStatus[selectedDate] || {
    sarapan: { eaten: false },
    susu_protein: { eaten: false },
    siang: { eaten: false },
    sore: { eaten: false },
    malam: { eaten: false },
    waterGlasses: 0,
  };

  const todayPushUps = pushUpSets
    .filter((s) => s.date === selectedDate)
    .reduce((sum, s) => sum + s.reps, 0);

  const completedHabits = habits.filter((h) => h.completedDates.includes(selectedDate)).length;

  // Total daily activities progress calculation
  const totalTasks = habits.length + 5 + 5 + 1; // habits + 5 prayers + 5 meals + pushups
  let completedTasks = completedHabits + completedPrayers;
  if (todayMeals.sarapan?.eaten) completedTasks++;
  if (todayMeals.susu_protein?.eaten) completedTasks++;
  if (todayMeals.siang?.eaten) completedTasks++;
  if (todayMeals.sore?.eaten) completedTasks++;
  if (todayMeals.malam?.eaten) completedTasks++;
  if (todayPushUps >= (user.pushUpDailyGoal || 50)) completedTasks++;

  const overallProgressPercent = Math.min(100, Math.round((completedTasks / totalTasks) * 100));

  const handlePrayerToggle = (p: keyof DayPrayerStatus) => {
    togglePrayer(p, selectedDate);
    sound.playCheck();
  };

  const handleWaterAdd = () => {
    updateWater((todayMeals.waterGlasses || 0) + 1, selectedDate);
    sound.playCheck();
  };

  const handleWaterSub = () => {
    if ((todayMeals.waterGlasses || 0) > 0) {
      updateWater((todayMeals.waterGlasses || 0) - 1, selectedDate);
    }
  };

  const handlePushUpAdd = (reps: number) => {
    addPushUpSet(reps, selectedDate);
    sound.playCheck();
  };

  const prayersList: { id: keyof DayPrayerStatus; name: string; time: string }[] = [
    { id: 'subuh', name: 'Subuh', time: prayerTimes.subuh },
    { id: 'dzuhur', name: 'Dzuhur', time: prayerTimes.dzuhur },
    { id: 'ashar', name: 'Ashar', time: prayerTimes.ashar },
    { id: 'maghrib', name: 'Maghrib', time: prayerTimes.maghrib },
    { id: 'isya', name: 'Isya', time: prayerTimes.isya },
  ];

  return (
    <div className="pb-28 space-y-4">
      {/* 1. Header */}
      <Header />

      {/* 2. Date Strip Navigation */}
      <DateStrip />

      {/* 3. Hero Command Center: Overview Progres Hari Ini */}
      <div className="px-5">
        <div className="p-5 rounded-3xl bg-white border border-rise-border/80 shadow-card relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[11px] font-bold text-rise-muted uppercase tracking-wider block">
                Ringkasan Capaian Hari Ini
              </span>
              <h2 className="text-xl font-extrabold text-rise-espresso mt-0.5">
                {overallProgressPercent === 100
                  ? '🎉 Target Hari Ini Selesai!'
                  : overallProgressPercent >= 50
                  ? '🔥 Progres Sangat Baik!'
                  : '🌱 Mulai Hari dengan Teratur'}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#E8733E]">
                {overallProgressPercent}%
              </span>
              <span className="text-[10px] font-semibold text-rise-muted block">
                {completedTasks}/{totalTasks} Selesai
              </span>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="w-full bg-[#EFE9DF] h-2.5 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-[#FF7A59] to-[#E8733E] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${overallProgressPercent}%` }}
            />
          </div>

          {/* 4 Summary Stat Pills */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-rise-border/60 text-center">
            {/* Rutinitas */}
            <div 
              onClick={() => setActiveTab('schedule')}
              className="p-2 rounded-2xl bg-rise-bg/60 hover:bg-rise-bg transition-colors cursor-pointer"
            >
              <span className="text-[10px] font-bold text-rise-muted block">Rutinitas</span>
              <span className="text-sm font-extrabold text-rise-espresso mt-0.5 block">
                {completedHabits}/{habits.length}
              </span>
            </div>

            {/* Sholat */}
            <div 
              onClick={() => setActiveTab('worship')}
              className="p-2 rounded-2xl bg-[#E6F5F2]/60 hover:bg-[#E6F5F2] transition-colors cursor-pointer"
            >
              <span className="text-[10px] font-bold text-[#2A9D8F] block">Sholat</span>
              <span className="text-sm font-extrabold text-rise-espresso mt-0.5 block">
                {completedPrayers}/5
              </span>
            </div>

            {/* Air */}
            <div 
              onClick={() => setActiveTab('worship')}
              className="p-2 rounded-2xl bg-[#FFF1E8]/60 hover:bg-[#FFF1E8] transition-colors cursor-pointer"
            >
              <span className="text-[10px] font-bold text-[#E7784E] block">Minum</span>
              <span className="text-sm font-extrabold text-rise-espresso mt-0.5 block">
                {todayMeals.waterGlasses}/{user.waterDailyGoal || 8}
              </span>
            </div>

            {/* Push Up */}
            <div 
              onClick={() => setActiveTab('fitness')}
              className="p-2 rounded-2xl bg-[#FFEFEA]/60 hover:bg-[#FFEFEA] transition-colors cursor-pointer"
            >
              <span className="text-[10px] font-bold text-[#E25822] block">Push Up</span>
              <span className="text-sm font-extrabold text-rise-espresso mt-0.5 block">
                {todayPushUps}x
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Smart Interactive Action Cards (Widgets) */}
      <div className="px-5 space-y-3">
        {/* Sholat 5 Waktu Interactive Card */}
        <div className="p-4 rounded-3xl bg-white border border-rise-border/80 shadow-card">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E6F5F2] text-[#2A9D8F] flex items-center justify-center">
                <Moon className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-rise-espresso">Jadwal Sholat ({user.city})</h3>
                <p className="text-[11px] font-semibold text-[#2A9D8F]">
                  Berikutnya: {nextPrayer.name} ({nextPrayer.time} WIB) · {nextPrayer.remainingMinutes > 60 ? `${Math.floor(nextPrayer.remainingMinutes / 60)}j ${nextPrayer.remainingMinutes % 60}m` : `${nextPrayer.remainingMinutes}m`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleSetAlarm(nextPrayer.time, `Sholat ${nextPrayer.name}`)}
                className="p-1.5 text-rise-muted hover:text-[#E8733E] hover:bg-[#FFEADA]/60 rounded-lg transition-colors active:scale-90"
                title={`Pasang Alarm Jam HP untuk ${nextPrayer.name} (${nextPrayer.time})`}
              >
                <Bell className="w-4 h-4 text-[#E8733E]" />
              </button>
              <button
                onClick={() => setActiveTab('worship')}
                className="text-rise-muted hover:text-rise-espresso p-1.5 rounded-lg hover:bg-rise-bg transition-colors"
                title="Lihat Tab Ibadah"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 5 Sholat Quick Toggle Buttons */}
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {prayersList.map((p) => {
              const isDone = todayPrayers[p.id];
              return (
                <button
                  key={p.id}
                  onClick={() => handlePrayerToggle(p.id)}
                  className={`py-2 px-1 rounded-xl text-center border transition-all active:scale-95 flex flex-col items-center justify-center ${
                    isDone
                      ? 'bg-[#E6F5F2] border-[#2A9D8F]/40 text-[#2A9D8F] font-bold shadow-2xs'
                      : 'bg-rise-bg/60 border-rise-border/80 text-rise-espresso/70 hover:bg-white'
                  }`}
                >
                  <span className="text-[10px] font-bold block">{p.name}</span>
                  <span className="text-[9px] text-rise-muted font-medium mt-0.5 block">{p.time}</span>
                  <div className={`w-4 h-4 rounded-full mt-1 flex items-center justify-center transition-colors ${
                    isDone ? 'bg-[#2A9D8F] text-white' : 'border border-rise-border bg-white'
                  }`}>
                    {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Grid: Hydration & Push Up Quick Counter */}
        <div className="grid grid-cols-2 gap-3">
          {/* Hydration Widget */}
          <div className="p-4 rounded-3xl bg-white border border-rise-border/80 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-[#FFF1E8] text-[#E7784E] flex items-center justify-center">
                  <GlassWater className="w-4 h-4 stroke-[2]" />
                </div>
                <span className="text-[10px] font-bold text-[#E7784E]">
                  Target {user.waterDailyGoal || 8}
                </span>
              </div>
              <h4 className="text-xs font-bold text-rise-espresso">Minum Air</h4>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-rise-espresso">
                  {todayMeals.waterGlasses}
                </span>
                <span className="text-xs font-semibold text-rise-muted">gelas</span>
              </div>
            </div>

            {/* Interactive Counter Buttons */}
            <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-rise-border/50">
              <button
                onClick={handleWaterSub}
                className="w-9 h-9 rounded-xl bg-rise-bg border border-rise-border flex items-center justify-center text-rise-espresso active:scale-90 transition-transform font-bold flex-shrink-0"
                title="Kurangi 1 gelas"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleWaterAdd}
                className="h-9 flex-1 bg-[#E7784E] text-white rounded-xl text-xs font-bold shadow-2xs active:scale-95 transition-transform flex items-center justify-center gap-1 hover:bg-[#D96B43]"
                title="Tambah 1 gelas"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>+1 Gelas</span>
              </button>
            </div>
          </div>

          {/* Push Up Widget */}
          <div className="p-4 rounded-3xl bg-white border border-rise-border/80 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-[#FFEFEA] text-[#E25822] flex items-center justify-center">
                  <Dumbbell className="w-4 h-4 stroke-[2]" />
                </div>
                <span className="text-[10px] font-bold text-[#E25822]">
                  Target {user.pushUpDailyGoal || 50}x
                </span>
              </div>
              <h4 className="text-xs font-bold text-rise-espresso">Push Up</h4>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-rise-espresso">
                  {todayPushUps}
                </span>
                <span className="text-xs font-semibold text-rise-muted">reps</span>
              </div>
            </div>

            {/* Interactive Quick Add Buttons */}
            <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-rise-border/50">
              <button
                onClick={() => handlePushUpAdd(5)}
                className="h-9 flex-1 bg-rise-bg border border-rise-border hover:bg-[#FFEADA] text-rise-espresso rounded-xl text-xs font-bold active:scale-95 transition-transform flex items-center justify-center"
              >
                +5
              </button>
              <button
                onClick={() => handlePushUpAdd(10)}
                className="h-9 flex-1 bg-[#E25822] text-white rounded-xl text-xs font-bold shadow-2xs active:scale-95 transition-transform flex items-center justify-center hover:bg-[#CC4714]"
              >
                +10
              </button>
            </div>
          </div>
        </div>

        {/* Meals Quick Action Strip */}
        <div className="p-3.5 rounded-3xl bg-white border border-rise-border/80 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FFF3D6] text-[#D48B00] flex items-center justify-center flex-shrink-0">
                <Utensils className="w-3.5 h-3.5 stroke-[2]" />
              </div>
              <h4 className="text-xs font-bold text-rise-espresso">Jadwal Makan Hari Ini</h4>
            </div>
            <span className="text-[10px] font-semibold text-rise-muted">5 Sesi</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {[
              { id: 'sarapan' as const, label: 'Sarapan', time: '06.30' },
              { id: 'susu_protein' as const, label: 'Protein', time: '09.30' },
              { id: 'siang' as const, label: 'Siang', time: '12.00' },
              { id: 'sore' as const, label: 'Sore', time: '15.30' },
              { id: 'malam' as const, label: 'Malam', time: '18.30' },
            ].map((m) => {
              const isEaten = todayMeals[m.id]?.eaten;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    toggleMeal(m.id, selectedDate);
                    sound.playCheck();
                  }}
                  className={`py-2 px-1 rounded-xl text-center border transition-all active:scale-95 flex flex-col items-center justify-center ${
                    isEaten
                      ? 'bg-[#EAF5EE] text-[#558B55] border-[#558B55]/40 font-bold shadow-2xs'
                      : 'bg-rise-bg/60 border-rise-border/80 text-rise-espresso/70 hover:bg-white'
                  }`}
                >
                  <span className="text-[10px] font-bold block leading-tight">{m.label}</span>
                  <span className="text-[9px] text-rise-muted font-medium mt-0.5 block">{m.time}</span>
                  <div className={`w-3.5 h-3.5 rounded-full mt-1 flex items-center justify-center transition-colors ${
                    isEaten ? 'bg-[#558B55] text-white' : 'border border-rise-border bg-white'
                  }`}>
                    {isEaten && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Daily Routine Timeline Section */}
      <TimelineRoutine />

      {/* Floating Toast Feedback for Android Alarm */}
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm bg-[#362215] text-white px-4 py-3 rounded-2xl shadow-float border border-white/10 flex items-center gap-3 animate-fade-in text-xs font-semibold">
          <Bell className="w-4 h-4 text-[#E8733E] flex-shrink-0 animate-bounce" />
          <span className="flex-1">{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
