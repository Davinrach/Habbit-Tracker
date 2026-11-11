# PRD: Habit Tracker (Mobile Web / PWA)

| Item | Detail |
|---|---|
| Nama Produk | Habit Tracker (nama sementara) |
| Platform | Mobile Web, Progressive Web App (PWA) |
| Versi Dokumen | 1.0 (Draft) |
| Tanggal | 11 November 2026 |
| Status | Draft untuk review |

---

## 1. Ringkasan

Habit Tracker adalah aplikasi mobile web untuk membantu pengguna membangun rutinitas harian yang sehat dan konsisten. Aplikasi menggabungkan lima fitur inti dalam satu tempat: **jadwal harian, pengingat makan, pengingat sholat, tracking berat badan, dan tracking push up harian**.

## 2. Latar Belakang & Masalah

- Pengguna biasanya memakai banyak aplikasi terpisah (kalender, alarm, aplikasi sholat, catatan berat badan, dll.) sehingga rutinitas sulit dipantau.
- Pengingat yang tersebar membuat pengguna sering terlewat.
- Data progres (berat badan, push up) jarang tervisualisasi sehingga motivasi turun.

## 3. Tujuan & Non-Tujuan

### Tujuan
1. Satu aplikasi ringan untuk semua kebiasaan harian utama.
2. Pengingat tepat waktu untuk makan dan sholat.
3. Visualisasi progres berat badan dan push up yang mudah dipahami.
4. Input data cepat (maksimal 3 ketukan untuk mencatat kebiasaan).

### Non-Tujuan (di luar scope v1)
- Aplikasi native iOS/Android.
- Fitur sosial, leaderboard, atau komunitas.
- Pelacakan kalori/nutrisi detail.
- Integrasi wearable atau perangkat kesehatan.

## 4. Target Pengguna

**Persona utama:** Individu usia 18–40 tahun yang ingin hidup lebih teratur dan sehat, aktif memakai smartphone, dan membutuhkan pengingat sholat serta kebiasaan olahraga ringan.

**Kebutuhan utama:**
- Melihat agenda hari ini sekilas.
- Diingatkan tanpa harus mengatur alarm manual.
- Melihat tren berat badan dan performa push up dari waktu ke waktu.

## 5. Sasaran & Metrik Keberhasilan

| Metrik | Target (3 bulan setelah rilis) |
|---|---|
| Daily Active Users / Monthly Active Users | ≥ 40% |
| Retensi hari ke-7 | ≥ 35% |
| Rata-rata kebiasaan tercatat per hari | ≥ 3 |
| Pengguna yang mengaktifkan notifikasi | ≥ 60% |
| Waktu muat halaman utama (4G) | < 2 detik |
| Skor Lighthouse PWA | ≥ 90 |

## 6. Lingkup Fitur

### 6.1 Jadwal Harian

**Deskripsi:** Daftar aktivitas harian yang dapat dibuat, dijadwalkan, dan dicentang.

**User story**
- Sebagai pengguna, saya ingin menambah aktivitas dengan jam tertentu agar harian saya terstruktur.
- Sebagai pengguna, saya ingin mencentang aktivitas yang selesai agar progres terlihat.

**Kebutuhan fungsional**
| ID | Kebutuhan | Prioritas |
|---|---|---|
| JD-1 | Tambah, ubah, hapus aktivitas (judul, jam mulai, jam selesai, catatan) | P0 |
| JD-2 | Tampilan timeline per hari dengan navigasi hari sebelumnya/berikutnya | P0 |
| JD-3 | Tandai aktivitas selesai/belum | P0 |
| JD-4 | Aktivitas berulang (harian, hari tertentu, mingguan) | P1 |
| JD-5 | Pengingat per aktivitas (misal 10 menit sebelumnya) | P1 |
| JD-6 | Template jadwal (misal "Hari Kerja", "Akhir Pekan") | P2 |
| JD-7 | Ringkasan persentase penyelesaian harian | P1 |

**Kriteria penerimaan**
- Aktivitas muncul pada hari dan jam yang benar, berurutan berdasarkan waktu.
- Aktivitas berulang otomatis muncul di hari yang sesuai tanpa input ulang.

---

