export function forecastDemand(records, days = 30) {
  const values = [...records].sort((a, b) => a.date.localeCompare(b.date)).map(r => Number(r.units_sold));
  if (!values.length) return { total: 0, daily: 0 };
  const n = values.length;
  const sumX = n * (n - 1) / 2;
  const sumY = values.reduce((sum, value) => sum + value, 0);
  const sumXY = values.reduce((sum, value, index) => sum + index * value, 0);
  const sumXX = values.reduce((sum, _, index) => sum + index * index, 0);
  const slope = n > 1 ? (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1) : 0;
  const intercept = (sumY - slope * sumX) / n;
  const daily = Math.max(0, (intercept + slope * (n + days / 2)) / 7);
  return { total: Math.round(daily * days), daily: Math.round(daily * 10) / 10 };
}

export function buildForecastSeries(records, days = 30) {
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
  if (!sorted.length) return { slope: 0, points: [] };
  const byDate = {};
  sorted.forEach(r => { byDate[r.date] = (byDate[r.date] || 0) + r.units_sold; });
  const dates = Object.keys(byDate).sort();
  const values = dates.map(d => byDate[d]);
  const n = values.length;
  const sumX = n * (n - 1) / 2;
  const sumY = values.reduce((s, v) => s + v, 0);
  const sumXY = values.reduce((s, v, i) => s + i * v, 0);
  const sumXX = values.reduce((s, _, i) => s + i * i, 0);
  const slope = n > 1 ? (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1) : 0;
  const intercept = (sumY - slope * sumX) / n;
  const points = dates.map((date, i) => ({
    date: new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    actual: values[i],
    forecast: Math.max(0, Math.round(intercept + slope * i))
  }));
  const lastDate = new Date(`${dates[n - 1]}T12:00:00`);
  const steps = 5;
  for (let s = 1; s <= steps; s++) {
    const d = new Date(lastDate.getTime() + (days / steps) * s * 86400000);
    const idx = n - 1 + (days / steps) * s;
    points.push({ date: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), actual: null, forecast: Math.max(0, Math.round(intercept + slope * idx)) });
  }
  return { slope, points };
}

export function buildChartData(records) {
  const totals = records.reduce((acc, item) => ({ ...acc, [item.date]: (acc[item.date] || 0) + item.units_sold }), {});
  return Object.entries(totals).sort(([a], [b]) => a.localeCompare(b)).map(([date, demand]) => ({ date: new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }), demand }));
}