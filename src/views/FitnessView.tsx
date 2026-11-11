import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DateStrip } from '../components/DateStrip';
import { Dumbbell, Scale, Plus, Flame } from 'lucide-react';

export const FitnessView: React.FC = () => {
  const {
    pushUpSets,
    addPushUpSet,
    deletePushUpSet,
    weightRecords,
    addWeightRecord,
    selectedDate,
    user,
  } = useApp();

  const [weightInput, setWeightInput] = useState('');
  const [weightNote, setWeightNote] = useState('');
  const [isAddingWeight, setIsAddingWeight] = useState(false);

  // Push Up calculations for selected date
  const todaySets = pushUpSets.filter((s) => s.date === selectedDate);
  const todayPushUpTotal = todaySets.reduce((sum, s) => sum + s.reps, 0);
  const pushUpGoal = user.pushUpDailyGoal || 50;
  const pushUpPercent = Math.min(100, Math.round((todayPushUpTotal / pushUpGoal) * 100));

  // Compute push up streak (consecutive days target reached)
  const computeStreak = () => {
    let streak = 0;
    const dateMap = new Map<string, number>();
    pushUpSets.forEach((s) => {
      dateMap.set(s.date, (dateMap.get(s.date) || 0) + s.reps);
    });

    const d = new Date();
    while (true) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dStr = `${year}-${month}-${day}`;
      const reps = dateMap.get(dStr) || 0;
      if (reps >= pushUpGoal) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = computeStreak();

  // Weekly push-up chart data (last 7 days)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dStr = `${year}-${month}-${day}`;
    const total = pushUpSets.filter((s) => s.date === dStr).reduce((sum, s) => sum + s.reps, 0);
    return {
      dateStr: dStr,
      label: d.toLocaleDateString('id-ID', { weekday: 'narrow' }),
      total,
      isTargetMet: total >= pushUpGoal,
    };
  });

  const maxWeeklyReps = Math.max(...last7Days.map((d) => d.total), pushUpGoal, 1);

  // Weight calculations
  const sortedWeights = [...weightRecords].sort((a, b) => a.date.localeCompare(b.date));
  const hasWeightData = sortedWeights.length > 0;
  const latestWeight = hasWeightData ? sortedWeights[sortedWeights.length - 1].weightKg : null;
  const previousWeight = sortedWeights.length > 1 ? sortedWeights[sortedWeights.length - 2].weightKg : latestWeight;
  const weightDiff = hasWeightData && sortedWeights.length > 1 ? (latestWeight! - previousWeight!).toFixed(1) : '0.0';
  const diffToGoal = hasWeightData ? (latestWeight! - user.weightGoalKg).toFixed(1) : '-';

  // BMI Calculation
  const heightM = (user.heightCm || 170) / 100;
  const bmi = hasWeightData ? (latestWeight! / (heightM * heightM)).toFixed(1) : '-';
  let bmiCategory = hasWeightData ? 'Normal' : 'Belum Ada Data';
  let bmiColor = 'text-green-600 bg-green-50';
  if (hasWeightData) {
    const bmiNum = parseFloat(bmi);
    if (bmiNum < 18.5) {
      bmiCategory = 'Kurus';
      bmiColor = 'text-amber-600 bg-amber-50';
    } else if (bmiNum >= 25 && bmiNum < 30) {
      bmiCategory = 'Kelebihan BB';
      bmiColor = 'text-orange-600 bg-orange-50';
    } else if (bmiNum >= 30) {
      bmiCategory = 'Obesitas';
      bmiColor = 'text-red-600 bg-red-50';
    }
  } else {
    bmiColor = 'text-rise-muted bg-rise-bg';
  }

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(weightInput);
    if (!isNaN(val) && val > 20 && val < 300) {
      addWeightRecord(val, weightNote, selectedDate);
      setWeightInput('');
      setWeightNote('');
      setIsAddingWeight(false);
    }
  };

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="px-6 pt-5 pb-2">
        <h1 className="text-2xl font-bold text-rise-espresso">Fitness & Progres</h1>
        <p className="text-xs text-rise-muted mt-0.5">Tracking Push Up harian & Tren Berat Badan</p>
      </div>

      <DateStrip />

      {/* 1. Push Up Section */}
      <div className="px-5 py-3">
        <div className="bg-white p-5 rounded-3xl border border-rise-border/60 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FFEFEA] text-[#E25822] flex items-center justify-center">
                <Dumbbell className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-rise-espresso">Push Up Hari Ini</h2>
                <p className="text-xs text-rise-muted font-medium">Target: {pushUpGoal} reps per hari</p>
              </div>
            </div>

            {/* Streak Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FFF2E8] border border-[#FCD2B8]/60 rounded-full text-xs font-bold text-[#E25822]">
              <Flame className="w-4 h-4 fill-[#E25822]" />
              <span>{streak} Hari</span>
            </div>
          </div>

          {/* Big Counter Display */}
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-extrabold text-rise-espresso tracking-tight">
                {todayPushUpTotal}
              </span>
              <span className="text-sm font-semibold text-rise-muted">/ {pushUpGoal} reps</span>
            </div>
            <span className="text-xs font-bold text-[#E25822]">{pushUpPercent}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#EFE9DF] h-3 rounded-full overflow-hidden mb-5">
            <div
              className="h-full bg-gradient-to-r from-[#FF7A59] to-[#E25822] rounded-full transition-all duration-500"
              style={{ width: `${pushUpPercent}%` }}
            />
          </div>

          {/* Quick Add Reps Buttons */}
          <p className="text-[11px] font-bold uppercase tracking-wider text-rise-muted mb-2">
            Catat Cepat (1 Ketukan)
          </p>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[5, 10, 15, 20].map((reps) => (
              <button
                key={reps}
                onClick={() => addPushUpSet(reps, selectedDate)}
                className="py-2.5 rounded-xl bg-rise-bg border border-rise-border/80 font-bold text-xs text-rise-espresso hover:bg-[#FFEADA] hover:border-[#FCD2B8] active:scale-90 transition-all flex items-center justify-center gap-1 shadow-2xs"
              >
                <span>+{reps}</span>
              </button>
            ))}
          </div>

          {/* Weekly Reps Mini Bar Chart */}
          <div className="mt-4 pt-4 border-t border-rise-border/60">
            <div className="flex justify-between items-center text-xs font-semibold text-rise-muted mb-3">
              <span>Performa 7 Hari Terakhir</span>
              <span className="text-rise-espresso font-bold">Maks: {maxWeeklyReps} reps</span>
            </div>
            <div className="flex items-end justify-between h-24 gap-2 pt-2">
              {last7Days.map((d) => {
                const heightPercent = Math.max(10, Math.round((d.total / maxWeeklyReps) * 100));
                const isSelected = d.dateStr === selectedDate;
                return (
                  <div key={d.dateStr} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[9px] font-bold text-rise-muted">{d.total > 0 ? d.total : ''}</span>
                    <div className="w-full bg-rise-subtle rounded-t-lg h-full flex items-end overflow-hidden">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          isSelected
                            ? 'bg-[#362215]'
                            : d.isTargetMet
                            ? 'bg-[#E25822]'
                            : 'bg-[#FFB799]'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-rise-espresso underline' : 'text-rise-muted'}`}>
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's Sets History */}
          {todaySets.length > 0 && (
            <div className="mt-4 pt-3 border-t border-rise-border/60">
              <span className="text-[11px] font-semibold text-rise-muted">Riwayat Set Hari Ini:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {todaySets.map((s, idx) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-rise-bg rounded-lg border border-rise-border text-xs text-rise-espresso font-semibold"
                  >
                    <span>Set {idx + 1}: {s.reps}x ({s.timestamp})</span>
                    <button
                      onClick={() => deletePushUpSet(s.id)}
                      className="text-rise-muted hover:text-red-500 ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Weight Section */}
      <div className="px-5 py-3">
        <div className="bg-white p-5 rounded-3xl border border-rise-border/60 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#EAF5EE] text-[#558B55] flex items-center justify-center">
                <Scale className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-rise-espresso">Tracking Berat Badan</h2>
                <p className="text-xs text-rise-muted font-medium">Target: {user.weightGoalKg} kg</p>
              </div>
            </div>

            <button
              onClick={() => setIsAddingWeight(!isAddingWeight)}
              className="px-3 py-1.5 bg-[#362215] text-white rounded-full text-xs font-semibold active:scale-95 transition-all shadow-sm flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Catat
            </button>
          </div>

          {/* Weight Input Box Toggle */}
          {isAddingWeight && (
            <form onSubmit={handleSaveWeight} className="p-3.5 bg-rise-bg rounded-2xl mb-4 border border-rise-border">
              <span className="text-xs font-bold text-rise-espresso block mb-2">
                Catat Timbangan ({selectedDate})
              </span>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="number"
                  step="0.1"
                  placeholder="Berat (kg), cth: 68.5"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white rounded-xl border border-rise-border text-sm font-semibold text-rise-espresso focus:outline-none focus:border-[#558B55]"
                  autoFocus
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#558B55] text-white rounded-xl text-xs font-bold shadow-sm active:scale-95"
                >
                  Simpan
                </button>
              </div>
              <input
                type="text"
                placeholder="Catatan opsional (misal: setelah olahraga)"
                value={weightNote}
                onChange={(e) => setWeightNote(e.target.value)}
                className="w-full px-3 py-1.5 bg-white rounded-xl border border-rise-border text-xs text-rise-espresso focus:outline-none"
              />
            </form>
          )}

          {/* Big Weight Numbers & BMI */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-3.5 bg-rise-bg/60 rounded-2xl border border-rise-border/60">
              <span className="text-[11px] font-semibold text-rise-muted block">Timbangan Terakhir</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-extrabold text-rise-espresso">{latestWeight ?? '--'}</span>
                {latestWeight && <span className="text-xs font-bold text-rise-muted">kg</span>}
                {hasWeightData && parseFloat(weightDiff) !== 0 && (
                  <span
                    className={`text-[11px] font-bold ml-1 ${
                      parseFloat(weightDiff) < 0 ? 'text-green-600' : 'text-amber-600'
                    }`}
                  >
                    {parseFloat(weightDiff) > 0 ? `+${weightDiff}` : weightDiff} kg
                  </span>
                )}
              </div>
              <span className="text-[10px] text-rise-muted mt-1 block font-medium">
                {hasWeightData ? `Selisih ke target: ${diffToGoal} kg` : `Target: ${user.weightGoalKg} kg`}
              </span>
            </div>

            <div className="p-3.5 bg-rise-bg/60 rounded-2xl border border-rise-border/60">
              <span className="text-[11px] font-semibold text-rise-muted block">Indeks Massa Tubuh (BMI)</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-extrabold text-rise-espresso">{bmi}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${bmiColor}`}>
                  {bmiCategory}
                </span>
              </div>
              <span className="text-[10px] text-rise-muted mt-1 block font-medium">
                Tinggi Badan: {user.heightCm} cm
              </span>
            </div>
          </div>

          {/* Simple SVG Line Chart for Weight Trend */}
          <div>
            <span className="text-xs font-bold text-rise-muted mb-2 block">Tren Berat Badan</span>
            {sortedWeights.length < 2 ? (
              <p className="text-xs text-rise-muted italic text-center py-4 bg-rise-bg/40 rounded-xl">
                Catat berat minimal 2 kali untuk melihat grafik tren.
              </p>
            ) : (
              <div className="p-2 bg-rise-bg/40 rounded-2xl">
                {/* SVG Line Chart */}
                <svg viewBox="0 0 300 100" className="w-full h-24 overflow-visible">
                  {/* Guidelines */}
                  <line x1="0" y1="20" x2="300" y2="20" stroke="#E2DDD5" strokeDasharray="3 3" />
                  <line x1="0" y1="50" x2="300" y2="50" stroke="#E2DDD5" strokeDasharray="3 3" />
                  <line x1="0" y1="80" x2="300" y2="80" stroke="#E2DDD5" strokeDasharray="3 3" />

                  {/* Polyline */}
                  {(() => {
                    const minW = Math.min(...sortedWeights.map((w) => w.weightKg)) - 1;
                    const maxW = Math.max(...sortedWeights.map((w) => w.weightKg)) + 1;
                    const range = Math.max(1, maxW - minW);

                    const points = sortedWeights
                      .map((w, i) => {
                        const x = (i / (sortedWeights.length - 1)) * 280 + 10;
                        const y = 90 - ((w.weightKg - minW) / range) * 80;
                        return `${x},${y}`;
                      })
                      .join(' ');

                    return (
                      <>
                        <polyline fill="none" stroke="#558B55" strokeWidth="3" strokeLinecap="round" points={points} />
                        {sortedWeights.map((w, i) => {
                          const x = (i / (sortedWeights.length - 1)) * 280 + 10;
                          const y = 90 - ((w.weightKg - minW) / range) * 80;
                          return (
                            <g key={w.id}>
                              <circle cx={x} cy={y} r="4" fill="#FFFFFF" stroke="#558B55" strokeWidth="2.5" />
                              <text x={x} y={y - 8} fontSize="9" fontWeight="bold" fill="#2D1F17" textAnchor="middle">
                                {w.weightKg}
                              </text>
                            </g>
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