### 6.2 Pengingat Makan

**Deskripsi:** Pengingat waktu makan (sarapan, makan siang, makan malam, camilan) dengan pencatatan sudah/belum makan.

**User story**
- Sebagai pengguna, saya ingin diingatkan makan agar tidak telat atau terlewat.

**Kebutuhan fungsional**
| ID | Kebutuhan | Prioritas |
|---|---|---|
| PM-1 | Preset waktu makan (sarapan, siang, malam) yang dapat diubah | P0 |
| PM-2 | Tambah pengingat custom (misal camilan, minum air) | P1 |
| PM-3 | Notifikasi pada waktu yang ditentukan | P0 |
| PM-4 | Aksi cepat pada notifikasi/aplikasi: "Sudah makan" atau "Tunda 15 menit" | P1 |
| PM-5 | Catatan opsional (menu singkat) | P2 |
| PM-6 | Riwayat kepatuhan waktu makan (kalender mingguan) | P2 |

**Kriteria penerimaan**
- Notifikasi muncul sesuai waktu yang diatur (toleransi ±1 menit saat aplikasi terpasang sebagai PWA).
- Fitur "Tunda" memunculkan pengingat ulang sesuai durasi.

---

### 6.3 Pengingat Sholat

**Deskripsi:** Menampilkan jadwal sholat 5 waktu sesuai lokasi pengguna, dengan pengingat dan pencatatan sholat.

**User story**
- Sebagai pengguna, saya ingin melihat waktu sholat akurat di lokasi saya dan diingatkan menjelang waktunya.
- Sebagai pengguna, saya ingin mencatat sholat yang sudah dikerjakan.

**Kebutuhan fungsional**
| ID | Kebutuhan | Prioritas |
|---|---|---|
| PS-1 | Jadwal Subuh, Dzuhur, Ashar, Maghrib, Isya (opsional: Imsak, Terbit, Dhuha) berdasarkan lokasi | P0 |
| PS-2 | Deteksi lokasi otomatis (izin geolokasi) dan opsi pilih kota manual | P0 |
| PS-3 | Pengingat saat masuk waktu dan opsional X menit sebelumnya | P0 |
| PS-4 | Checklist sholat harian ("sudah dikerjakan") | P0 |
| PS-5 | Penanda sholat berikutnya dan hitung mundur | P1 |
| PS-6 | Pilihan metode perhitungan (default: Kemenag RI) | P1 |
| PS-7 | Statistik kepatuhan sholat mingguan/bulanan | P2 |
| PS-8 | Cache jadwal sehingga tetap tampil saat offline | P1 |

**Catatan teknis:** Sumber jadwal dapat memakai API publik (misal Aladhan API atau data Kemenag/MyQuran) atau perhitungan lokal dengan pustaka astronomi. Pilih satu sumber utama dan tentukan fallback. Validasi akurasi terhadap jadwal resmi Kemenag untuk wilayah Indonesia.

**Kriteria penerimaan**
- Waktu sholat sesuai jadwal resmi untuk kota yang dipilih (selisih maksimal 1–2 menit).
- Jadwal tersedia offline untuk hari yang sudah di-cache.

---

### 6.4 Tracking Berat Badan

**Deskripsi:** Mencatat berat badan secara berkala dan melihat tren menuju target.

**User story**
- Sebagai pengguna, saya ingin mencatat berat badan dan melihat grafik agar tahu perkembangan saya.

**Kebutuhan fungsional**
| ID | Kebutuhan | Prioritas |
|---|---|---|
| BB-1 | Input berat badan (kg, desimal 0,1) dengan tanggal (default hari ini) | P0 |
| BB-2 | Grafik garis tren (7 hari, 30 hari, 90 hari, semua) | P0 |
| BB-3 | Atur target berat badan dan tampilkan selisih | P1 |
| BB-4 | Ubah/hapus catatan | P0 |
| BB-5 | Hitung otomatis perubahan (naik/turun) dari catatan sebelumnya | P1 |
| BB-6 | Input tinggi badan opsional dan tampilan BMI | P2 |
| BB-7 | Pengingat menimbang (misal tiap pagi/minggu) | P2 |
| BB-8 | Ekspor data CSV | P2 |

