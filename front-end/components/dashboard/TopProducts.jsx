const barColors = ['#ffb067', '#6dcced', '#a582ff', '#ff8db8'];

export default function TopProducts({ products, forecasts }) {
  const max = Math.max(1, ...products.map(p => forecasts[p.sku]?.total || 0));
  const ranked = [...products].sort((a, b) => (forecasts[b.sku]?.total || 0) - (forecasts[a.sku]?.total || 0)).slice(0, 4);
  return <section className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm">
    <div className="mb-5 shrink-0"><h2 className="font-heading text-lg font-bold">Top Products</h2><p className="text-xs text-muted-foreground">Por demanda prevista · 30 dias</p></div>
    <div className="min-h-0 flex-1 space-y-4 overflow-hidden">
      {ranked.map((p, i) => {
        const pct = Math.round(((forecasts[p.sku]?.total || 0) / max) * 100);
        return <div key={p.id} className="flex items-center gap-4">
          <span className="shrink-0 w-5 font-heading text-sm font-bold text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
          <span className="min-w-0 flex-1 truncate text-sm font-medium">{p.name}</span>
          <div className="h-2 w-20 shrink-0 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: barColors[i % barColors.length] }} /></div>
          <span className="shrink-0 w-10 text-right font-heading text-sm font-bold">{pct}%</span>
        </div>;
      })}
    </div>
  </section>;
}