import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INDONESIAN_CITIES } from '../utils/prayer';
import { User, MapPin, Target, Smartphone, Download, RotateCcw, Check } from 'lucide-react';
import { Avatar } from '../components/Avatar';

export const SettingsView: React.FC = () => {
  const { user, updateUser, habits, pushUpSets, weightRecords } = useApp();
  const [nameInput, setNameInput] = useState(user.name);
  const [avatarInput, setAvatarInput] = useState(user.avatar || 'tiger');
  const [cityInput, setCityInput] = useState(user.city);
  const [heightInput, setHeightInput] = useState(user.heightCm.toString());
  const [pushUpGoalInput, setPushUpGoalInput] = useState(user.pushUpDailyGoal.toString());
  const [weightGoalInput, setWeightGoalInput] = useState(user.weightGoalKg.toString());
  const [waterGoalInput, setWaterGoalInput] = useState(user.waterDailyGoal.toString());
  const [savedNotice, setSavedNotice] = useState(false);

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
      <div className="px-6 pt-5 pb-2">
        <h1 className="text-2xl font-bold text-rise-espresso">Pengaturan</h1>
        <p className="text-xs text-rise-muted mt-0.5">Sesuaikan preferensi & profil akun Anda</p>
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

        {/* PWA / Mobile instructions */}
        <div className="p-4 bg-[#FFEADA]/60 rounded-3xl border border-[#FCD2B8]/60 flex items-start gap-3">
          <Smartphone className="w-5 h-5 text-[#D96B43] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-rise-espresso">Buka di Smartphone (PWA)</h4>
            <p className="text-[11px] text-rise-espresso/80 mt-1 leading-relaxed">
              Buka website ini lewat browser Chrome atau Safari di smartphone Anda, lalu pilih <strong>"Tambahkan ke Layar Utama" (Add to Home Screen)</strong> untuk pengalaman aplikasi mobile penuh!
            </p>
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
