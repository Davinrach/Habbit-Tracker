import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Calendar, Moon, Dumbbell, Settings } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'today', label: 'Hari Ini', icon: Home },
    { id: 'schedule', label: 'Jadwal', icon: Calendar },
    { id: 'worship', label: 'Ibadah & Makan', icon: Moon },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ] as const;

  return (
    <nav className="w-full px-2 pt-1.5 pb-2.5 select-none">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 focus:outline-none ${
                isActive ? 'text-[#E8733E]' : 'text-rise-muted hover:text-rise-espresso'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-[#FFEADA]/80 -translate-y-0.5' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
