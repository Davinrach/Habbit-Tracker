import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DateStrip } from '../components/DateStrip';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Plus, 
  Trash2, 
  Utensils, 
  Coffee, 
  Bike, 
  ShoppingBag, 
  Gamepad2, 
  Tag, 
  Wallet,
  Coins
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
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [amountInput, setAmountInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<ExpenseCategory>('food');
  const [noteInput, setNoteInput] = useState('');
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [pocketMoneyInput, setPocketMoneyInput] = useState(
    (user.dailyPocketMoney || 80000).toString()
  );

  const dailyPocket = user.dailyPocketMoney || 80000;

  // Filter transactions for selected date
  const todayTransactions = (expenses || []).filter((e) => e.date === selectedDate);

  // Uang Keluar (Expenses)
  const totalExpense = todayTransactions
    .filter((e) => (e.type || 'expense') === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  // Tambahan Uang Masuk manual di luar jatah saku harian
  const additionalIncome = todayTransactions
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  // Total Uang Masuk = Uang saku harian + pemasukan tambahan
  const totalIncome = dailyPocket + additionalIncome;

  // Saldo Sekarang
  const currentBalance = totalIncome - totalExpense;

  // Rasio pengeluaran terhadap total pemasukan
  const expenseRatio = totalIncome > 0 ? totalExpense / totalIncome : 0;
  const expensePercent = Math.round(expenseRatio * 100);

  // Status Skala Boros (Simpel, Padat, Tanpa Teks Panjang)
  const getStatus = () => {
    if (totalExpense === 0) {
      return {
        badge: '🌟 Belum Ada Pengeluaran',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        barColor: 'from-emerald-400 to-emerald-500',
      };
    }
    if (expenseRatio <= 0.4) {
      return {
        badge: '🌟 Sangat Hemat',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        barColor: 'from-emerald-400 to-emerald-500',
      };
    }
    if (expenseRatio <= 0.7) {
      return {
        badge: '👍 Wajar & Aman',
        color: 'text-green-700 bg-green-50 border-green-200',
        barColor: 'from-green-500 to-emerald-500',
      };
    }
    if (expenseRatio <= 0.95) {
      return {
        badge: '⚠️ Mendekati Batas',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        barColor: 'from-amber-400 to-amber-500',
      };
    }
    if (expenseRatio <= 1.0) {
      return {
        badge: '🚨 Limit Maksimal',
        color: 'text-orange-700 bg-orange-50 border-orange-200',
        barColor: 'from-orange-500 to-rose-500',
      };
    }
    return {
      badge: '🔥 Boros (Overbudget)',
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      barColor: 'from-rose-500 to-red-600',
    };
  };

  const status = getStatus();

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
    income: { label: 'Pemasukan', icon: Coins, bg: 'bg-[#EAF5EE]', text: 'text-[#2A9D8F]' },
    other: { label: 'Lain-lain', icon: Tag, bg: 'bg-rise-bg', text: 'text-rise-espresso' },
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseInt(amountInput.replace(/\D/g, ''), 10);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      addExpense(
        parsedAmount,
        transactionType === 'income' ? 'income' : categoryInput,
        noteInput.trim(),
        selectedDate,
        transactionType
      );
      setAmountInput('');
      setNoteInput('');
      setIsAdding(false);
    }
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const pocketVal = parseInt(pocketMoneyInput.replace(/\D/g, ''), 10);
    if (!isNaN(pocketVal) && pocketVal > 0) {
      updateUser({ dailyPocketMoney: pocketVal });
      setIsEditingBudget(false);
    }
  };

  return (
    <div className="pb-24">
      {/* 1. Header */}
      <div className="px-6 pt-5 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-rise-espresso">Keuangan & Dompet</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs text-rise-muted font-medium">
              Uang Saku: Rp {dailyPocket.toLocaleString('id-ID')}
            </span>
            <button
              onClick={() => setIsEditingBudget(!isEditingBudget)}
              className="text-[11px] font-bold text-[#E8733E] hover:underline"
            >
              (Ubah)
            </button>
          </div>
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

      {/* Edit Pocket Money Inline */}
      {isEditingBudget && (
        <div className="px-5 py-2">
          <form
            onSubmit={handleSaveBudget}
            className="p-3.5 bg-white rounded-2xl border border-rise-border shadow-xs flex items-center gap-2 animate-fade-in"
          >
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-xs font-bold text-rise-muted">Rp</span>
              <input
                type="number"
                value={pocketMoneyInput}
                onChange={(e) => setPocketMoneyInput(e.target.value)}
                className="w-full h-9 pl-9 pr-3 bg-rise-bg rounded-xl border border-rise-border text-xs font-bold text-rise-espresso focus:outline-none"
                placeholder="80000"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="h-9 px-4 bg-[#362215] text-white text-xs font-bold rounded-xl active:scale-95"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => setIsEditingBudget(false)}
              className="text-xs text-rise-muted px-2"
            >
              Batal
            </button>
          </form>
        </div>
      )}

      {/* Quick Add Transaction Form (Uang Masuk / Keluar) */}
      {isAdding && (
        <div className="px-5 py-2">
          <form
            onSubmit={handleSaveTransaction}
            className="p-4 bg-white rounded-3xl border border-rise-border/80 shadow-card space-y-3 animate-fade-in"
          >
            {/* Toggle Uang Keluar vs Uang Masuk */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-rise-bg rounded-xl border border-rise-border/70">
              <button
                type="button"
                onClick={() => {
                  setTransactionType('expense');
                  setCategoryInput('food');
                }}
                className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  transactionType === 'expense'
                    ? 'bg-white text-rose-600 shadow-2xs'
                    : 'text-rise-muted hover:text-rise-espresso'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Uang Keluar</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTransactionType('income');
                  setCategoryInput('income');
                }}
                className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  transactionType === 'income'
                    ? 'bg-white text-emerald-600 shadow-2xs'
                    : 'text-rise-muted hover:text-rise-espresso'
                }`}
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                <span>Uang Masuk</span>
              </button>
            </div>

            {/* Amount Input */}
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-xs font-bold text-rise-muted pointer-events-none">
                Rp
              </span>
              <input
                type="number"
                placeholder={transactionType === 'expense' ? 'Nominal belanja (cth: 15000)' : 'Nominal masuk (cth: 20000)'}
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="w-full h-12 pl-10 pr-4 bg-rise-bg rounded-xl border border-rise-border text-base font-bold text-rise-espresso focus:outline-none focus:border-rise-espresso"
                autoFocus
                required
              />
            </div>

            {/* Quick Amount Chips */}
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

            {/* Category Select Buttons (Only for Expense) */}
            {transactionType === 'expense' && (
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'food' as const, label: 'Makan', icon: Utensils },
                  { id: 'snack' as const, label: 'Jajan', icon: Coffee },
                  { id: 'transport' as const, label: 'Transport', icon: Bike },
                  { id: 'bills' as const, label: 'Belanja', icon: ShoppingBag },
                  { id: 'lifestyle' as const, label: 'Hiburan', icon: Gamepad2 },
                  { id: 'other' as const, label: 'Lainnya', icon: Tag },
                ].map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = categoryInput === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryInput(cat.id)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#362215] text-white border-[#362215] shadow-xs'
                          : 'bg-rise-bg text-rise-muted border-rise-border/70 hover:bg-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Optional Note */}
            <input
              type="text"
              placeholder="Catatan (misal: Nasi Padang, Uang saku tambahan)"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              className="w-full h-11 px-3.5 bg-rise-bg rounded-xl border border-rise-border text-xs text-rise-espresso focus:outline-none focus:border-rise-espresso"
            />

            {/* Save Button */}
            <button
              type="submit"
              className={`w-full h-12 text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 flex items-center justify-center gap-1.5 transition-all ${
                transactionType === 'income' ? 'bg-[#2A9D8F] hover:bg-[#238276]' : 'bg-[#362215] hover:bg-[#25170E]'
              }`}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{transactionType === 'income' ? 'Simpan Uang Masuk' : 'Simpan Uang Keluar'}</span>
            </button>
          </form>
        </div>
      )}

      {/* 2. Main Saldo Card */}
      <div className="px-5 py-2">
        <div className="p-5 rounded-3xl bg-white border border-rise-border/80 shadow-card space-y-4">
          
          {/* Saldo Sekarang Headline */}
          <div className="text-center pb-2">
            <span className="text-[11px] font-bold text-rise-muted uppercase tracking-wider block">
              Saldo Sekarang
            </span>
            <h2 className={`text-3xl font-black mt-1 tracking-tight ${
              currentBalance < 0 ? 'text-rose-600' : 'text-rise-espresso'
            }`}>
              Rp {currentBalance.toLocaleString('id-ID')}
            </h2>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${status.color}`}>
                {status.badge}
              </span>
            </div>
          </div>

          {/* Two Metric Cards: Uang Masuk & Uang Keluar */}
          <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-rise-border/60">
            {/* Uang Masuk Card */}
            <div className="p-3.5 rounded-2xl bg-[#EAF5EE]/60 border border-[#2A9D8F]/20">
              <div className="flex items-center gap-1.5 text-[#2A9D8F] mb-1">
                <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
                <span className="text-xs font-bold">Uang Masuk</span>
              </div>
              <span className="text-base font-extrabold text-[#2A9D8F] block">
                +Rp {totalIncome.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-rise-muted font-medium mt-0.5 block">
                Saku {dailyPocket.toLocaleString('id-ID')} {additionalIncome > 0 ? `+ ${additionalIncome.toLocaleString('id-ID')}` : ''}
              </span>
            </div>

            {/* Uang Keluar Card */}
            <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/50">
              <div className="flex items-center gap-1.5 text-rose-600 mb-1">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                <span className="text-xs font-bold">Uang Keluar</span>
              </div>
              <span className="text-base font-extrabold text-rose-600 block">
                -Rp {totalExpense.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-rise-muted font-medium mt-0.5 block">
                {expensePercent}% dari uang masuk
              </span>
            </div>
          </div>

          {/* Simple Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-rise-muted mb-1.5">
              <span>Penggunaan Budget:</span>
              <span className={expenseRatio > 1 ? 'text-rose-600' : 'text-rise-espresso'}>
                {expensePercent}%
              </span>
            </div>
            <div className="w-full bg-[#EFE9DF] h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${status.barColor} transition-all duration-500`}
                style={{ width: `${Math.min(100, Math.max(0, expensePercent))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Daftar Transaksi Hari Ini */}
      <div className="px-5 py-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-rise-espresso">
            Aktivitas Uang Hari Ini ({todayTransactions.length})
          </h3>
          <span className="text-xs font-semibold text-rise-muted">
            Sisa: Rp {currentBalance.toLocaleString('id-ID')}
          </span>
        </div>

        {todayTransactions.length === 0 ? (
          <div className="p-6 rounded-3xl bg-white border border-rise-border/70 text-center shadow-card flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF5EE] text-[#2A9D8F] flex items-center justify-center mb-2">
              <Wallet className="w-5 h-5 stroke-[2]" />
            </div>
            <h4 className="text-xs font-bold text-rise-espresso">Belum Ada Transaksi Hari Ini</h4>
            <p className="text-[11px] text-rise-muted mt-0.5">
              Uang saku Rp {dailyPocket.toLocaleString('id-ID')} masih utuh di saldo Anda.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayTransactions.map((tx) => {
              const isIncome = tx.type === 'income';
              const cfg = categoryConfig[tx.category] || categoryConfig.other;
              const Icon = isIncome ? Coins : cfg.icon;

              return (
                <div
                  key={tx.id}
                  className="p-3.5 bg-white rounded-2xl border border-rise-border/60 shadow-card flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isIncome ? 'bg-[#EAF5EE] text-[#2A9D8F]' : `${cfg.bg} ${cfg.text}`
                      }`}
                    >
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>

                    <div>
                      <span className="text-xs font-bold text-rise-espresso block">
                        {tx.note || (isIncome ? 'Uang Masuk' : cfg.label)}
                      </span>
                      <span className="text-[10px] text-rise-muted font-medium block">
                        {isIncome ? 'Pemasukan' : cfg.label} · {tx.timestamp} WIB
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-extrabold ${isIncome ? 'text-[#2A9D8F]' : 'text-rose-600'}`}>
                      {isIncome ? `+Rp ${tx.amount.toLocaleString('id-ID')}` : `-Rp ${tx.amount.toLocaleString('id-ID')}`}
                    </span>
                    <button
                      onClick={() => deleteExpense(tx.id)}
                      className="text-rise-muted/50 hover:text-rose-500 p-1 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
