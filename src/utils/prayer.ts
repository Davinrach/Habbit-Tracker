import { PrayerTimes } from '../types';

export interface CityLocation {
  name: string;
  lat: number;
  lng: number;
  timezone: number; // UTC+7, UTC+8, UTC+9
}

export const INDONESIAN_CITIES: CityLocation[] = [
  { name: 'Jakarta', lat: -6.2088, lng: 106.8456, timezone: 7 },
  { name: 'Bandung', lat: -6.9175, lng: 107.6191, timezone: 7 },
  { name: 'Surabaya', lat: -7.2575, lng: 112.7521, timezone: 7 },
  { name: 'Yogyakarta', lat: -7.7956, lng: 110.3695, timezone: 7 },
  { name: 'Semarang', lat: -6.9667, lng: 110.4167, timezone: 7 },
  { name: 'Medan', lat: 3.5952, lng: 98.6722, timezone: 7 },
  { name: 'Palembang', lat: -2.9761, lng: 104.7754, timezone: 7 },
  { name: 'Makassar', lat: -5.1477, lng: 119.4327, timezone: 8 },
  { name: 'Denpasar', lat: -8.6705, lng: 115.2126, timezone: 8 },
  { name: 'Balikpapan', lat: -1.2379, lng: 116.8529, timezone: 8 },
  { name: 'Jayapura', lat: -2.5916, lng: 140.6690, timezone: 9 },
];

/**
 * Approximate offline Solar Prayer Times calculator according to Kemenag RI standard
 * (Fajr: 20 degrees, Isha: 18 degrees, Asr: Shafi'i shadow factor = 1)
 */
export function calculatePrayerTimes(city: CityLocation, date: Date = new Date()): PrayerTimes {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
  );

  const lat = city.lat;
  const lng = city.lng;
  const tz = city.timezone;

  // Solar declination & Equation of time
  const B = (360 / 365) * (dayOfYear - 81) * (Math.PI / 180);
  const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B); // in minutes
  const declination = 23.45 * Math.sin((360 / 365) * (dayOfYear - 81) * (Math.PI / 180)); // in degrees

  const rad = (deg: number) => (deg * Math.PI) / 180;
  const deg = (rad: number) => (rad * 180) / Math.PI;

  // Solar noon
  const noon = 12 + (tz * 15 - lng) / 15 - eot / 60;

  // Hour angles
  const hourAngle = (angle: number) => {
    const val =
      (-Math.sin(rad(angle)) - Math.sin(rad(lat)) * Math.sin(rad(declination))) /
      (Math.cos(rad(lat)) * Math.cos(rad(declination)));
    if (val > 1 || val < -1) return 0;
    return deg(Math.acos(val)) / 15;
  };

  // Asr hour angle (Shafi'i: shadow = 1 + tan|lat - declination|)
  const asrAlt = deg(
    Math.atan(1 / (1 + Math.tan(rad(Math.abs(lat - declination)))))
  );
  const asrHA =
    deg(
      Math.acos(
        (Math.sin(rad(asrAlt)) - Math.sin(rad(lat)) * Math.sin(rad(declination))) /
          (Math.cos(rad(lat)) * Math.cos(rad(declination)))
      )
    ) / 15;

  // Kemenag angles: Fajr 20°, Sunrise 0.833°, Sunset/Maghrib 0.833°, Isha 18°
  const fajrHA = hourAngle(20);
  const sunriseHA = hourAngle(0.833);
  const maghribHA = hourAngle(0.833);
  const isyaHA = hourAngle(18);

  const formatHours = (decHours: number): string => {
    const totalMinutes = Math.round(decHours * 60);
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  // Add 2-3 minutes safety buffer (ihtiyat) as standard in Indonesian prayer schedules
  const ihtiyat = 2 / 60;

  return {
    subuh: formatHours(noon - fajrHA + ihtiyat),
    terbit: formatHours(noon - sunriseHA),
    dzuhur: formatHours(noon + ihtiyat),
    ashar: formatHours(noon + asrHA + ihtiyat),
    maghrib: formatHours(noon + maghribHA + ihtiyat),
    isya: formatHours(noon + isyaHA + ihtiyat),
  };
}

export function getNextPrayer(times: PrayerTimes): { name: string; time: string; remainingMinutes: number } {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const toMins = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const prayers: { name: string; key: keyof PrayerTimes; label: string }[] = [
    { name: 'Subuh', key: 'subuh', label: 'Subuh' },
    { name: 'Dzuhur', key: 'dzuhur', label: 'Dzuhur' },
    { name: 'Ashar', key: 'ashar', label: 'Ashar' },
    { name: 'Maghrib', key: 'maghrib', label: 'Maghrib' },
    { name: 'Isya', key: 'isya', label: 'Isya' },
  ];

  for (const p of prayers) {
    const pMins = toMins(times[p.key]);
    if (pMins > currentMinutes) {
      return {
        name: p.label,
        time: times[p.key],
        remainingMinutes: pMins - currentMinutes,
      };
    }
  }

  // Next day Fajr
  const tomorrowSubuh = toMins(times.subuh) + 24 * 60;
  return {
    name: 'Subuh (Besok)',
    time: times.subuh,
    remainingMinutes: tomorrowSubuh - currentMinutes,
  };
}

