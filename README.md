# RISE - Habit & Routine Tracker (Mobile Web)

Aplikasi mobile web habit tracker modern, minimalis, dan hangat (*warm cozy minimalist*) untuk membantu Anda membangun rutinitas harian yang konsisten dan seimbang.

## Fitur Utama

- 📅 **Jadwal & Rutinitas Harian**: Manajemen aktivitas harian, filter kategori, durasi, target waktu, dan pencatatan streak.
- 🕌 **Pengingat & Jadwal Sholat 5 Waktu**: Perhitungan waktu sholat astronomis akurat (metode Kemenag RI offline) untuk kota-kota besar di Indonesia dengan hitung mundur sholat berikutnya dan checklist sholat.
- 🥗 **Pola Makan & Hidrasi Teratur**:
  - Sarapan (06.30–07.30 WIB)
  - Susu Protein (09.30–10.00 WIB)
  - Makan Siang (12.00–13.00 WIB)
  - Makan Sore (15.30–16.30 WIB)
  - Makan Malam (18.30–19.30 WIB)
  - Pelacak minum air harian (target 8 gelas / ~2 liter) dengan counter 1-ketukan.
- 💪 **Fitness Tracker**:
  - **Push Up**: Quick counter (+5, +10), progress bar target harian, streak hari berturut-turut, grafik performa mingguan, dan riwayat set per jam.
  - **Timbangan Berat Badan**: Pencatatan berat badan (kg), selisih dari target, kalkulator BMI otomatis, dan grafik tren garis interaktif.
- ⚙️ **Pengaturan & Kustomisasi**:
  - Ganti profil, pilih avatar maskot (Harimau, Kucing, Panda, Beruang, Rubah).
  - Pilihan kota Indonesia untuk waktu sholat.
  - Atur target harian (push up, timbangan, air minum).
  - Ekspor/cadangkan data ke format JSON.
- 📱 **PWA Ready**: Dapat diinstal ke layar utama (*Add to Home Screen*) di smartphone Android dan iOS.

## Teknologi

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Storage**: LocalStorage & PWA Service Worker (Offline Support)

## Cara Menjalankan Secara Lokal

1. Clone repositori:
   ```bash
   git clone https://github.com/Davinrach/Habbit-Tracker.git
   cd Habbit-Tracker
   ```

2. Install dependensi:
   ```bash
   npm install
   ```

3. Jalankan development server:
   ```bash
   npm run dev
   ```

4. Buka browser di `http://localhost:5173`.
