import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INDONESIAN_CITIES } from '../utils/prayer';
import { 
  User, 
  MapPin, 
  Target, 
  Smartphone, 
  Download, 
  RotateCcw, 
  Check,
  HelpCircle,
  Wallet,
  Bell,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Avatar } from '../components/Avatar';

export const SettingsView: React.FC = () => {
  const { user, updateUser, habits, pushUpSets, weightRecords, setActiveTab } = useApp();
  const [nameInput, setNameInput] = useState(user.name);
  const [avatarInput, setAvatarInput] = useState(user.avatar || 'tiger');
  const [cityInput, setCityInput] = useState(user.city);
  const [heightInput, setHeightInput] = useState(user.heightCm.toString());
  const [pushUpGoalInput, setPushUpGoalInput] = useState(user.pushUpDailyGoal.toString());
  const [weightGoalInput, setWeightGoalInput] = useState(user.weightGoalKg.toString());
  const [waterGoalInput, setWaterGoalInput] = useState(user.waterDailyGoal.toString());
  const [pocketMoneyInput, setPocketMoneyInput] = useState((user.dailyPocketMoney || 80000).toString());
  const [savedNotice, setSavedNotice] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState<string | null>('pwa');

  const toggleTopic = (id: string) => {
    setExpandedTopic((prev) => (prev === id ? null : id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: nameInput.trim() || 'Budi',
      avatar: avatarInput,
      city: cityInput,
      heightCm: parseInt(heightInput) || 170,
      pushUpDailyGoal: parseInt(pushUpGoalInput) || 50,
      weightGoalKg: parseFloat(weightGoalInput) || 65,
      waterDailyGoal: parseInt(waterGoalInput) || 8,
      dailyPocketMoney: parseInt(pocketMoneyInput.replace(/\D/g, '')) || 80000,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleExportData = () => {
    const data = {
      user,
      habits,
      pushUpSets,
      weightRecords,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RISE_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin mereset seluruh data kembali ke setelan awal?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="px-6 pt-5 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-rise-espresso">Pengaturan</h1>
          <p className="text-xs text-rise-muted mt-0.5">Sesuaikan preferensi & profil akun Anda</p>
        </div>
        <button
          type="button"
          onClick={() => setActiveTab('today')}
          className="px-3.5 py-1.5 bg-rise-bg border border-rise-border/80 text-rise-espresso rounded-xl text-xs font-bold hover:bg-white active:scale-95 transition-all shadow-2xs"
        >
          ← Kembali
        </button>
      </div>

      <form onSubmit={handleSave} className="px-5 py-3 space-y-4">
        {/* Profile Card */}
        <div className="bg-white p-5 rounded-3xl border border-rise-border/60 shadow-card">
          <div className="flex items-center gap-2 mb-4 text-rise-espresso font-bold text-sm">
            <User className="w-4 h-4 text-[#D96B43]" />
            <span>Profil Pengguna</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-rise-muted block mb-2">
                Pilih Avatar Maskot
              </label>
              <div className="flex items-center justify-between gap-2 p-2 bg-rise-bg rounded-2xl border border-rise-border/80">
                {[
                  { id: 'tiger', label: 'Harimau' },
                  { id: 'cat', label: 'Kucing' },
                  { id: 'panda', label: 'Panda' },
                  { id: 'bear', label: 'Beruang' },
                  { id: 'fox', label: 'Rubah' },
                ].map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setAvatarInput(av.id)}
                    className={`flex flex-col items-center p-1 rounded-xl transition-all ${
                      avatarInput === av.id
                        ? 'bg-white shadow-sm ring-2 ring-[#E8733E] scale-105'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Avatar type={av.id} className="w-10 h-10" />
                    <span className="text-[10px] font-bold text-rise-espresso mt-1">
                      {av.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-rise-muted block mb-1">
                Nama Panggilan
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-rise-bg border border-rise-border text-sm font-semibold text-rise-espresso focus:outline-none focus:border-rise-espresso"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-rise-muted block mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#2A9D8F]" />
                <span>Kota Jadwal Sholat (Waktu Indonesia)</span>
              </label>
              <select
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-rise-bg border border-rise-border text-sm font-semibold text-rise-espresso focus:outline-none focus:border-rise-espresso"
              >
                {INDONESIAN_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} (UTC+{c.timezone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-rise-muted block mb-1">
                Tinggi Badan (cm) — untuk perhitungan BMI
              </label>
              <input
                type="number"
                value={heightInput}
                onChange={(e) => setHeightInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-rise-bg border border-rise-border text-sm font-semibold text-rise-espresso focus:outline-none focus:border-rise-espresso"
              />
            </div>
          </div>
        </div>

        {/* Goals & Targets */}
        <div className="bg-white p-5 rounded-3xl border border-rise-border/60 shadow-card">
          <div className="flex items-center gap-2 mb-4 text-rise-espresso font-bold text-sm">
            <Target className="w-4 h-4 text-[#E25822]" />
            <span>Target Harian</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-rise-muted block mb-1">
                Target Push Up
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={pushUpGoalInput}
                  onChange={(e) => setPushUpGoalInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-rise-bg border border-rise-border text-sm font-semibold text-rise-espresso focus:outline-none"
                />
                <span className="absolute right-3 top-2 text-xs font-semibold text-rise-muted">reps</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-rise-muted block mb-1">
                Target Berat
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={weightGoalInput}
                  onChange={(e) => setWeightGoalInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-rise-bg border border-rise-border text-sm font-semibold text-rise-espresso focus:outline-none"
                />
                <span className="absolute right-3 top-2 text-xs font-semibold text-rise-muted">kg</span>
              </div>
            </div>

            <div className="col-span-2">
              <label className="text-xs font-semibold text-rise-muted block mb-1">
                Target Minum Air
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={waterGoalInput}
                  onChange={(e) => setWaterGoalInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-rise-bg border border-rise-border text-sm font-semibold text-rise-espresso focus:outline-none"
                />
                <span className="absolute right-3 top-2 text-xs font-semibold text-rise-muted">gelas/hari</span>
              </div>
            </div>

            <div className="col-span-2">
              <label className="text-xs font-semibold text-rise-muted block mb-1">
                Uang Saku Harian (Rp)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2 text-xs font-bold text-rise-muted">Rp</span>
                <input
                  type="number"
                  value={pocketMoneyInput}
                  onChange={(e) => setPocketMoneyInput(e.target.value)}
                  className="w-full pl-10 pr-16 py-2 rounded-xl bg-rise-bg border border-rise-border text-sm font-semibold text-rise-espresso focus:outline-none"
                  placeholder="80000"
                />
                <span className="absolute right-3 top-2 text-xs font-semibold text-rise-muted">/hari</span>
              </div>
              <span className="text-[10px] text-rise-muted mt-1 block">
                Digunakan untuk mengukur skala hemat vs boros harian Anda (misal: 70.000 – 80.000).
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full h-12 bg-[#362215] text-white font-bold text-sm rounded-2xl shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-[#25170E]"
        >
          {savedNotice ? (
            <>
              <Check className="w-4 h-4 text-green-400 stroke-[3]" />
              <span>Perubahan Disimpan!</span>
            </>
          ) : (
            <span>Simpan Pengaturan</span>
          )}
        </button>

        {/* Panduan & How-To / About RISE */}
        <div className="bg-white p-5 rounded-3xl border border-rise-border/60 shadow-card space-y-3">
          <div className="flex items-center gap-2 text-rise-espresso font-bold text-sm pb-1">
            <HelpCircle className="w-4 h-4 text-[#D96B43]" />
            <span>Panduan & Tentang Aplikasi (How-To)</span>
          </div>

          <div className="space-y-2">
            {/* Topic 1: PWA Install */}
            <div className="border border-rise-border/70 rounded-2xl overflow-hidden bg-rise-bg/50">
              <button
                type="button"
                onClick={() => toggleTopic('pwa')}
                className="w-full p-3 flex items-center justify-between text-left text-xs font-bold text-rise-espresso hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#D96B43]" />
                  <span>Pasang Aplikasi ke Layar HP (PWA)</span>
                </div>
                {expandedTopic === 'pwa' ? (
                  <ChevronUp className="w-4 h-4 text-rise-muted" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-rise-muted" />
                )}
              </button>
              {expandedTopic === 'pwa' && (
                <div className="p-3.5 pt-0 text-xs text-rise-espresso/80 space-y-2 border-t border-rise-border/40 bg-white">
                  <p className="leading-relaxed">
                    RISE adalah <strong>Progressive Web App (PWA)</strong> yang dapat dipasang di Android dan berjalan seperti aplikasi Play Store:
                  </p>
                  <ol className="list-decimal pl-4 space-y-1 text-[11px] text-rise-espresso/90 font-medium">
                    <li>Buka RISE lewat browser <strong>Chrome</strong> di HP Android Anda.</li>
                    <li>Ketuk ikon titik tiga (<strong>⋮</strong>) di pojok kanan atas browser.</li>
                    <li>Pilih <strong>"Instal aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.</li>
                    <li>Ikon harimau RISE akan langsung muncul di layar utama HP Anda.</li>
                  </ol>
                  <div className="mt-2 p-2.5 bg-[#FFEADA]/50 rounded-xl border border-[#FCD2B8]/50 text-[11px] text-rise-espresso/90">
                    <p className="font-bold text-rise-espresso flex items-center gap-1">
                      <span>⚡</span> <span>Fitur Pintasan Cepat (Widget Aksi):</span>
                    </p>
                    <p className="mt-1 leading-relaxed">
                      Setelah terpasang, <strong>tekan & tahan (long-press) ikon RISE</strong> di layar HP Anda. Akan muncul menu pintasan langsung ke <em>Tabungan</em>, <em>Jadwal Sholat</em>, atau <em>Fitness</em>. Di HP Android, pintasan ini bisa Anda tahan lalu tarik (drag) ke Home Screen sebagai tombol widget 1-ketuk!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Topic 2: Keuangan & Tabungan */}
            <div className="border border-rise-border/70 rounded-2xl overflow-hidden bg-rise-bg/50">
              <button
                type="button"
                onClick={() => toggleTopic('finance')}
                className="w-full p-3 flex items-center justify-between text-left text-xs font-bold text-rise-espresso hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-[#2A9D8F]" />
                  <span>Sistem Tabungan & Skala Boros</span>
                </div>
                {expandedTopic === 'finance' ? (
                  <ChevronUp className="w-4 h-4 text-rise-muted" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-rise-muted" />
                )}
              </button>
              {expandedTopic === 'finance' && (
                <div className="p-3.5 pt-0 text-xs text-rise-espresso/80 space-y-2 border-t border-rise-border/40 bg-white">
                  <p className="leading-relaxed">
                    Sistem keuangan RISE didesain ringkas berdasarkan arus kas harian Anda:
                  </p>
                  <ul className="space-y-1.5 text-[11px] text-rise-espresso/90 font-medium">
                    <li>• <strong>Uang Masuk:</strong> Jatah uang saku harian Anda (default Rp 80.000) otomatis dihitung setiap hari + pemasukan ekstra yang Anda catat.</li>
                    <li>• <strong>Uang Keluar:</strong> Pengeluaran makan, jajan, transportasi, atau belanja.</li>
                    <li>• <strong>Saldo Sekarang:</strong> Sisa uang bersih Anda hari ini yang otomatis dihitung menjadi tabungan harian.</li>
                    <li>• <strong>Skala Boros:</strong> Memberi indikator visual instan (Sangat Hemat, Wajar, Mendekati Batas, atau Boros) tanpa tulisan berbelit-belit.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Topic 3: Alarm Jam HP */}
            <div className="border border-rise-border/70 rounded-2xl overflow-hidden bg-rise-bg/50">
              <button
                type="button"
                onClick={() => toggleTopic('alarm')}
                className="w-full p-3 flex items-center justify-between text-left text-xs font-bold text-rise-espresso hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#E25822]" />
                  <span>Sambung Alarm ke Jam HP Android</span>
                </div>
                {expandedTopic === 'alarm' ? (
                  <ChevronUp className="w-4 h-4 text-rise-muted" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-rise-muted" />
                )}
              </button>
              {expandedTopic === 'alarm' && (
                <div className="p-3.5 pt-0 text-xs text-rise-espresso/80 space-y-2 border-t border-rise-border/40 bg-white">
                  <p className="leading-relaxed">
                    Anda bisa langsung menyetel jam HP dari jadwal sholat atau rutinitas harian:
                  </p>
                  <ol className="list-decimal pl-4 space-y-1 text-[11px] text-rise-espresso/90 font-medium">
                    <li>Ketuk tombol <strong>Lonceng (🔔)</strong> di kartu jadwal sholat atau rutinitas.</li>
                    <li>HP Android akan langsung membuka aplikasi <strong>Jam / Alarm</strong> bawaan (Google Clock, Xiaomi Clock, Samsung Clock, dll).</li>
                    <li>Jam, menit, dan label alarm otomatis terisi. Anda cukup menekan tombol <strong>Simpan (Save)</strong> di HP.</li>
                  </ol>
                </div>
              )}
            </div>

            {/* Topic 4: Tentang RISE */}
            <div className="border border-rise-border/70 rounded-2xl overflow-hidden bg-rise-bg/50">
              <button
                type="button"
                onClick={() => toggleTopic('about')}
                className="w-full p-3 flex items-center justify-between text-left text-xs font-bold text-rise-espresso hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#3B82F6]" />
                  <span>Tentang Aplikasi RISE</span>
                </div>
                {expandedTopic === 'about' ? (
                  <ChevronUp className="w-4 h-4 text-rise-muted" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-rise-muted" />
                )}
              </button>
              {expandedTopic === 'about' && (
                <div className="p-3.5 pt-0 text-xs text-rise-espresso/80 space-y-1.5 border-t border-rise-border/40 bg-white text-[11px]">
                  <p><strong>RISE Routine & Habit Tracker</strong> v1.0.0</p>
                  <p className="text-rise-muted">
                    Dibuat dengan filosofi <em>Cozy Minimalist</em>: cepat, bersih, tanpa iklan, dan bebas dari teks berlebihan.
                  </p>
                  <p className="text-rise-muted">
                    🔒 <strong>100% Offline-First:</strong> Semua data Anda disimpan langsung di memori lokal browser HP Anda. Anda dapat mencadangkan data kapan saja melalui tombol "Cadangkan Data" di bawah.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white p-5 rounded-3xl border border-rise-border/60 shadow-card space-y-2.5">
          <button
            type="button"
            onClick={handleExportData}
            className="w-full h-11 px-4 bg-rise-bg border border-rise-border rounded-xl text-xs font-bold text-rise-espresso flex items-center justify-center gap-2 hover:bg-rise-peach/30 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" /> Cadangkan Data (Export JSON)
          </button>

          <button
            type="button"
            onClick={handleResetData}
            className="w-full h-11 px-4 bg-white border border-rose-200 rounded-xl text-xs font-bold text-rose-600 flex items-center justify-center gap-2 hover:bg-rose-50 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" /> Reset ke Data Awal
          </button>
        </div>
      </form>
    </div>
  );
};
