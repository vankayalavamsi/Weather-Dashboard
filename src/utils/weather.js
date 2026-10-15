const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function formatTemp(value) {
  return typeof value === 'number' ? `${Math.round(value)}°C` : '—';
}

export function formatWind(speed) {
  return typeof speed === 'number' ? `${Math.round(speed * 3.6)} km/h` : '—';
}

export function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : '—';
}

export function buildDailyForecast(data) {
  if (!data?.list?.length) return [];

  const groups = {};

  for (const reading of data.list) {
    const localTime = new Date((reading.dt + data.city.timezone) * 1000);
    const dateKey = localTime.toISOString().slice(0, 10);

    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push({ ...reading, localTime });
  }
  const todayKey = new Date(Date.now() + data.city.timezone * 1000)
    .toISOString()
    .slice(0, 10);

  return Object.keys(groups)
    .sort()
    .slice(0, 5)
    .map((dateKey) => {
      const readings = groups[dateKey];

      const midday = readings.reduce((best, reading) =>
        Math.abs(reading.localTime.getUTCHours() - 12) <
        Math.abs(best.localTime.getUTCHours() - 12)
          ? reading
          : best
      );

      const min = Math.min(...readings.map((r) => r.main?.temp_min ?? r.main?.temp));
      const max = Math.max(...readings.map((r) => r.main?.temp_max ?? r.main?.temp));
      const weather = midday.weather?.[0] ?? {};

      return {
        date: dateKey,
        dayLabel: dateKey === todayKey ? 'Today' : WEEKDAYS[midday.localTime.getUTCDay()],
        icon: weather.icon,
        condition: weather.main ?? '—',
        min: Number.isFinite(min) ? Math.round(min) : null,
        max: Number.isFinite(max) ? Math.round(max) : null,
      };
    });
}