**Kriteria penerimaan**
- Satu tanggal hanya memiliki satu catatan utama (catatan baru menimpa setelah konfirmasi).
- Grafik memperbarui otomatis setelah input.

---

### 6.5 Tracking Push Up Harian

**Deskripsi:** Mencatat jumlah push up per hari, dengan dukungan beberapa set.

**User story**
- Sebagai pengguna, saya ingin mencatat push up harian dan melihat apakah saya meningkat.

**Kebutuhan fungsional**
| ID | Kebutuhan | Prioritas |
|---|---|---|
| PU-1 | Input jumlah push up (total harian atau per set dengan tombol +1, +5, +10) | P0 |
| PU-2 | Total harian otomatis dijumlahkan dari set | P0 |
| PU-3 | Target harian dan progress bar | P1 |
| PU-4 | Grafik batang harian/mingguan/bulanan | P0 |
| PU-5 | Streak hari berturut-turut mencapai target | P1 |
| PU-6 | Rekor pribadi (total harian tertinggi, set terbanyak) | P2 |
| PU-7 | Pengingat olahraga | P2 |

**Kriteria penerimaan**
- Pencatatan satu set dapat dilakukan dalam maksimal 3 ketukan.
- Streak bertambah hanya jika target tercapai pada hari tersebut.

---

## 7. Fitur Pendukung

| Fitur | Deskripsi | Prioritas |
|---|---|---|
| Dashboard "Hari Ini" | Ringkasan jadwal, sholat berikutnya, status makan, berat terakhir, push up hari ini | P0 |
| Pengaturan notifikasi | Aktif/nonaktif per kategori, jam senyap (quiet hours) | P0 |
| Akun & sinkronisasi | Login (email/Google) agar data aman lintas perangkat | P1 |
| Mode gelap | Mengikuti tema sistem | P2 |
| Bahasa | Bahasa Indonesia (default), Inggris opsional | P2 |
| Instal PWA | Prompt "Tambahkan ke Layar Utama" | P0 |

## 8. Alur Pengguna Utama

1. **Onboarding:** Buka aplikasi → pilih lokasi (kota) → atur waktu makan → izinkan notifikasi → instal ke layar utama.
2. **Penggunaan harian:** Buka Dashboard → terima notifikasi → ketuk untuk mencatat (sudah makan, sudah sholat, tambah push up) → lihat progres.
3. **Mingguan:** Buka tab Statistik → tinjau tren berat badan, push up, dan kepatuhan.

## 9. Navigasi & Struktur Layar

Bottom navigation dengan 5 tab:

| Tab | Isi |
|---|---|
| Hari Ini | Dashboard ringkasan |
| Jadwal | Timeline aktivitas harian |
| Ibadah & Makan | Jadwal sholat dan pengingat makan |
| Fitness | Berat badan dan push up |
| Pengaturan | Notifikasi, lokasi, akun, data |

## 10. Model Data (Draft)

```
User            (id, nama, email, kota, lat, lng, timezone, metode_sholat, tinggi_cm, created_at)
Activity        (id, user_id, judul, tanggal, jam_mulai, jam_selesai, aturan_ulang, selesai, catatan)
MealReminder    (id, user_id, label, jam, hari_aktif[], aktif)
MealLog         (id, reminder_id, tanggal, status[sudah|lewat|tunda], catatan)
PrayerLog       (id, user_id, tanggal, waktu_sholat[subuh|dzuhur|ashar|maghrib|isya], status)
WeightLog       (id, user_id, tanggal, berat_kg, catatan)
WeightGoal      (id, user_id, target_kg, tanggal_target)
PushUpLog       (id, user_id, tanggal, jumlah, urutan_set)
PushUpGoal      (id, user_id, target_harian)
Settings        (user_id, notifikasi_per_kategori, quiet_hours, bahasa, tema)
```

## 11. Kebutuhan Non-Fungsional

