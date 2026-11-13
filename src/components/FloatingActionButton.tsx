import React from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingActionButton: React.FC = () => {
  const { setIsQuickModalOpen, setQuickModalTab } = useApp();

  const handleOpen = () => {
    setQuickModalTab('habit');
    setIsQuickModalOpen(true);
  };

  return (
    <button
      onClick={handleOpen}
      className="fixed bottom-safe-fab right-5 sm:right-[max(1.5rem,calc((100vw-36rem)/2+1.5rem))] w-14 h-14 rounded-full bg-[#362215] text-white flex items-center justify-center shadow-float hover:bg-[#25170E] transition-all duration-200 active:scale-90 z-30 group"
      aria-label="Tambah Aktivitas Baru"
      title="Tambah Aktivitas / Catatan Cepat"
    >
      <Plus className="w-6 h-6 stroke-[2.5] transition-transform group-hover:rotate-90 duration-200" />
    </button>
  );
};
