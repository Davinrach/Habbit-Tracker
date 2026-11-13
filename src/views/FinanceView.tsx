import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DateStrip } from '../components/DateStrip';
import { 
  Wallet, 
  Plus, 
  Trash2, 
  Sparkles, 
  Utensils, 
  Coffee, 
  Bike, 
  ShoppingBag, 
  Gamepad2, 
  Tag
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

  const dailyBudget = user.dailyPocketMoney || 80000;

  // Filter expenses for selected date
  const todayExpenses = expenses.filter((e) => e.date === selectedDate);
  const totalSpent = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = dailyBudget - totalSpent;
  const spentRatio = dailyBudget > 0 ? totalSpent / dailyBudget : 0;
  const spentPercentage = Math.round(spentRatio * 100);

  // Determine Frugality / Wastefulness Scale (Skala Boros)
  const getFrugalityStatus = () => {
    if (totalSpent === 0) {
      return {
        level: 'Belum Ada Pengeluaran',
        badge: '🌟 Uang Saku Utuh',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        barColor: 'from-emerald-400 to-emerald-500',
        message: 'Belum ada pengeluaran hari ini. Pertahankan pengeluaran yang bijak!',
        emoji: '🌱',
      };
    }
    if (spentRatio <= 0.4) {
      return {
        level: 'Sangat Hemat',
        badge: '🌟 Sangat Hemat',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        barColor: 'from-emerald-400 to-emerald-500',
        message: `Luar biasa! ${Math.round((1 - spentRatio) * 100)}% uang saku tersisa untuk ditabung.`,
        emoji: '👏',
      };
    }
    if (spentRatio <= 0.7) {
      return {
        level: 'Terkendali & Wajar',
        badge: '👍 Pengeluaran Sehat',
        color: 'text-green-700 bg-green-50 border-green-200',
        barColor: 'from-green-500 to-emerald-500',
        message: 'Pengeluaran proporsional, kondisi keuangan hari ini aman terkendali.',
        emoji: '👌',
      };
    }
    if (spentRatio <= 0.9) {
      return {
        level: 'Mendekati Batas',
        badge: '⚠️ Waspada / Menipis',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        barColor: 'from-amber-400 to-amber-500',
        message: 'Uang saku tersisa sedikit. Tahan jajan atau pengeluaran impulsif ya!',
        emoji: '⚡',
      };
    }
    if (spentRatio <= 1.0) {
      return {
        level: 'Limit Maksimal',
        badge: '🚨 Batas Limit',
        color: 'text-orange-700 bg-orange-50 border-orange-200',
        barColor: 'from-orange-500 to-rose-500',
        message: 'Uang saku hari ini sudah terpakai hampir 100%. Stop pengeluaran!',
        emoji: '🛑',
      };
    }
    return {
      level: 'Boros / Overbudget',
      badge: '🔥 Overbudget / Boros',
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      barColor: 'from-rose-500 to-red-600',
      message: `Melebihi budget sebesar Rp ${Math.abs(remaining).toLocaleString('id-ID')}! Kendalikan besok.`,
      emoji: '💸',
    };
  };

  const status = getFrugalityStatus();

  // Category Configuration
  const categoryConfig: Record<
    ExpenseCategory,
    { label: string; icon: React.ComponentType<{ className?: string }>; bg: string; text: string }
  > = {
    food: { label: 'Makan', icon: Utensils, bg: 'bg-[#FFF3E8]', text: 'text-[#E8733E]' },
    snack: { label: 'Jajan / Kopi', icon: Coffee, bg: 'bg-[#FFF8E6]', text: 'text-[#D48B00]' },
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
    const val = parseInt(pocketMoneyInput.replace(/\D/g, ''), 10);
    if (!isNaN(val) && val > 0) {
      updateUser({ dailyPocketMoney: val });
      setIsEditingBudget(false);
    }
  };

  // Weekly data (last 7 days)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dStr = `${year}-${month}-${day}`;
    const dayTotal = expenses
      .filter((e) => e.date === dStr)
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      dateStr: dStr,
      label: d.toLocaleDateString('id-ID', { weekday: 'narrow' }),
      total: dayTotal,
      isOver: dayTotal > dailyBudget,
    };
  });

  const maxWeeklySpent = Math.max(...last7Days.map((d) => d.total), dailyBudget, 1);

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="px-6 pt-5 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-rise-espresso">Uang & Pengeluaran</h1>
          <p className="text-xs text-rise-muted mt-0.5 font-medium">
            Catat pengeluaran harian & evaluasi skala boros
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-[#362215] text-white rounded-full text-xs font-bold active:scale-95 transition-all shadow-sm flex items-center gap-1.5 hover:bg-[#25170E]"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{isAdding ? 'Tutup' : 'Catat'}</span>
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
                <Wallet className="w-4 h-4 text-[#E8733E]" />
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

            {/* Amount Input */}
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-xs font-bold text-rise-muted pointer-events-none">
                Rp
              </span>
              <input
                type="number"
                placeholder="Nominal (cth: 15000)"
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
              placeholder="Catatan (misal: Nasi padang + es teh)"
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
              <span>Simpan Pengeluaran</span>
            </button>
          </form>
        </div>
      )}

      {/* 1. Hero Card: Skala Boros & Evaluasi Uang Saku */}
      <div className="px-5 py-2">
        <div className="p-5 rounded-3xl bg-white border border-rise-border/80 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FFEADA] text-[#E8733E] flex items-center justify-center">
                <Wallet className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-rise-muted uppercase tracking-wider block">
                  Uang Saku Harian
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-rise-espresso">
                    Rp {dailyBudget.toLocaleString('id-ID')}
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

            {/* Skala Boros Status Badge */}
            <div className={`px-3 py-1.5 rounded-2xl border text-xs font-bold ${status.color} flex items-center gap-1.5`}>
              <span>{status.badge}</span>
            </div>
          </div>

          {/* Quick Edit Daily Budget Form */}
          {isEditingBudget && (
            <form onSubmit={handleSaveBudget} className="p-3 bg-rise-bg rounded-2xl border border-rise-border flex items-center gap-2 animate-fade-in">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-rise-muted">Rp</span>
                <input
                  type="number"
                  value={pocketMoneyInput}
                  onChange={(e) => setPocketMoneyInput(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 bg-white rounded-xl border border-rise-border text-xs font-bold text-rise-espresso focus:outline-none"
                  placeholder="80000"
                />
              </div>
              <button
                type="submit"
                className="h-9 px-3 bg-[#362215] text-white text-xs font-bold rounded-xl active:scale-95"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setIsEditingBudget(false)}
                className="text-xs text-rise-muted px-1"
              >
                Batal
              </button>
            </form>
          )}

          {/* 3 Main Numbers */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-rise-border/60 text-center">
            <div className="p-2.5 bg-rise-bg/60 rounded-2xl">
              <span className="text-[10px] font-semibold text-rise-muted block">Budget</span>
              <span className="text-xs font-extrabold text-rise-espresso mt-0.5 block">
                {(dailyBudget / 1000).toFixed(0)}k
              </span>
            </div>

            <div className="p-2.5 bg-rise-bg/60 rounded-2xl">
              <span className="text-[10px] font-semibold text-rise-muted block">Terpakai</span>
              <span className={`text-xs font-extrabold mt-0.5 block ${totalSpent > dailyBudget ? 'text-rose-600' : 'text-[#E8733E]'}`}>
                {(totalSpent / 1000).toFixed(0)}k
              </span>
            </div>

            <div className="p-2.5 bg-rise-bg/60 rounded-2xl">
              <span className="text-[10px] font-semibold text-rise-muted block">Sisa Uang</span>
              <span className={`text-xs font-extrabold mt-0.5 block ${remaining < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {remaining < 0 ? `-${(Math.abs(remaining) / 1000).toFixed(0)}k` : `${(remaining / 1000).toFixed(0)}k`}
              </span>
            </div>
          </div>

          {/* Visual Frugality Gauge / Meter */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
              <span className="text-rise-muted">Skala Penggunaan Budget:</span>
              <span className={spentRatio > 1 ? 'text-rose-600' : 'text-rise-espresso'}>
                {spentPercentage}%
              </span>
            </div>

            {/* Gauge Track */}
            <div className="w-full bg-[#EFE9DF] h-3.5 rounded-full overflow-hidden p-0.5 relative">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${status.barColor} transition-all duration-500 ease-out`}
                style={{ width: `${Math.min(100, spentPercentage)}%` }}
              />
            </div>

            {/* Scale Legends */}
            <div className="flex items-center justify-between text-[9px] font-semibold text-rise-muted/80 mt-1 px-0.5">
              <span>0% (Hemat)</span>
              <span>50% (Aman)</span>
              <span>80% (Waspada)</span>
              <span>100% (Limit)</span>
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

      {/* 2. Daftar Pengeluaran Hari Ini */}
      <div className="px-5 py-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-rise-espresso">
            Daftar Pengeluaran ({todayExpenses.length})
          </h3>
          <span className="text-xs font-bold text-rise-muted">
            Total: Rp {totalSpent.toLocaleString('id-ID')}
          </span>
        </div>

        {todayExpenses.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-rise-border/70 text-center shadow-card flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
              <Sparkles className="w-6 h-6 stroke-[2]" />
            </div>
            <h4 className="text-sm font-bold text-rise-espresso">Belum Ada Pengeluaran</h4>
            <p className="text-xs text-rise-muted mt-1 max-w-xs leading-relaxed">
              Uang saku hari ini masih utuh Rp {dailyBudget.toLocaleString('id-ID')}. Ketuk tombol "+ Catat" jika ada jajan atau kebutuhan.
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
                    <span className="text-sm font-extrabold text-rise-espresso">
                      -Rp {expense.amount.toLocaleString('id-ID')}
                    </span>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="text-rise-muted/60 hover:text-rose-500 p-1.5 rounded-lg active:scale-90 transition-colors"
                      title="Hapus Pengeluaran"
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

      {/* 3. Grafik Pengeluaran 7 Hari Terakhir */}
      <div className="px-5 py-3">
        <div className="p-5 bg-white rounded-3xl border border-rise-border/60 shadow-card">
          <div className="flex items-center justify-between text-xs font-semibold text-rise-muted mb-3">
            <span>Tren Pengeluaran 7 Hari</span>
            <span className="text-rise-espresso font-bold">
              Target: {(dailyBudget / 1000).toFixed(0)}k/hari
            </span>
          </div>

          <div className="flex items-end justify-between h-28 gap-2 pt-2">
            {last7Days.map((d) => {
              const heightPercent = Math.max(8, Math.min(100, Math.round((d.total / maxWeeklySpent) * 100)));
              const isSelected = d.dateStr === selectedDate;

              return (
                <div key={d.dateStr} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[9px] font-bold text-rise-muted">
                    {d.total > 0 ? `${(d.total / 1000).toFixed(0)}k` : ''}
                  </span>
                  <div className="w-full bg-rise-subtle rounded-t-lg h-full flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        isSelected
                          ? 'bg-[#362215]'
                          : d.isOver
                          ? 'bg-rose-500'
                          : 'bg-[#E8733E]'
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
