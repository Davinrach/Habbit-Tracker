import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DateStrip } from '../components/DateStrip';
import { 
  PiggyBank, 
  Plus, 
  Trash2, 
  Sparkles, 
  Utensils, 
  Coffee, 
  Bike, 
  ShoppingBag, 
  Gamepad2, 
  Tag,
  Coins,
  Target
} from 'lucide-react';
import { ExpenseCategory } from '../types';

export const FinanceView: React.FC = () => {
  const {
    expenses,
    addExpense,
    deleteExpense,
    selectedDate,
    user,
    updateUser,
  } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [amountInput, setAmountInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<ExpenseCategory>('food');
  const [noteInput, setNoteInput] = useState('');
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [pocketMoneyInput, setPocketMoneyInput] = useState(
    (user.dailyPocketMoney || 80000).toString()
  );
  const [savingsGoalInput, setSavingsGoalInput] = useState(
    (user.savingsGoal || 1000000).toString()
  );

  const dailyPocket = user.dailyPocketMoney || 80000;
  const savingsGoal = user.savingsGoal || 1000000;

  // Filter expenses for selected date
  const todayExpenses = expenses.filter((e) => e.date === selectedDate);
  const totalSpent = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Uang yang BERHASIL MASUK TABUNGAN hari ini
  const savedToday = dailyPocket - totalSpent;
  const savingRate = dailyPocket > 0 ? (savedToday / dailyPocket) : 0;
  const savingPercentage = Math.round(savingRate * 100);

  // Evaluasi Skala Boros vs Hemat berbasis Tabungan
  const getSavingsEvaluation = () => {
    if (totalSpent === 0) {
      return {
        level: 'Tabungan Maksimal (100%)',
        badge: '🌟 Uang Saku Utuh Masuk Tabungan',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        barColor: 'from-emerald-400 to-emerald-500',
        message: `Hebat! Belum ada pengeluaran, Rp ${dailyPocket.toLocaleString('id-ID')} utuh masuk tabungan hari ini!`,
        emoji: '🐷',
        borosLevel: 'Sangat Hemat',
      };
    }
    if (savedToday >= 0.6 * dailyPocket) {
      return {
        level: 'Super Hemat & Nabung Banyak',
        badge: '🌟 Super Hemat (Nabung Banyak)',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        barColor: 'from-emerald-400 to-emerald-500',
        message: `Mantap! ${savingPercentage}% (Rp ${savedToday.toLocaleString('id-ID')}) uang saku berhasil diselamatkan ke tabungan!`,
        emoji: '👏',
        borosLevel: 'Sangat Hemat',
      };
    }
    if (savedToday >= 0.3 * dailyPocket) {
      return {
        level: 'Nabung Aman & Sehat',
        badge: '👍 Nabung Aman & Sehat',
        color: 'text-green-700 bg-green-50 border-green-200',
        barColor: 'from-green-500 to-emerald-500',
        message: `Bagus! Masuk tabungan Rp ${savedToday.toLocaleString('id-ID')} (${savingPercentage}%). Pengeluaran tetap terkendali.`,
        emoji: '👌',
        borosLevel: 'Hemat & Terkendali',
      };
    }
    if (savedToday > 0) {
      return {
        level: 'Tabungan Tipis',
        badge: '⚠️ Tabungan Tipis',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        barColor: 'from-amber-400 to-amber-500',
        message: `Hanya tersisa Rp ${savedToday.toLocaleString('id-ID')} (${savingPercentage}%) untuk ditabung. Pengeluaran hampir menghabiskan jatah!`,
        emoji: '⚡',
        borosLevel: 'Mendekati Boros',
      };
    }
    if (savedToday === 0) {
      return {
        level: 'Nol Tabungan (Uang Habis)',
        badge: '🚨 Uang Saku Habis (Nabung Rp 0)',
        color: 'text-orange-700 bg-orange-50 border-orange-200',
        barColor: 'from-orange-500 to-rose-500',
        message: `Seluruh uang saku Rp ${dailyPocket.toLocaleString('id-ID')} terpakai habis. Tidak ada yang bisa ditabung hari ini.`,
        emoji: '🛑',
        borosLevel: 'Boros (Tanpa Sisa)',
      };
    }
    return {
      level: 'Boros! (Bobol Tabungan)',
      badge: '🔥 Boros (Bobol Tabungan)',
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      barColor: 'from-rose-500 to-red-600',
      message: `Pengeluaran melebihi uang saku harian sebesar Rp ${Math.abs(savedToday).toLocaleString('id-ID')}! Anda mengambil dana dari tabungan sebelumnya.`,
      emoji: '💸',
      borosLevel: 'Sangat Boros (Defisit)',
    };
  };

  const status = getSavingsEvaluation();

  // Hitung Akumulasi Tabungan dari seluruh tanggal yang tercatat
  const allDates = Array.from(new Set([selectedDate, ...expenses.map((e) => e.date)]));
  const totalAccumulatedSavings = allDates.reduce((acc, dateStr) => {
    const daySpent = expenses.filter((e) => e.date === dateStr).reduce((s, e) => s + e.amount, 0);
    return acc + (dailyPocket - daySpent);
  }, 0);

  const goalPercent = Math.max(0, Math.min(100, Math.round((Math.max(0, totalAccumulatedSavings) / savingsGoal) * 100)));

  // Category Configuration
  const categoryConfig: Record<
    ExpenseCategory,
    { label: string; icon: React.ComponentType<{ className?: string }>; bg: string; text: string }
  > = {
    food: { label: 'Makan', icon: Utensils, bg: 'bg-[#FFF3E8]', text: 'text-[#E8733E]' },
    snack: { label: 'Jajan / Minuman', icon: Coffee, bg: 'bg-[#FFF8E6]', text: 'text-[#D48B00]' },
    transport: { label: 'Transport', icon: Bike, bg: 'bg-[#EBF5EE]', text: 'text-[#2A9D8F]' },
    bills: { label: 'Kebutuhan', icon: ShoppingBag, bg: 'bg-[#F4EBF7]', text: 'text-[#9E6E9F]' },
    lifestyle: { label: 'Hiburan', icon: Gamepad2, bg: 'bg-[#E8F0FE]', text: 'text-[#3B82F6]' },
    other: { label: 'Lain-lain', icon: Tag, bg: 'bg-rise-bg', text: 'text-rise-espresso' },
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseInt(amountInput.replace(/\D/g, ''), 10);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      addExpense(parsedAmount, categoryInput, noteInput.trim(), selectedDate);
      setAmountInput('');
      setNoteInput('');
      setIsAdding(false);
    }
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const pocketVal = parseInt(pocketMoneyInput.replace(/\D/g, ''), 10);
    const goalVal = parseInt(savingsGoalInput.replace(/\D/g, ''), 10);
    if (!isNaN(pocketVal) && pocketVal > 0) {
      updateUser({
        dailyPocketMoney: pocketVal,
        savingsGoal: !isNaN(goalVal) && goalVal > 0 ? goalVal : savingsGoal,
      });
      setIsEditingBudget(false);
    }
  };

  // Weekly data (last 7 days savings)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dStr = `${year}-${month}-${day}`;
    const daySpent = expenses
      .filter((e) => e.date === dStr)
      .reduce((sum, e) => sum + e.amount, 0);
    const daySaved = dailyPocket - daySpent;

    return {
      dateStr: dStr,
      label: d.toLocaleDateString('id-ID', { weekday: 'narrow' }),
      saved: daySaved,
      spent: daySpent,
      isFrugal: daySaved >= 0.5 * dailyPocket,
      isDeficit: daySaved < 0,
    };
  });

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="px-6 pt-5 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-rise-espresso">Tabungan & Uang Saku</h1>
          <p className="text-xs text-rise-muted mt-0.5 font-medium">
            Uang saku harian Rp {dailyPocket.toLocaleString('id-ID')} · Evaluasi tabungan & skala boros
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-[#362215] text-white rounded-full text-xs font-bold active:scale-95 transition-all shadow-sm flex items-center gap-1.5 hover:bg-[#25170E]"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{isAdding ? 'Tutup' : 'Catat Belanja'}</span>
        </button>
      </div>

      <DateStrip />

      {/* Quick Add Expense Form */}
      {isAdding && (
        <div className="px-5 py-2">
          <form
            onSubmit={handleSaveExpense}
            className="p-4 bg-white rounded-3xl border border-rise-border/80 shadow-card space-y-3.5 animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rise-espresso flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-[#E8733E]" />
                <span>Catat Pengeluaran ({selectedDate})</span>
              </span>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-xs font-semibold text-rise-muted hover:text-rose-500 py-1 px-2 rounded-lg"
              >
                Batal
              </button>
            </div>

            <p className="text-[11px] text-rise-muted">
              Uang yang Anda belanjakan akan langsung memotong porsi yang masuk ke tabungan hari ini.
            </p>

            {/* Amount Input */}
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-xs font-bold text-rise-muted pointer-events-none">
                Rp
              </span>
              <input
                type="number"
                placeholder="Nominal belanja (cth: 15000)"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="w-full h-12 pl-10 pr-4 bg-rise-bg rounded-xl border border-rise-border text-base font-bold text-rise-espresso focus:outline-none focus:border-rise-espresso"
                autoFocus
                required
              />
            </div>

            {/* Quick Amount Chips */}
            <div>
              <span className="text-[10px] font-bold text-rise-muted uppercase tracking-wider block mb-1.5">
                Pilih Cepat Nominal:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[5000, 10000, 15000, 20000, 25000, 50000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmountInput(amt.toString())}
                    className="py-1.5 px-2 bg-rise-bg hover:bg-[#FFEADA] border border-rise-border/70 rounded-xl text-xs font-bold text-rise-espresso active:scale-95 transition-all text-center"
                  >
                    +{amt.toLocaleString('id-ID')}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Select Buttons */}
            <div>
              <span className="text-[10px] font-bold text-rise-muted uppercase tracking-wider block mb-1.5">
                Kategori Pengeluaran:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {(Object.keys(categoryConfig) as ExpenseCategory[]).map((cat) => {
                  const cfg = categoryConfig[cat];
                  const Icon = cfg.icon;
                  const isSelected = categoryInput === cat;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryInput(cat)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#362215] text-white border-[#362215] shadow-xs'
                          : 'bg-rise-bg text-rise-muted border-rise-border/70 hover:bg-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Note */}
            <input
              type="text"
              placeholder="Catatan (misal: Nasi padang siang, kopi susu)"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              className="w-full h-11 px-3.5 bg-rise-bg rounded-xl border border-rise-border text-xs text-rise-espresso focus:outline-none focus:border-rise-espresso"
            />

            {/* Save Button */}
            <button
              type="submit"
              className="w-full h-12 bg-[#362215] text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 flex items-center justify-center gap-1.5 hover:bg-[#25170E] transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Simpan & Potong dari Tabungan Hari Ini</span>
            </button>
          </form>
        </div>
      )}

      {/* 1. Hero Card: Tabungan Hari Ini & Skala Boros */}
      <div className="px-5 py-2">
        <div className="p-5 rounded-3xl bg-white border border-rise-border/80 shadow-card space-y-4">
          
          {/* Top Row: Daily Pocket & Savings Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-2xl bg-[#EAF5EE] text-[#2A9D8F] flex items-center justify-center">
                <PiggyBank className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-rise-muted uppercase tracking-wider block">
                  Uang Saku Diterima
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-rise-espresso">
                    Rp {dailyPocket.toLocaleString('id-ID')}
                  </span>
                  <button
                    onClick={() => setIsEditingBudget(!isEditingBudget)}
                    className="text-[10px] font-bold text-[#E8733E] hover:underline"
                  >
                    Ubah
                  </button>
                </div>
              </div>
            </div>

            {/* Skala Boros / Tabungan Status Badge */}
            <div className={`px-3 py-1.5 rounded-2xl border text-xs font-bold ${status.color} flex items-center gap-1.5`}>
              <span>{status.badge}</span>
            </div>
          </div>

          {/* Quick Edit Budget / Goal Form */}
          {isEditingBudget && (
            <form onSubmit={handleSaveBudget} className="p-3.5 bg-rise-bg rounded-2xl border border-rise-border space-y-2 animate-fade-in">
              <span className="text-xs font-bold text-rise-espresso block">
                Atur Uang Saku & Target Tabungan
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-rise-muted font-bold block mb-1">
                    Uang Saku / Hari:
                  </label>
                  <input
                    type="number"
                    value={pocketMoneyInput}
                    onChange={(e) => setPocketMoneyInput(e.target.value)}
                    className="w-full h-9 px-2.5 bg-white rounded-xl border border-rise-border text-xs font-bold text-rise-espresso focus:outline-none"
                    placeholder="80000"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-rise-muted font-bold block mb-1">
                    Target Celengan:
                  </label>
                  <input
                    type="number"
                    value={savingsGoalInput}
                    onChange={(e) => setSavingsGoalInput(e.target.value)}
                    className="w-full h-9 px-2.5 bg-white rounded-xl border border-rise-border text-xs font-bold text-rise-espresso focus:outline-none"
                    placeholder="1000000"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditingBudget(false)}
                  className="px-3 py-1 text-xs text-rise-muted font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#362215] text-white text-xs font-bold rounded-xl active:scale-95"
                >
                  Simpan
                </button>
              </div>
            </form>
          )}

          {/* Spotlight Hero: MASUK TABUNGAN HARI INI */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FAF7F2] to-[#FFF3E8] border border-[#FCD2B8]/80 text-center">
            <span className="text-[11px] font-bold text-rise-muted uppercase tracking-wider block">
              Masuk Tabungan Hari Ini
            </span>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <span className={`text-3xl font-black tracking-tight ${savedToday < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                {savedToday < 0 ? `-Rp ${Math.abs(savedToday).toLocaleString('id-ID')}` : `+Rp ${savedToday.toLocaleString('id-ID')}`}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-1.5 text-xs font-semibold text-rise-muted">
              <span>Dari jatah Rp {dailyPocket.toLocaleString('id-ID')}</span>
              <span>·</span>
              <span className={savedToday < 0 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                {savedToday < 0 ? 'Bobol Tabungan' : `${savingPercentage}% Tersimpan`}
              </span>
            </div>
          </div>

          {/* 3 Breakdown Columns */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 bg-rise-bg/60 rounded-2xl">
              <span className="text-[10px] font-semibold text-rise-muted block">Uang Saku</span>
              <span className="text-xs font-extrabold text-rise-espresso mt-0.5 block">
                {(dailyPocket / 1000).toFixed(0)}k
              </span>
            </div>

            <div className="p-2.5 bg-rise-bg/60 rounded-2xl">
              <span className="text-[10px] font-semibold text-rise-muted block">Total Belanja</span>
              <span className={`text-xs font-extrabold mt-0.5 block ${totalSpent > dailyPocket ? 'text-rose-600' : 'text-[#E8733E]'}`}>
                {(totalSpent / 1000).toFixed(0)}k
              </span>
            </div>

            <div className="p-2.5 bg-rise-bg/60 rounded-2xl">
              <span className="text-[10px] font-semibold text-rise-muted block">Skala Boros</span>
              <span className={`text-xs font-extrabold mt-0.5 block ${
                savedToday >= 0.5 * dailyPocket
                  ? 'text-emerald-600'
                  : savedToday > 0
                  ? 'text-amber-600'
                  : 'text-rose-600'
              }`}>
                {status.borosLevel}
              </span>
            </div>
          </div>

          {/* Savings Rate Meter Bar */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
              <span className="text-rise-muted">Porsi Masuk Tabungan:</span>
              <span className={savedToday < 0 ? 'text-rose-600' : 'text-emerald-700'}>
                {Math.max(0, savingPercentage)}% Berhasil Ditabung
              </span>
            </div>

            {/* Meter Bar */}
            <div className="w-full bg-[#EFE9DF] h-3.5 rounded-full overflow-hidden p-0.5 relative">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${status.barColor} transition-all duration-500 ease-out`}
                style={{ width: `${Math.max(0, Math.min(100, savingPercentage))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[9px] font-semibold text-rise-muted/80 mt-1 px-0.5">
              <span>0% (Uang Habis)</span>
              <span>30% (Tipis)</span>
              <span>60% (Sehat)</span>
              <span>100% (Utuh)</span>
            </div>
          </div>

          {/* Evaluasi Skala Pesan */}
          <div className={`p-3 rounded-2xl border ${status.color} flex items-start gap-2.5 text-xs`}>
            <span className="text-base flex-shrink-0">{status.emoji}</span>
            <div className="flex-1">
              <span className="font-bold block leading-tight">{status.level}</span>
              <p className="text-[11px] opacity-90 mt-0.5 font-medium leading-relaxed">
                {status.message}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Celengan Impian / Akumulasi Tabungan Card */}
      <div className="px-5 py-2">
        <div className="p-4 rounded-3xl bg-white border border-rise-border/80 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FFF3E8] text-[#E8733E] flex items-center justify-center">
                <Target className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-rise-espresso">Celengan Impian</h4>
                <p className="text-[11px] text-rise-muted font-medium">
                  Target: Rp {savingsGoal.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm font-extrabold text-emerald-700">
                Rp {Math.max(0, totalAccumulatedSavings).toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] font-bold text-rise-muted block">
                {goalPercent}% Tercapai
              </span>
            </div>
          </div>

          <div className="w-full bg-[#EFE9DF] h-2 rounded-full overflow-hidden mt-2 mb-1">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2A9D8F] to-[#10B981] transition-all duration-500"
              style={{ width: `${goalPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-rise-muted font-medium block text-right">
            Sisa target: Rp {Math.max(0, savingsGoal - Math.max(0, totalAccumulatedSavings)).toLocaleString('id-ID')} lagi
          </span>
        </div>
      </div>

      {/* 3. Daftar Belanja / Pengeluaran Hari Ini */}
      <div className="px-5 py-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-rise-espresso">
            Daftar Belanja Hari Ini ({todayExpenses.length})
          </h3>
          <span className="text-xs font-bold text-rose-600">
            Terpakai: Rp {totalSpent.toLocaleString('id-ID')}
          </span>
        </div>

        {todayExpenses.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-rise-border/70 text-center shadow-card flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
              <Sparkles className="w-6 h-6 stroke-[2]" />
            </div>
            <h4 className="text-sm font-bold text-rise-espresso">Belum Ada Belanja Hari Ini</h4>
            <p className="text-xs text-rise-muted mt-1 max-w-xs leading-relaxed">
              Uang saku Rp {dailyPocket.toLocaleString('id-ID')} masih utuh 100% masuk celengan tabungan! Ketuk tombol "+ Catat Belanja" jika Anda membeli makan atau jajan.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {todayExpenses.map((expense) => {
              const cfg = categoryConfig[expense.category] || categoryConfig.other;
              const Icon = cfg.icon;

              return (
                <div
                  key={expense.id}
                  className="p-3.5 bg-white rounded-2xl border border-rise-border/60 shadow-card flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg} ${cfg.text}`}
                    >
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-rise-espresso">
                          {expense.note || cfg.label}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rise-bg text-rise-muted">
                          {cfg.label}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-rise-muted mt-0.5 block">
                        Pukul {expense.timestamp} WIB
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-extrabold text-rose-600">
                      -Rp {expense.amount.toLocaleString('id-ID')}
                    </span>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="text-rise-muted/60 hover:text-rose-500 p-1.5 rounded-lg active:scale-90 transition-colors"
                      title="Hapus Belanjaan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Riwayat Tabungan 7 Hari Terakhir */}
      <div className="px-5 py-3">
        <div className="p-5 bg-white rounded-3xl border border-rise-border/60 shadow-card">
          <div className="flex items-center justify-between text-xs font-semibold text-rise-muted mb-3">
            <span>Uang Masuk Tabungan 7 Hari</span>
            <span className="text-rise-espresso font-bold">
              Jatah: {(dailyPocket / 1000).toFixed(0)}k/hari
            </span>
          </div>

          <div className="flex items-end justify-between h-28 gap-2 pt-2">
            {last7Days.map((d) => {
              const heightPercent = Math.max(10, Math.min(100, Math.round((Math.max(0, d.saved) / dailyPocket) * 100)));
              const isSelected = d.dateStr === selectedDate;

              return (
                <div key={d.dateStr} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[9px] font-bold text-rise-muted">
                    {d.saved > 0 ? `${(d.saved / 1000).toFixed(0)}k` : '0k'}
                  </span>
                  <div className="w-full bg-rise-subtle rounded-t-lg h-full flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        isSelected
                          ? 'bg-[#362215]'
                          : d.isDeficit
                          ? 'bg-rose-500'
                          : d.isFrugal
                          ? 'bg-[#2A9D8F]'
                          : 'bg-[#FFB799]'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-bold ${
                      isSelected ? 'text-rise-espresso underline' : 'text-rise-muted'
                    }`}
                  >
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
