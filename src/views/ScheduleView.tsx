import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DateStrip } from '../components/DateStrip';
import { Plus, Trash2, CheckCircle2, Clock, Sparkles, Edit3, Bell } from 'lucide-react';
import { EditHabitModal } from '../components/EditHabitModal';
import { setAndroidAlarm } from '../utils/alarm';
import { Habit } from '../types';

export const ScheduleView: React.FC = () => {
  const { habits, toggleHabit, deleteHabit, selectedDate, setIsQuickModalOpen, setQuickModalTab } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSetAlarm = (timeStr: string, title: string) => {
    const res = setAndroidAlarm(timeStr, title);
    setToastMsg(res.message);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'Semua' },
    { id: 'water', label: 'Hidrasi' },
    { id: 'meditate', label: 'Mindset' },
    { id: 'stretch', label: 'Stretching' },
    { id: 'fitness', label: 'Olahraga' },
    { id: 'prayer', label: 'Ibadah' },
  ];

  const filteredHabits = habits.filter((h) => {
    if (filter === 'all') return true;
    return h.category === filter;
  });

  return (
    <div className="pb-28">
      {/* Top Bar */}
      <div className="px-6 pt-5 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-rise-espresso">Jadwal Harian</h1>
          <p className="text-xs text-rise-muted mt-0.5">Atur dan pantau semua rutinitas</p>
        </div>
        <button
          onClick={() => {
            setQuickModalTab('habit');
            setIsQuickModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#362215] text-white rounded-full text-xs font-bold shadow-sm active:scale-95 transition-all hover:bg-[#25170E]"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Tambah</span>
        </button>
      </div>

      <DateStrip />

      {/* Category Filter Pills */}
      <div className="px-5 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filter === c.id
                ? 'bg-rise-espresso text-white shadow-sm'
                : 'bg-white text-rise-muted border border-rise-border/60 hover:bg-rise-peach/30'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Habits List */}
      <div className="px-5 py-3 space-y-3">
        {filteredHabits.length === 0 ? (
          <div className="text-center py-12 bg-white/60 rounded-3xl border border-rise-border/50 p-6">
            <Sparkles className="w-10 h-10 text-rise-muted/40 mx-auto mb-2" />
            <p className="text-sm font-semibold text-rise-espresso">Belum ada rutinitas di kategori ini</p>
            <p className="text-xs text-rise-muted mt-1">Tap tombol "+ Tambah" di atas untuk menambahkan aktivitas baru.</p>
          </div>
        ) : (
          filteredHabits.map((habit) => {
            const isCompleted = habit.completedDates.includes(selectedDate);
            return (
              <div
                key={habit.id}
                className="p-4 bg-white rounded-2xl border border-rise-border/60 shadow-card flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={() => toggleHabit(habit.id, selectedDate)}
                    className="focus:outline-none transition-transform active:scale-90"
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-[#E8733E] text-white shadow-sm'
                          : 'border-2 border-rise-border hover:border-[#E8733E]'
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </button>

                  <div>
                    <h3
                      className={`text-sm font-bold transition-all ${
                        isCompleted ? 'text-rise-muted line-through' : 'text-rise-espresso'
                      }`}
                    >
                      {habit.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-rise-muted mt-1 font-medium">
                      {habit.timeTarget && (
                        <span className="flex items-center gap-1 text-rise-espresso font-semibold">
                          <Clock className="w-3 h-3 text-rise-muted" /> {habit.timeTarget}
                        </span>
                      )}
                      <span>· Durasi: {habit.durationMinutes} menit</span>
                      <span>· Streak: {habit.streak} hari</span>
                    </div>
                    {habit.notes && (
                      <p className="text-[11px] text-rise-muted/80 mt-1 italic">{habit.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {habit.timeTarget && (
                    <button
                      onClick={() => handleSetAlarm(habit.timeTarget!, habit.title)}
                      className="p-2 text-rise-muted hover:text-[#E8733E] hover:bg-[#FFEADA]/60 rounded-xl transition-all active:scale-90"
                      title={`Pasang Alarm Jam HP untuk ${habit.title} (${habit.timeTarget})`}
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => setEditingHabit(habit)}
                    className="p-2 text-rise-muted hover:text-rise-espresso hover:bg-rise-bg rounded-xl transition-all"
                    title="Edit Rutinitas"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="opacity-40 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    title="Hapus Rutinitas"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Modal */}
      {editingHabit && (
        <EditHabitModal
          habit={editingHabit}
          onClose={() => setEditingHabit(null)}
        />
      )}

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
