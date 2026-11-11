import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Habit, HabitCategory } from '../types';
import { X, Trash2, Check } from 'lucide-react';

interface EditHabitModalProps {
  habit: Habit;
  onClose: () => void;
}

export const EditHabitModal: React.FC<EditHabitModalProps> = ({ habit, onClose }) => {
  const { updateHabit, deleteHabit } = useApp();

  const [title, setTitle] = useState(habit.title);
  const [category, setCategory] = useState<HabitCategory>(habit.category);
  const [duration, setDuration] = useState(habit.durationMinutes.toString());
  const [timeTarget, setTimeTarget] = useState(habit.timeTarget || '07:00');
  const [notes, setNotes] = useState(habit.notes || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    updateHabit(habit.id, {
      title: title.trim(),
      category,
      durationMinutes: parseInt(duration) || 5,
      timeTarget,
      notes: notes.trim(),
    });

    onClose();
  };

  const handleDelete = () => {
    if (confirm(`Hapus rutinitas "${habit.title}"?`)) {
      deleteHabit(habit.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-rise-border/80 max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-rise-border/60">
          <h3 className="text-base font-bold text-rise-espresso">Edit Rutinitas</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-rise-bg flex items-center justify-center text-rise-muted hover:text-rise-espresso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="py-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-rise-muted block mb-1">
              Nama Rutinitas
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-rise-bg border border-rise-border text-sm font-semibold text-rise-espresso focus:outline-none focus:border-rise-espresso"
              required
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
                  onClick={() => setCategory(cat.id as HabitCategory)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                    category === cat.id
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
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-rise-bg border border-rise-border text-sm font-semibold text-rise-espresso focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-rise-muted block mb-1">
                Target Waktu
              </label>
              <input
                type="time"
                value={timeTarget}
                onChange={(e) => setTimeTarget(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-rise-bg border border-rise-border text-sm font-semibold text-rise-espresso focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-rise-muted block mb-1">
              Catatan Pengingat
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan tambahan"
              className="w-full px-3.5 py-2 rounded-xl bg-rise-bg border border-rise-border text-xs text-rise-espresso focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleDelete}
              className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all active:scale-95 flex items-center justify-center"
              title="Hapus Rutinitas"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#362215] text-white font-bold text-sm rounded-xl shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

