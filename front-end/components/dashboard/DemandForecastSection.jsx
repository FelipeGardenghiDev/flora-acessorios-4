import { useMemo, useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import DemandForecastChart from '@/components/dashboard/DemandForecastChart';

export default function DemandForecastSection({ products, records, forecasts, categories }) {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('all');
  const [start, setStart] = useState(0);

  const chips = useMemo(() => [{ key: 'all', label: 'Todos' }, ...(categories || []).map(c => ({ key: c.name, label: c.name }))], [categories]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products
      .filter(p => {
        const matchCat = cat === 'all' || p.category === cat;
        const matchQ = !q || `${p.name} ${p.sku}`.toLowerCase().includes(q);
        return matchCat && matchQ;
      })
      .sort((a, b) => (forecasts[b.sku]?.total || 0) - (forecasts[a.sku]?.total || 0));
  }, [products, forecasts, query, cat]);

  const max = Math.max(0, filtered.length - 3);
  const clampedStart = Math.min(start, max);
  const visible = filtered.slice(clampedStart, clampedStart + 3);
  const go = dir => setStart(s => Math.max(0, Math.min(s + dir, max)));

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-3">
        <h2 className="min-w-0 flex-1 truncate font-heading text-lg font-bold text-foreground">Previsão de demanda</h2>
        <div className="relative min-w-[12rem] flex-1 basis-56">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setStart(0); }}
            placeholder="Buscar produto..."
            className="h-9 w-full min-w-0 rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="mb-4 flex shrink-0 flex-wrap gap-2">
        {chips.map(c => (
          <button
            key={c.key}
            onClick={() => { setCat(c.key); setStart(0); }}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${cat === c.key ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 items-center gap-3">
        <button
          onClick={() => go(-1)}
          disabled={clampedStart === 0}
          className="shrink-0 rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="grid h-full min-w-0 flex-1 gap-5 overflow-hidden grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
          {visible.length > 0 ? (
            visible.map(p => <DemandForecastChart key={p.id} product={p} records={records} />)
          ) : (
            <div className="col-span-full flex h-full min-h-[8rem] items-center justify-center rounded-xl border border-border bg-card text-xs text-muted-foreground">
              Nenhum produto encontrado
            </div>
          )}
        </div>
        <button
          onClick={() => go(1)}
          disabled={clampedStart >= max || filtered.length === 0}
          className="shrink-0 rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          aria-label="Próximo"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}