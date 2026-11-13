import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DateStrip } from '../components/DateStrip';
import { getNextPrayer } from '../utils/prayer';
import { 
  Moon, 
  Sun, 
  Sunrise, 
  Sunset, 
  CheckCircle2, 
  MapPin, 
  Utensils, 
  Plus, 
  Minus, 
  GlassWater,
  Edit2,
  Check
} from 'lucide-react';
import { DayPrayerStatus, MealType } from '../types';

export const PrayerMealView: React.FC = () => {
  const { 
    prayerTimes, 
    prayerStatus, 
    togglePrayer, 
    mealStatus, 
    toggleMeal, 
    updateWater, 
    selectedDate, 
    user,
    setActiveTab 
  } = useApp();

  const [editingMeal, setEditingMeal] = useState<MealType | null>(null);
  const [menuInput, setMenuInput] = useState('');

  const nextPrayer = getNextPrayer(prayerTimes);
  const currentPrayers = prayerStatus[selectedDate] || {
    subuh: false,
    dzuhur: false,
    ashar: false,
    maghrib: false,
    isya: false,
  };

  const currentMeals = mealStatus[selectedDate] || {
    sarapan: { eaten: false },
    siang: { eaten: false },
    malam: { eaten: false },
    waterGlasses: 0,
  };

  const prayerList: { id: keyof DayPrayerStatus; name: string; time: string; icon: any }[] = [
    { id: 'subuh', name: 'Subuh', time: prayerTimes.subuh, icon: Sunrise },
    { id: 'dzuhur', name: 'Dzuhur', time: prayerTimes.dzuhur, icon: Sun },
    { id: 'ashar', name: 'Ashar', time: prayerTimes.ashar, icon: Sun },
    { id: 'maghrib', name: 'Maghrib', time: prayerTimes.maghrib, icon: Sunset },
    { id: 'isya', name: 'Isya', time: prayerTimes.isya, icon: Moon },
  ];

  const completedPrayers = Object.values(currentPrayers).filter(Boolean).length;

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="px-6 pt-5 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-rise-espresso">Ibadah & Makan</h1>
          <p className="text-xs text-rise-muted mt-0.5">Pantau sholat 5 waktu & nutrisi harian</p>
        </div>
        <button
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-white border border-rise-border/80 rounded-full text-rise-espresso shadow-sm"
        >
          <MapPin className="w-3.5 h-3.5 text-[#2A9D8F]" />
          <span>{user.city}</span>
        </button>
      </div>

      <DateStrip />

      {/* Next Prayer Countdown Card */}
      <div className="px-5 py-2">
        <div className="rounded-3xl bg-gradient-to-br from-[#2D1F17] to-[#422C20] text-white p-5 shadow-card relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-rise-peach">
                Sholat Berikutnya
              </span>
              <h2 className="text-2xl font-bold mt-0.5 flex items-center gap-2">
                <span>{nextPrayer.name}</span>
                <span className="text-lg font-normal text-white/80">· {nextPrayer.time}</span>
              </h2>
              <p className="text-xs text-white/70 mt-1 font-medium">
                {nextPrayer.remainingMinutes > 60
                  ? `Sekitar ${Math.floor(nextPrayer.remainingMinutes / 60)} jam ${nextPrayer.remainingMinutes % 60} menit lagi`
                  : `${nextPrayer.remainingMinutes} menit lagi`}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Moon className="w-6 h-6 text-rise-peach" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/80">
            <span>Metode: Kemenag RI (Offline)</span>
            <span className="font-semibold text-rise-peach">Terbit: {prayerTimes.terbit}</span>
          </div>
        </div>
      </div>

      {/* Prayer Checklist Section */}
      <div className="px-5 py-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-rise-espresso flex items-center gap-2">
            <span>Checklist Sholat 5 Waktu</span>
          </h3>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E6F5F2] text-[#2A9D8F]">
            {completedPrayers}/5 Selesai
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {prayerList.map((prayer) => {
            const isDone = currentPrayers[prayer.id];
            const Icon = prayer.icon;

            return (
              <div
                key={prayer.id}
                onClick={() => togglePrayer(prayer.id, selectedDate)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-card active:scale-[0.99] ${
                  isDone
                    ? 'bg-white border-[#2A9D8F]/30 shadow-soft'
                    : 'bg-white border-rise-border/60 hover:border-rise-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isDone ? 'bg-[#E6F5F2] text-[#2A9D8F]' : 'bg-rise-bg text-rise-muted'
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-bold ${
                        isDone ? 'text-rise-espresso line-through text-rise-espresso/70' : 'text-rise-espresso'
                      }`}
                    >
                      {prayer.name}
                    </h4>
                    <span className="text-xs font-semibold text-rise-muted">{prayer.time} WIB</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-xl font-bold transition-colors ${
                    isDone ? 'bg-[#E6F5F2] text-[#2A9D8F]' : 'bg-rise-bg text-rise-muted border border-rise-border/60'
                  }`}>
                    {isDone ? 'Sudah Sholat' : 'Belum'}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isDone ? 'bg-[#2A9D8F] text-white shadow-sm' : 'border-2 border-rise-border'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hydration Tracker */}
      <div className="px-5 py-3">
        <div className="p-4 bg-white rounded-3xl border border-rise-border/60 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FFF1E8] text-[#E7784E] flex items-center justify-center">
                <GlassWater className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-rise-espresso">Pelacak Air Minum</h3>
                <p className="text-[11px] text-rise-muted font-medium">Target harian {user.waterDailyGoal || 8} gelas (~2 liter)</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-extrabold text-[#E7784E]">
                {currentMeals.waterGlasses}
              </span>
              <span className="text-xs text-rise-muted font-bold">/{user.waterDailyGoal || 8}</span>
            </div>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center justify-between bg-rise-bg/60 p-2.5 rounded-2xl">
            <button
              onClick={() => updateWater(currentMeals.waterGlasses - 1, selectedDate)}
              disabled={currentMeals.waterGlasses <= 0}
              className="w-10 h-10 rounded-xl bg-white border border-rise-border flex items-center justify-center text-rise-espresso active:scale-90 disabled:opacity-40 shadow-sm"
            >
              <Minus className="w-4 h-4" />
            </button>

            {/* Glasses Visual */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-2">
              {Array.from({ length: user.waterDailyGoal || 8 }).map((_, i) => (
                <div
                  key={i}
                  onClick={() => updateWater(i + 1, selectedDate)}
                  className={`cursor-pointer transition-all ${
                    i < currentMeals.waterGlasses
                      ? 'w-6 h-8 bg-[#E7784E] rounded-md flex items-center justify-center text-white text-[9px] font-bold shadow-xs'
                      : 'w-6 h-8 bg-white border-2 border-dashed border-rise-border rounded-md'
                  }`}
                >
                  💧
                </div>
              ))}
            </div>

            <button
              onClick={() => updateWater(currentMeals.waterGlasses + 1, selectedDate)}
              className="w-10 h-10 rounded-xl bg-[#362215] text-white flex items-center justify-center active:scale-90 shadow-sm"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Meals Tracker */}
      <div className="px-5 py-3">
        <h3 className="text-base font-bold text-rise-espresso mb-3 flex items-center gap-2">
          <Utensils className="w-4 h-4 text-[#D96B43]" />
          <span>Pengingat Makan Hari Ini</span>
        </h3>

        <div className="space-y-2.5">
          {[
            { key: 'sarapan' as const, label: 'Sarapan', preset: '06.30–07.30' },
            { key: 'susu_protein' as const, label: 'Susu Protein', preset: '09.30–10.00' },
            { key: 'siang' as const, label: 'Makan Siang', preset: '12.00–13.00' },
            { key: 'sore' as const, label: 'Makan Sore', preset: '15.30–16.30' },
            { key: 'malam' as const, label: 'Makan Malam', preset: '18.30–19.30' },
          ].map((meal) => {
            const data = currentMeals[meal.key];
            const isEaten = data?.eaten;
            const isEditing = editingMeal === meal.key;

            return (
              <div
                key={meal.key}
                className={`p-3.5 rounded-2xl border transition-all shadow-card ${
                  isEaten ? 'bg-white border-[#E8733E]/30' : 'bg-white border-rise-border/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div 
                    onClick={() => toggleMeal(meal.key, selectedDate)}
                    className="flex-1 cursor-pointer"
                  >
                    <h4 className={`text-sm font-bold ${isEaten ? 'text-rise-espresso line-through text-rise-espresso/70' : 'text-rise-espresso'}`}>
                      {meal.label}
                    </h4>
                    <p className="text-xs text-rise-muted font-medium mt-0.5">
                      Waktu disarankan: {meal.preset} WIB
                      {data?.time && <span className="text-[#E8733E] font-semibold"> · Dicatat jam {data.time}</span>}
                    </p>
                    {data?.note && (
                      <p className="text-[11px] text-[#558B55] mt-0.5 font-semibold">Menu: {data.note}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditingMeal(isEditing ? null : meal.key);
                        setMenuInput(data?.note || '');
                      }}
                      className="p-2 text-rise-muted hover:text-rise-espresso hover:bg-rise-bg rounded-xl transition-colors"
                      title="Tulis Menu"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleMeal(meal.key, selectedDate)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                        isEaten
                          ? 'bg-[#FFEADA] text-[#D96B43] shadow-2xs'
                          : 'bg-rise-bg text-rise-espresso border border-rise-border/80 hover:bg-white'
                      }`}
                    >
                      {isEaten ? '✓ Selesai' : 'Tandai Selesai'}
                    </button>
                  </div>
                </div>

                {/* Inline Menu Input */}
                {isEditing && (
                  <div className="mt-3 pt-3 border-t border-rise-border/60 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Tulis menu (cth: Oatmeal & Buah)"
                      value={menuInput}
                      onChange={(e) => setMenuInput(e.target.value)}
                      className="flex-1 h-10 px-3.5 text-xs font-semibold bg-rise-bg rounded-xl border border-rise-border text-rise-espresso focus:outline-none focus:border-rise-espresso"
                    />
                    <button
                      onClick={() => {
                        toggleMeal(meal.key, selectedDate, menuInput);
                        setEditingMeal(null);
                      }}
                      className="h-10 px-4 bg-[#362215] text-white rounded-xl text-xs font-bold shadow-2xs active:scale-95 flex items-center gap-1 hover:bg-[#25170E] transition-all"
                    >
                      <Check className="w-3.5 h-3.5" /> Simpan
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
