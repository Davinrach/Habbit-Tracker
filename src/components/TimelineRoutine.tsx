import React from 'react';
import { useApp } from '../context/AppContext';
import { HabitCategory } from '../types';
import { 
  Check, 
  Clock, 
  GlassWater, 
  Sparkles, 
  Footprints, 
  Dumbbell, 
  Activity, 
  Sun,
  Flame,
  Bike,
  Plus
} from 'lucide-react';
import { sound } from '../utils/sound';

export const TimelineRoutine: React.FC = () => {
  const { habits, toggleHabit, selectedDate, setActiveTab, setIsQuickModalOpen, setQuickModalTab } = useApp();

  const getCategoryConfig = (category: HabitCategory, title: string) => {
    if (title.toLowerCase().includes('meditate')) {
      return {
        bg: 'bg-[#EBF5EE]',
        text: 'text-[#558B55]',
        icon: Bike,
      };
    }
    if (category === 'water') {
      return {
        bg: 'bg-[#FFEADB]',
        text: 'text-[#E7784E]',
        icon: GlassWater,
      };
    }
    if (category === 'meditate') {
      return {
        bg: 'bg-[#EBF5EE]',
        text: 'text-[#558B55]',
        icon: Sparkles,
      };
    }
    if (category === 'stretch') {
      return {
        bg: 'bg-[#F4EBF7]',
        text: 'text-[#9E6E9F]',
        icon: Activity,
      };
    }
    if (category === 'walk') {
      return {
        bg: 'bg-[#F8EFE4]',
        text: 'text-[#B07E4C]',
        icon: Footprints,
      };
    }
    if (category === 'prayer') {
      return {
        bg: 'bg-[#E6F5F2]',
        text: 'text-[#2A9D8F]',
        icon: Sun,
      };
    }
    if (category === 'fitness') {
      return {
        bg: 'bg-[#FFEFEA]',
        text: 'text-[#E25822]',
        icon: Dumbbell,
      };
    }
    return {
      bg: 'bg-rise-peach/50',
      text: 'text-rise-orangeDark',
      icon: Flame,
    };
  };

  const handleToggle = (habitId: string) => {
    toggleHabit(habitId, selectedDate);
    sound.playCheck();
  };

  const handleAddFirstHabit = () => {
    setQuickModalTab('habit');
    setIsQuickModalOpen(true);
  };

  return (
    <div className="px-5 py-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 mt-1">
        <h2 className="text-base font-bold text-rise-espresso tracking-tight">
          Daily routine
        </h2>
        {habits.length > 0 && (
          <button
            onClick={() => setActiveTab('schedule')}
            className="text-xs font-semibold text-[#8C857E] hover:text-rise-espresso transition-colors"
          >
            See all
          </button>
        )}
      </div>

      {/* Clean Slate Empty State */}
      {habits.length === 0 ? (
        <div className="p-7 rounded-3xl bg-white border border-[#EAE3D9] shadow-card text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FFEADA] text-[#E8733E] flex items-center justify-center mb-3">
            <Sparkles className="w-7 h-7 stroke-[2]" />
          </div>
          <h3 className="text-sm font-bold text-rise-espresso">
            Belum Ada Rutinitas Harian
          </h3>
          <p className="text-xs text-rise-muted mt-1 max-w-xs leading-relaxed">
            Mulai bangun kebiasaan baik hari ini. Tambahkan rutinitas pertama Anda sekarang.
          </p>
          <button
            onClick={handleAddFirstHabit}
            className="mt-4 px-5 py-2.5 rounded-full bg-[#362215] text-white text-xs font-bold shadow-sm hover:bg-[#25170E] active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tambah Rutinitas</span>
          </button>
        </div>
      ) : (
        /* Timeline List */
        <div className="relative">
          {/* Dotted Vertical Timeline Connector */}
          <div className="absolute left-[13px] top-6 bottom-6 w-[2px] border-l-2 border-dotted border-[#D5CCC1] pointer-events-none" />

          <div className="space-y-3.5">
            {habits.map((habit) => {
              const isCompleted = habit.completedDates.includes(selectedDate);
              const categoryConfig = getCategoryConfig(habit.category, habit.title);
              const Icon = categoryConfig.icon;

              return (
                <div key={habit.id} className="relative flex items-center gap-3 group">
                  {/* Checkbox Trigger */}
                  <button
                    onClick={() => handleToggle(habit.id)}
                    className="z-10 flex-shrink-0 transition-transform active:scale-90 focus:outline-none"
                    aria-label={isCompleted ? 'Tandai belum selesai' : 'Tandai selesai'}
                  >
                    {isCompleted ? (
                      <div className="w-7 h-7 rounded-full bg-[#E8733E] flex items-center justify-center text-white shadow-sm transition-all scale-105">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-white border-2 border-[#D5CCC1] flex items-center justify-center hover:border-[#E8733E] transition-colors" />
                    )}
                  </button>

                  {/* Habit Card */}
                  <div
                    onClick={() => handleToggle(habit.id)}
                    className="flex-1 flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#F0EAE1] transition-all duration-200 cursor-pointer shadow-[0_2px_10px_rgba(45,31,23,0.03)] hover:shadow-soft active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      {/* Pastel Category Icon */}
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${categoryConfig.bg} ${categoryConfig.text}`}
                      >
                        <Icon className="w-5 h-5 stroke-[2.2]" />
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-rise-espresso leading-snug">
                          {habit.title}
                        </h4>
                        <p className="text-[11px] font-medium text-rise-muted mt-0.5">
                          Streak {habit.streak} days
                        </p>
                      </div>
                    </div>

                    {/* Duration Badge with Clock */}
                    <div className="flex items-center gap-2.5 pl-2">
                      <div className="h-6 w-[1px] bg-[#EAE3D9]" />
                      <div className="flex items-center gap-1 text-[11px] font-medium text-rise-muted flex-shrink-0">
                        <Clock className="w-3.5 h-3.5 text-rise-muted" />
                        <span>{habit.durationMinutes} min</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
