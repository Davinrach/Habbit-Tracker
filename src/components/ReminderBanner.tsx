import React, { useState } from 'react';

export const ReminderBanner: React.FC = () => {
  const [isReminderSet, setIsReminderSet] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const handleSetReminder = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setIsReminderSet(true);
          setNotificationMsg('🔔 Notifikasi rutinitas pagi aktif!');
          new Notification('RISE Habit Tracker', {
            body: 'Pengingat pagi telah aktif! Jangan lupa minum air dan sholat tepat waktu.',
            icon: '/vite.svg',
          });
        } else {
          setIsReminderSet(true);
          setNotificationMsg('🔔 Pengingat lokal aktif!');
        }
      });
    } else {
      setIsReminderSet(true);
      setNotificationMsg('🔔 Pengingat lokal aktif!');
    }

    setTimeout(() => {
      setNotificationMsg(null);
    }, 3500);
  };

  return (
    <div className="px-5 py-2">
      <div className="relative overflow-hidden rounded-3xl bg-[#FFE4D3] p-5 shadow-card border border-[#FCD2B8]/40">
        <div className="flex items-center justify-between gap-3">
          <div className="max-w-[65%] z-10">
            <h3 className="text-base font-bold text-rise-espresso leading-snug">
              Set the reminder
            </h3>
            <p className="text-xs text-rise-espresso/75 mt-1 leading-relaxed">
              Never miss your morning routine! Set a reminder to stay on track
            </p>
            <button
              onClick={handleSetReminder}
              className={`mt-3 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 shadow-sm ${
                isReminderSet
                  ? 'bg-[#5B8C5A] text-white'
                  : 'bg-rise-espresso text-white hover:bg-rise-espressoLight'
              }`}
            >
              {isReminderSet ? '✓ Active' : 'Set Now'}
            </button>
          </div>

          {/* Bell Illustration */}
          <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center -mr-2">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
              {/* Sound waves left */}
              <path d="M22 36 C18 42 18 52 22 58" stroke="#89B078" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M14 30 C8 40 8 60 14 68" stroke="#89B078" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
              {/* Sound waves right */}
              <path d="M78 36 C82 42 82 52 78 58" stroke="#89B078" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M86 30 C92 40 92 60 86 68" stroke="#89B078" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
              {/* Bell Top Handle */}
              <path d="M46 22 C46 19 54 19 54 22" stroke="#E66A2C" strokeWidth="4" strokeLinecap="round" />
              {/* Bell Body */}
              <path
                d="M50 24 C38 24 34 38 32 54 C30 64 26 68 24 70 L76 70 C74 68 70 64 68 54 C66 38 62 24 50 24 Z"
                fill="#FF7A30"
              />
              <path
                d="M50 24 C57 24 62 38 64 54 C66 64 70 68 72 70 L76 70 C74 68 70 64 68 54 C66 38 62 24 50 24 Z"
                fill="#E8611D"
              />
              {/* Bell Bottom Rim */}
              <rect x="22" y="70" width="56" height="5" rx="2.5" fill="#DE5815" />
              {/* Clapper */}
              <ellipse cx="50" cy="76" rx="6" ry="4" fill="#3D2817" />
              {/* Little sparkles */}
              <circle cx="28" cy="22" r="2" fill="#E8804C" />
              <circle cx="70" cy="20" r="1.5" fill="#E8804C" />
            </svg>
          </div>
        </div>

        {notificationMsg && (
          <div className="mt-3 py-1.5 px-3 bg-white/90 backdrop-blur rounded-xl text-xs font-semibold text-[#5B8C5A] border border-[#5B8C5A]/20 transition-all animate-fade-in flex items-center justify-between">
            <span>{notificationMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};

