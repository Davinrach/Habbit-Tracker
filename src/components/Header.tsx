import React from 'react';
import { useApp } from '../context/AppContext';
import { Avatar } from './Avatar';

export const Header: React.FC = () => {
  const { user, selectedDate, setActiveTab } = useApp();

  const dateObj = new Date(selectedDate);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const hour = new Date().getHours();
  let greeting = 'Morning';
  if (hour >= 12 && hour < 17) greeting = 'Afternoon';
  else if (hour >= 17) greeting = 'Evening';

  return (
    <header className="flex items-center justify-between px-6 pt-5 pb-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-rise-espresso">
          {greeting}, {user.name}
        </h1>
        <p className="text-xs font-medium text-rise-muted mt-0.5">
          {formattedDate}
        </p>
      </div>

      {/* Avatar */}
      <button 
        onClick={() => setActiveTab('settings')}
        className="relative group transition-transform active:scale-95 focus:outline-none"
        title="Pengaturan Profil"
      >
        <Avatar type={user.avatar} className="w-12 h-12" />
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
      </button>
    </header>
  );
};