| Aspek | Kebutuhan |
|---|---|
| Performa | Muat awal < 2 detik di jaringan 4G; interaksi terasa instan |
| Responsif | Mobile-first (lebar 360–430 px), tetap layak di tablet/desktop |
| Offline | Service Worker: aplikasi dan data hari ini tetap bisa dibuka offline; sinkron saat online |
| Notifikasi | Web Push API + Notification API |
| Keamanan & privasi | HTTPS, data kesehatan dienkripsi saat transit dan disimpan aman; pengguna dapat menghapus seluruh datanya |
| Aksesibilitas | Target sentuh ≥ 44 px, kontras memadai (WCAG AA), mendukung screen reader dasar |
| Kompatibilitas | Chrome/Edge/Firefox Android, Safari iOS 16.4+ |

## 12. Rekomendasi Teknis

| Lapisan | Opsi |
|---|---|
| Frontend | React / Next.js atau Vue (Nuxt), Tailwind CSS |
| PWA | Service Worker (Workbox), Web App Manifest |
| Penyimpanan lokal | IndexedDB (misal Dexie) untuk mode offline |
| Backend | Node.js (Express/NestJS) atau BaaS seperti Supabase/Firebase |
| Database | PostgreSQL (atau Firestore bila memakai Firebase) |
| Notifikasi | Web Push (VAPID) + penjadwal server (cron/queue) |
| Grafik | Chart.js atau Recharts |
| Jadwal sholat | Aladhan API / API Kemenag-turunan, dengan cache lokal |
| Hosting | Vercel / Netlify / VPS |

**MVP sederhana:** bisa dimulai tanpa backend (data di IndexedDB) lalu menambah akun dan sinkronisasi di fase berikutnya.

## 13. Risiko & Batasan

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Notifikasi web tidak seandal aplikasi native, terutama di iOS (wajib instal PWA ke layar utama, iOS 16.4+) | Pengingat terlewat | Panduan instal saat onboarding; sediakan opsi alarm/ekspor kalender sebagai cadangan |
| Notifikasi terjadwal saat aplikasi tertutup butuh push server | Kompleksitas backend | Gunakan layanan push terkelola atau cron server |
| Akurasi jadwal sholat berbeda antar sumber | Kepercayaan pengguna turun | Pakai metode Kemenag sebagai default, tampilkan sumber data |
| Izin lokasi/notifikasi ditolak | Fitur tidak optimal | Pemilihan kota manual dan penjelasan manfaat sebelum meminta izin |
| Data kesehatan sensitif | Isu privasi | Minimalkan data, enkripsi, kebijakan privasi jelas |

## 14. Rencana Rilis

| Fase | Cakupan | Estimasi |
|---|---|---|
| **MVP (v1.0)** | Dashboard, Jadwal Harian (dasar), Jadwal & pengingat sholat, Pengingat makan, Tracking berat badan, Tracking push up, PWA + notifikasi | 6–8 minggu |
| **v1.1** | Aktivitas berulang, target & streak, statistik kepatuhan, mode gelap | 3–4 minggu |
| **v1.2** | Akun & sinkronisasi lintas perangkat, ekspor data, template jadwal | 3–4 minggu |
| **Selanjutnya** | Olahraga lain (sit up, squat), pengingat minum, widget/ekspor kalender | TBD |

## 15. Pertanyaan Terbuka

1. Apakah aplikasi untuk pemakaian pribadi atau akan dirilis publik? (memengaruhi kebutuhan akun, skala, dan privasi)
2. Apakah perlu sinkronisasi antar perangkat sejak v1?
3. Metode perhitungan sholat dan sumber data apa yang dipilih sebagai standar?
4. Apakah pengingat perlu suara adzan atau cukup notifikasi standar?
5. Apakah push up cukup dicatat total harian, atau perlu detail per set dan durasi?
6. Satuan berat selain kg diperlukan (lb)?

## 16. Lampiran: Daftar Prioritas

- **P0 (wajib MVP):** JD-1–3, PM-1 & 3, PS-1–4, BB-1, 2, 4, PU-1, 2, 4, Dashboard, notifikasi, instal PWA
- **P1 (segera setelah MVP):** JD-4, 5, 7, PM-2 & 4, PS-5, 6, 8, BB-3 & 5, PU-3 & 5, akun & sinkronisasi
- **P2 (nice to have):** JD-6, PM-5 & 6, PS-7, BB-6–8, PU-6 & 7, mode gelap, multi-bahasa
