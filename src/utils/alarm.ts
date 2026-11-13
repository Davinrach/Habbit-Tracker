/**
 * Utility to integrate RISE with Android Native Clock / Alarm
 * Uses Android Intent URI: android.intent.action.SET_ALARM
 */

export interface AlarmResult {
  success: boolean;
  message: string;
  hour: number;
  minutes: number;
  formattedTime: string;
}

export const setAndroidAlarm = (timeStr: string, title: string): AlarmResult => {
  // Extract hour and minutes from various formats: "06:30", "06.30", "06.30–07.30"
  const match = timeStr.match(/(\d{1,2})[:.](\d{2})/);
  if (!match) {
    return {
      success: false,
      message: 'Format waktu tidak valid',
      hour: 0,
      minutes: 0,
      formattedTime: timeStr,
    };
  }

  const hour = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const formattedTime = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  const label = `RISE: ${title}`;

  // Android Intent URI for Alarm Clock
  const intentUri = `intent:#Intent;action=android.intent.action.SET_ALARM;i.android.intent.extra.HOUR=${hour};i.android.intent.extra.MINUTES=${minutes};S.android.intent.extra.MESSAGE=${encodeURIComponent(
    label
  )};B.android.intent.extra.SKIP_UI=false;end`;

  const isAndroid = /Android/i.test(navigator.userAgent);

  // Attempt to open the intent
  try {
    window.location.href = intentUri;
    return {
      success: true,
      message: isAndroid
        ? `Membuka jam alarm HP untuk ${formattedTime} (${title})...`
        : `Alarm disiapkan untuk ${formattedTime} (Buka di HP Android untuk langsung membuka aplikasi Jam)`,
      hour,
      minutes,
      formattedTime,
    };
  } catch (err) {
    return {
      success: false,
      message: 'Gagal membuka aplikasi jam di perangkat ini',
      hour,
      minutes,
      formattedTime,
    };
  }
};
