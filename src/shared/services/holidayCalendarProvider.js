export const COUNTRIES = [
  { id: 'IN', label: 'India', flag: '🇮🇳' },
  { id: 'US', label: 'United States', flag: '🇺🇸' },
  { id: 'GB', label: 'United Kingdom', flag: '🇬🇧' },
  { id: 'CA', label: 'Canada', flag: '🇨🇦' },
  { id: 'DE', label: 'Germany', flag: '🇩🇪' },
  { id: 'JP', label: 'Japan', flag: '🇯🇵' },
  { id: 'AU', label: 'Australia', flag: '🇦🇺' },
  { id: 'AE', label: 'United Arab Emirates', flag: '🇦🇪' },
  { id: 'SG', label: 'Singapore', flag: '🇸🇬' },
  { id: 'FR', label: 'France', flag: '🇫🇷' },
];

export const RELIGIONS = [
  { id: 'None', label: 'None' },
  { id: 'Islam', label: 'Islam' },
  { id: 'Hinduism', label: 'Hinduism' },
  { id: 'Christianity', label: 'Christianity' },
  { id: 'Judaism', label: 'Judaism' },
  { id: 'Buddhism', label: 'Buddhism' },
  { id: 'Sikhism', label: 'Sikhism' },
  { id: 'Other', label: 'Other (Specify Custom Label)' },
  { id: 'PreferNotToAnswer', label: 'I prefer not to answer.' },
];

export const AVAILABLE_HOLIDAY_CALENDARS = [
  { id: 'national_in', name: 'Indian National Holidays', type: 'national', country: 'IN' },
  { id: 'national_us', name: 'US Public Holidays', type: 'national', country: 'US' },
  { id: 'national_gb', name: 'UK Bank Holidays', type: 'national', country: 'GB' },
  { id: 'national_ca', name: 'Canadian Holidays', type: 'national', country: 'CA' },
  { id: 'national_de', name: 'German Public Holidays', type: 'national', country: 'DE' },
  { id: 'national_jp', name: 'Japanese Public Holidays', type: 'national', country: 'JP' },
  { id: 'national_au', name: 'Australian Public Holidays', type: 'national', country: 'AU' },
  { id: 'national_ae', name: 'UAE National Holidays', type: 'national', country: 'AE' },
  { id: 'islamic', name: 'Islamic Hijri Holidays', type: 'religious', religion: 'Islam' },
  { id: 'hindu', name: 'Hindu Festival Calendar', type: 'religious', religion: 'Hinduism' },
  { id: 'christian', name: 'Christian Liturgical Holidays', type: 'religious', religion: 'Christianity' },
  { id: 'jewish', name: 'Jewish Festival Calendar', type: 'religious', religion: 'Judaism' },
  { id: 'buddhist', name: 'Buddhist Festival Calendar', type: 'religious', religion: 'Buddhism' },
  { id: 'sikh', name: 'Sikh Gurpurab Calendar', type: 'religious', religion: 'Sikhism' },
];

export const HOLIDAY_EVENTS_DATABASE = {
  national_in: [
    { title: 'Republic Day', date: '2026-01-26', category: 'Public Holiday' },
    { title: 'Independence Day', date: '2026-08-15', category: 'Public Holiday' },
    { title: 'Gandhi Jayanti', date: '2026-10-02', category: 'Public Holiday' },
  ],
  national_us: [
    { title: 'New Year Day', date: '2026-01-01', category: 'Federal Holiday' },
    { title: 'Martin Luther King Jr. Day', date: '2026-01-19', category: 'Federal Holiday' },
    { title: 'Independence Day', date: '2026-07-04', category: 'Federal Holiday' },
    { title: 'Thanksgiving Day', date: '2026-11-26', category: 'Federal Holiday' },
  ],
  national_gb: [
    { title: 'New Year Day', date: '2026-01-01', category: 'Bank Holiday' },
    { title: 'Good Friday', date: '2026-04-03', category: 'Bank Holiday' },
    { title: 'Early May Bank Holiday', date: '2026-05-04', category: 'Bank Holiday' },
    { title: 'Summer Bank Holiday', date: '2026-08-31', category: 'Bank Holiday' },
  ],
  islamic: [
    { title: 'Eid al-Fitr', date: '2026-03-20', category: 'Islamic Holiday' },
    { title: 'Eid al-Adha', date: '2026-05-27', category: 'Islamic Holiday' },
    { title: 'Islamic New Year (1448 AH)', date: '2026-06-16', category: 'Islamic Holiday' },
  ],
  hindu: [
    { title: 'Maha Shivaratri', date: '2026-02-15', category: 'Festival' },
    { title: 'Holi', date: '2026-03-04', category: 'Festival' },
    { title: 'Raksha Bandhan', date: '2026-08-28', category: 'Festival' },
    { title: 'Diwali (Deepavali)', date: '2026-11-08', category: 'Festival' },
  ],
  christian: [
    { title: 'Good Friday', date: '2026-04-03', category: 'Christian Holiday' },
    { title: 'Easter Sunday', date: '2026-04-05', category: 'Christian Holiday' },
    { title: 'Christmas Day', date: '2026-12-25', category: 'Christian Holiday' },
  ],
  jewish: [
    { title: 'Passover (Pesach)', date: '2026-04-02', category: 'Jewish Holiday' },
    { title: 'Rosh Hashanah', date: '2026-09-12', category: 'Jewish Holiday' },
    { title: 'Yom Kippur', date: '2026-09-21', category: 'Jewish Holiday' },
    { title: 'Hanukkah', date: '2026-12-05', category: 'Jewish Holiday' },
  ],
  buddhist: [
    { title: 'Vesak (Buddha Day)', date: '2026-05-31', category: 'Buddhist Holiday' },
  ],
  sikh: [
    { title: 'Vaisakhi', date: '2026-04-14', category: 'Sikh Festival' },
    { title: 'Guru Nanak Jayanti', date: '2026-11-24', category: 'Sikh Festival' },
  ],
};

export const HolidayCalendarProvider = {
  getRecommendedCalendars(religion, country) {
    const recommended = [];

    if (country) {
      const matchNat = AVAILABLE_HOLIDAY_CALENDARS.find(c => c.type === 'national' && c.country === country);
      if (matchNat) recommended.push(matchNat.id);
    }

    if (religion && religion !== 'None' && religion !== 'PreferNotToAnswer' && religion !== 'Other') {
      const matchRel = AVAILABLE_HOLIDAY_CALENDARS.find(c => c.type === 'religious' && c.religion === religion);
      if (matchRel) recommended.push(matchRel.id);
    }

    return recommended;
  },

  getHolidayEvents(enabledCalendarIds = []) {
    const events = [];
    enabledCalendarIds.forEach(calId => {
      const dbEvents = HOLIDAY_EVENTS_DATABASE[calId];
      if (dbEvents) {
        dbEvents.forEach(e => {
          events.push({
            id: `holiday_${calId}_${e.title.toLowerCase().replace(/\s+/g, '_')}`,
            title: e.title,
            date: e.date,
            category: e.category,
            isHoliday: true,
            readOnly: true,
          });
        });
      }
    });
    return events;
  }
};
