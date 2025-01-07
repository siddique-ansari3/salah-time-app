// Define the PrayerTime type
export interface PrayerTime {
    start: number; // Start hour in 24-hour format
    end: number;   // End hour in 24-hour format
    name: string;  // Name of the prayer
  }
  
  // Define prayer times constant
  export const PRAYER_TIMES: PrayerTime[] = [
    { start: 0, end: 8, name: 'Fajr' },       // 12:00 AM to 8:00 AM
    { start: 8, end: 15, name: 'Dhuhr' },     // 8:00 AM to 3:00 PM
    { start: 15, end: 17, name: 'Asr' },      // 3:00 PM to 5:00 PM
    { start: 17, end: 19, name: 'Maghrib' },  // 5:00 PM to 7:00 PM
    { start: 19, end: 24, name: 'Isha' }      // 7:00 PM to 12:00 AM
  ];

  export type PrayerType = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'juma';

  export const prayerMap: { [key: string]: { [lang: string]: string } } = {
    fajr: { en: 'Fajr', ar: 'الفجر', ur: 'فجر' },
    dhuhr: { en: 'Dhuhr', ar: 'الظهر', ur: 'ظہر' },
    asr: { en: 'Asr', ar: 'العصر', ur: 'عصر' },
    maghrib: { en: 'Maghrib', ar: 'المغرب', ur: 'مغرب' },
    isha: { en: 'Isha', ar: 'العشاء', ur: 'عشاء' },
    juma: { en: 'Juma', ar: 'الجمعة', ur: 'جمعہ' }
  };