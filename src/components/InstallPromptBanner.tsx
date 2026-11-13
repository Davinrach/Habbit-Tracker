import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X } from 'lucide-react';

export const InstallPromptBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (installed)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  if (isStandalone || isDismissed) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsDismissed(true);
      }
      setDeferredPrompt(null);
    } else {
      // Guide user if browser hasn't fired beforeinstallprompt
      alert('Untuk memasang RISE di layar utama:\n1. Ketuk ikon titik tiga (⋮) di pojok kanan atas Chrome\n2. Pilih "Tambahkan ke Layar Utama" atau "Install Aplikasi"');
    }
  };

  return (
    <div className="mx-5 my-2 p-3.5 bg-gradient-to-r from-[#FFEADA] to-[#FFF3E8] rounded-2xl border border-[#FCD2B8]/80 shadow-card flex items-center justify-between gap-3 animate-fade-in">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#E8733E] flex-shrink-0">
          <Smartphone className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-rise-espresso leading-snug">
            Pasang RISE ke Layar Utama
          </h4>
          <p className="text-[11px] text-rise-espresso/70 mt-0.5">
            Gunakan seperti aplikasi asli tanpa bilah browser
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={handleInstallClick}
          className="px-3 py-1.5 bg-[#362215] text-white rounded-xl text-xs font-bold shadow-2xs hover:bg-[#25170E] active:scale-95 transition-all flex items-center gap-1"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Pasang</span>
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1.5 text-rise-muted hover:text-rise-espresso rounded-lg"
          title="Tutup banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
