import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('RISE ErrorBoundary caught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF7F2] text-rise-espresso flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#FFEADA] text-[#E8733E] flex items-center justify-center text-3xl mb-4 shadow-sm">
            🌱
          </div>
          <h2 className="text-xl font-bold text-rise-espresso">Pembaruan Tampilan RISE</h2>
          <p className="text-xs text-rise-muted mt-2 max-w-xs leading-relaxed">
            Aplikasi sedang menyesuaikan versi terbaru. Ketuk tombol di bawah untuk memuat ulang dengan segar.
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5 mt-5 w-full max-w-xs">
            <button
              onClick={() => {
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then((registrations) => {
                    for (const r of registrations) r.unregister();
                  });
                }
                if ('caches' in window) {
                  caches.keys().then((keys) => {
                    keys.forEach((k) => caches.delete(k));
                  });
                }
                window.location.reload();
              }}
              className="w-full py-3 bg-[#362215] text-white rounded-xl text-xs font-bold active:scale-95 shadow-sm"
            >
              Muat Ulang Halaman
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full py-2.5 bg-white border border-rose-200 text-rose-600 rounded-xl text-xs font-bold active:scale-95"
            >
              Reset Cache & Mulai Ulang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
