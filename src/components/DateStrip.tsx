import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';

export const DateStrip: React.FC = () => {
  const { selectedDate, setSelectedDate, habits, prayerStatus } = useApp();

  // Generate 7 days centered on or starting around the current week
  const weekDays = useMemo(() => {
    const current = new Date(selectedDate);
    // Get Monday of this week (0=Sun, 1=Mon, ..., 6=Sat)
    const day = current.getDay();
    const diffToMonday = current.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(current.setDate(diffToMonday));

    const days = [];
    const dayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const dateNum = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${dateNum}`;

      days.push({
        name: dayNames[i],
        dateNumber: d.getDate(),
        fullDate: dateStr,
      });
    }
    return days;
  }, [selectedDate]);

  return (
    <div className="px-5 py-2">
      <div className="flex items-center justify-between gap-1">
        {weekDays.map((item) => {
          const isSelected = item.fullDate === selectedDate;
          
          // Check if this day has any completed habit or prayer
          const hasHabitCompleted = habits.some((h) => h.completedDates.includes(item.fullDate));
          const hasPrayerCompleted = Object.values(prayerStatus[item.fullDate] || {}).some(Boolean);
          const hasActivity = hasHabitCompleted || hasPrayerCompleted;

          return (
            <button
              key={item.fullDate}
              onClick={() => setSelectedDate(item.fullDate)}
              className="flex flex-col items-center flex-1 py-1 group focus:outline-none transition-transform active:scale-95"
            >
              <span className={`text-[11px] font-medium mb-1 transition-colors ${
                isSelected ? 'text-rise-espresso font-bold' : 'text-rise-muted'
              }`}>
                {item.name}
              </span>
              <div
                className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                  isSelected
                    ? 'bg-rise-espresso text-white shadow-md scale-105'
                    : 'bg-white text-rise-espresso border border-rise-border/70 hover:bg-rise-peach/30'
                }`}
              >
                {item.dateNumber}
                {hasActivity && !isSelected && (
                  <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#E8733E]" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
