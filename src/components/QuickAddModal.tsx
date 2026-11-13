import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, Dumbbell, Scale, Utensils, Check, Wallet } from 'lucide-react';
import { HabitCategory, ExpenseCategory } from '../types';

export const QuickAddModal: React.FC = () => {
  const {
    isQuickModalOpen,
    setIsQuickModalOpen,
    quickModalTab,
    setQuickModalTab,
    addHabit,
    addPushUpSet,
    addWeightRecord,
    addExpense,
    toggleMeal,
    selectedDate
  } = useApp();

  // Habit Form
  const [habitTitle, setHabitTitle] = useState('');
  const [habitCategory, setHabitCategory] = useState<HabitCategory>('custom');
  const [habitDuration, setHabitDuration] = useState('10');
  const [habitTime, setHabitTime] = useState('08:00');
  const [habitNotes, setHabitNotes] = useState('');

  // Pushup Form
  const [pushUpReps, setPushUpReps] = useState('20');

  // Weight Form
  const [weightKg, setWeightKg] = useState('70');
  const [weightNote, setWeightNote] = useState('');

  // Expense Form
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('food');
  const [expenseNote, setExpenseNote] = useState('');

  if (!isQuickModalOpen) return null;

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitTitle.trim()) return;

    addHabit({
      title: habitTitle.trim(),
      category: habitCategory,
      durationMinutes: parseInt(habitDuration) || 5,
      timeTarget: habitTime,
      notes: habitNotes.trim(),
    });

    setHabitTitle('');
    setHabitNotes('');
    setIsQuickModalOpen(false);
  };

  const handleAddPushUp = (reps: number) => {
    addPushUpSet(reps, selectedDate);
    setIsQuickModalOpen(false);
  };

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(weightKg);
    if (!isNaN(val) && val > 0) {
      addWeightRecord(val, weightNote, selectedDate);
      setIsQuickModalOpen(false);
    }
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(expenseAmount.replace(/\D/g, ''), 10);
    if (!isNaN(val) && val > 0) {
      addExpense(val, expenseCategory, expenseNote.trim(), selectedDate);
      setExpenseAmount('');
      setExpenseNote('');
      setIsQuickModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-rise-border/80 max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-rise-border/60">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-rise-espresso">Catat Cepat</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rise-peach text-rise-espresso">
              {selectedDate}
            </span>
          </div>
          <button
            onClick={() => setIsQuickModalOpen(false)}
            className="w-8 h-8 rounded-full bg-rise-bg flex items-center justify-center text-rise-muted hover:text-rise-espresso active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selection in modal */}
        <div className="flex items-center gap-1.5 py-3 border-b border-rise-border/40 overflow-x-auto no-scrollbar">
          {[
            { id: 'expense' as const, label: 'Uang', icon: Wallet },
            { id: 'habit' as const, label: 'Rutinitas', icon: Sparkles },
            { id: 'pushup' as const, label: 'Push Up', icon: Dumbbell },
            { id: 'weight' as const, label: 'Timbangan', icon: Scale },
            { id: 'meal' as const, label: 'Makan', icon: Utensils },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = quickModalTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setQuickModalTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#362215] text-white shadow-xs'
                    : 'bg-rise-bg text-rise-muted hover:text-rise-espresso'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. Habit Form */}
        {quickModalTab === 'habit' && (
          <form onSubmit={handleAddHabit} className="py-4 space-y-3">
            <div>
              <label className="text-xs font-semibold text-rise-muted block mb-1">
                Nama Rutinitas
              </label>
              <input
                type="text"
                placeholder="Cth: Baca Buku 15 Menit"
                value={habitTitle}
                onChange={(e) => setHabitTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-rise-bg border border-rise-border text-sm font-semibold text-rise-espresso focus:outline-none focus:border-rise-espresso"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-rise-muted block mb-1">
                Kategori
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'water', label: '💧 Air' },
                  { id: 'meditate', label: '🧘 Mindset' },
                  { id: 'stretch', label: '🤸 Stretch' },
                  { id: 'walk', label: '🚶 Jalan' },
                  { id: 'fitness', label: '💪 Olahraga' },
                  { id: 'custom', label: '⭐ Lainnya' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setHabitCategory(cat.id as HabitCategory)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      habitCategory === cat.id
                        ? 'bg-[#FFEADA] border-[#FCD2B8] text-rise-espresso font-bold shadow-2xs'
                        : 'bg-white border-rise-border text-rise-muted hover:bg-rise-bg'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-rise-muted block mb-1">
                  Durasi (Menit)
                </label>
                <input
                  type="number"
                  value={habitDuration}
                  onChange={(e) => setHabitDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-rise-bg border border-rise-border text-sm font-semibold text-rise-espresso focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-rise-muted block mb-1">
                  Target Waktu (Jam)
                </label>
                <input
                  type="time"
                  value={habitTime}
                  onChange={(e) => setHabitTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-rise-bg border border-rise-border text-sm font-semibold text-rise-espresso focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-rise-muted block mb-1">
                Catatan Opsional
              </label>
              <input
                type="text"
                placeholder="Tips atau catatan pengingat"
                value={habitNotes}
                onChange={(e) => setHabitNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-rise-bg border border-rise-border text-xs text-rise-espresso focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-2 bg-[#362215] text-white font-bold text-sm rounded-xl shadow-sm active:scale-95 transition-all"
            >
              + Simpan Rutinitas
            </button>
          </form>
        )}

        {/* 2. Push Up Quick Form */}
        {quickModalTab === 'pushup' && (
          <div className="py-4 space-y-4">
            <p className="text-xs text-rise-muted font-medium">
              Pilih jumlah reps untuk dicatat ke riwayat set hari ini:
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {[5, 10, 15, 20, 25, 30].map((reps) => (
                <button
                  key={reps}
                  onClick={() => handleAddPushUp(reps)}
                  className="py-3 rounded-2xl bg-rise-bg border border-rise-border font-bold text-sm text-rise-espresso hover:bg-[#FFEFEA] hover:border-[#FCD2B8] active:scale-95 transition-all flex flex-col items-center gap-0.5"
                >
                  <span className="text-base font-extrabold text-[#E25822]">+{reps}</span>
                  <span className="text-[10px] text-rise-muted font-semibold">reps</span>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-rise-border/60">
              <label className="text-xs font-semibold text-rise-muted block mb-1.5">
                Atau masukkan angka manual:
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Jumlah reps"
                  value={pushUpReps}
                  onChange={(e) => setPushUpReps(e.target.value)}
                  className="flex-1 h-11 px-3.5 bg-rise-bg rounded-xl border border-rise-border text-sm font-semibold text-rise-espresso focus:outline-none"
                />
                <button
                  onClick={() => handleAddPushUp(parseInt(pushUpReps) || 10)}
                  className="h-11 px-5 bg-[#E25822] text-white font-bold text-xs rounded-xl shadow-sm active:scale-95 hover:bg-[#CC4714] transition-all flex items-center justify-center"
                >
                  Catat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Weight Form */}
        {quickModalTab === 'weight' && (
          <form onSubmit={handleAddWeight} className="py-4 space-y-3">
            <div>
              <label className="text-xs font-semibold text-rise-muted block mb-1">
                Berat Badan Hari Ini (kg)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="68.5"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full h-12 px-3.5 rounded-xl bg-rise-bg border border-rise-border text-lg font-bold text-rise-espresso focus:outline-none"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-rise-muted block mb-1">
                Catatan (opsional)
              </label>
              <input
                type="text"
                placeholder="Misal: Timbang pagi sebelum sarapan"
                value={weightNote}
                onChange={(e) => setWeightNote(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-rise-bg border border-rise-border text-xs text-rise-espresso focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full h-12 bg-[#362215] text-white font-bold text-sm rounded-xl shadow-sm active:scale-95 transition-all hover:bg-[#25170E] flex items-center justify-center"
            >
              Simpan Timbangan
            </button>
          </form>
        )}

        {/* 4. Meal Quick Check */}
        {quickModalTab === 'meal' && (
          <div className="py-4 space-y-3">
            <p className="text-xs text-rise-muted font-medium mb-1">
              Ketuk untuk menandai waktu makan yang sudah Anda selesaikan:
            </p>
            {[
              { id: 'sarapan' as const, label: 'Sarapan (06.30–07.30)' },
              { id: 'susu_protein' as const, label: 'Susu Protein (09.30–10.00)' },
              { id: 'siang' as const, label: 'Makan Siang (12.00–13.00)' },
              { id: 'sore' as const, label: 'Makan Sore (15.30–16.30)' },
              { id: 'malam' as const, label: 'Makan Malam (18.30–19.30)' },
            ].map((meal) => (
              <button
                key={meal.id}
                onClick={() => {
                  toggleMeal(meal.id, selectedDate);
                  setIsQuickModalOpen(false);
                }}
                className="w-full p-3.5 rounded-2xl bg-rise-bg border border-rise-border font-bold text-xs text-rise-espresso hover:bg-[#FFEADA] active:scale-95 transition-all flex items-center justify-between"
              >
                <span>{meal.label}</span>
                <span className="text-[#D96B43] flex items-center gap-1">
                  <Check className="w-4 h-4" /> Tandai Selesai
                </span>
              </button>
            ))}
          </div>
        )}

        {/* 5. Expense Form */}
        {quickModalTab === 'expense' && (
          <form onSubmit={handleAddExpense} className="py-4 space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-rise-muted block mb-1">
                Nominal Pengeluaran (Rp)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-xs font-bold text-rise-muted">Rp</span>
                <input
                  type="number"
                  placeholder="Cth: 15000"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full h-12 pl-10 pr-3.5 rounded-xl bg-rise-bg border border-rise-border text-base font-bold text-rise-espresso focus:outline-none focus:border-rise-espresso"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Quick chips */}
            <div className="grid grid-cols-3 gap-1.5">
              {[5000, 10000, 15000, 20000, 25000, 50000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setExpenseAmount(amt.toString())}
                  className="py-1.5 px-2 bg-rise-bg hover:bg-[#FFEADA] border border-rise-border/70 rounded-xl text-xs font-bold text-rise-espresso active:scale-95 transition-all text-center"
                >
                  +{amt.toLocaleString('id-ID')}
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs font-semibold text-rise-muted block mb-1">
                Kategori
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'food' as const, label: '🍱 Makan' },
                  { id: 'snack' as const, label: '🧋 Jajan' },
                  { id: 'transport' as const, label: '🛵 Transport' },
                  { id: 'bills' as const, label: '📦 Belanja' },
                  { id: 'lifestyle' as const, label: '🎮 Hiburan' },
                  { id: 'other' as const, label: '💸 Lainnya' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setExpenseCategory(cat.id)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      expenseCategory === cat.id
                        ? 'bg-[#362215] text-white border-[#362215] shadow-xs'
                        : 'bg-white border-rise-border text-rise-muted hover:bg-rise-bg'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-rise-muted block mb-1">
                Catatan (opsional)
              </label>
              <input
                type="text"
                placeholder="Misal: Nasi uduk sarapan"
                value={expenseNote}
                onChange={(e) => setExpenseNote(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-rise-bg border border-rise-border text-xs text-rise-espresso focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#362215] text-white font-bold text-sm rounded-xl shadow-sm active:scale-95 transition-all hover:bg-[#25170E] flex items-center justify-center gap-1.5"
            >
              + Simpan Pengeluaran
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

