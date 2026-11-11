import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TodayView } from './views/TodayView';
import { ScheduleView } from './views/ScheduleView';
import { PrayerMealView } from './views/PrayerMealView';
import { FitnessView } from './views/FitnessView';
import { SettingsView } from './views/SettingsView';
import { BottomNav } from './components/BottomNav';
import { FloatingActionButton } from './components/FloatingActionButton';
import { QuickAddModal } from './components/QuickAddModal';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'today':
        return <TodayView />;
      case 'schedule':
        return <ScheduleView />;
      case 'worship':
        return <PrayerMealView />;
      case 'fitness':
        return <FitnessView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <TodayView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-rise-espresso flex flex-col selection:bg-rise-peach">
      {/* Centered Responsive Container (Mobile-First) */}
      <main className="w-full max-w-xl mx-auto flex-1 flex flex-col relative px-3 sm:px-6">
        
        {/* Dynamic View Content */}
        <div className="flex-1 w-full pt-2">
          {renderActiveView()}
        </div>

        {/* Floating Action Button */}
        {(activeTab === 'today' || activeTab === 'schedule') && (
          <FloatingActionButton />
        )}

        {/* Quick Add Modal */}
        <QuickAddModal />
      </main>

      {/* Persistent Bottom Navigation (Docked cleanly at the bottom) */}
      <div className="sticky bottom-0 z-40 w-full bg-white/95 backdrop-blur-md border-t border-rise-border/80 shadow-xs">
        <div className="max-w-xl mx-auto">
          <BottomNav />
        </div>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
