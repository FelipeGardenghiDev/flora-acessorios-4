import { useEffect, useRef, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const COMPACT_HEIGHT = 220;
const COMPACT_WIDTH = 300;

export default function VisitorInsights({ data }) {
  const containerRef = useRef(null);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setIsCompact(height < COMPACT_HEIGHT || width < COMPACT_WIDTH);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const last = data[data.length - 1]?.value ?? 0;
  const previous = data[data.length - 2]?.value ?? 0;
  const total = data.reduce((sum, d) => sum + (d.value || 0), 0);
  const deltaPct = previous ? Math.round(((last - previous) / previous) * 100) : 0;
  const fmt = v => v.toLocaleString('pt-BR');

  return (
    <section ref={containerRef} className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-5 flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div className="min-w-0"><h2 className="truncate font-heading text-lg font-bold">Visitor Insights</h2><p className="truncate text-xs text-muted-foreground">Unidades movimentadas por mês</p></div>
        <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">New Visitors</span>
      </div>
      {isCompact ? (
        <div className="grid min-h-0 flex-1 grid-cols-[repeat(auto-fit,minmax(100px,1fr))] content-center gap-3">
          <div className="min-w-0 rounded-xl border border-border bg-background/40 p-3">
            <p className="truncate text-xs text-muted-foreground">Total no período</p>
            <p className="mt-1 truncate font-heading font-extrabold text-[clamp(0.875rem,2.5vw,1.25rem)]">{fmt(total)}</p>
          </div>
          <div className="min-w-0 rounded-xl border border-border bg-background/40 p-3">
            <p className="truncate text-xs text-muted-foreground">Último mês</p>
            <p className={`mt-1 flex items-center gap-1 truncate font-heading font-extrabold text-[clamp(0.875rem,2.5vw,1.25rem)] ${deltaPct >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {fmt(last)}<span className="text-xs font-medium">{deltaPct >= 0 ? '↑' : '↓'} {Math.abs(deltaPct)}%</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="min-h-0 w-full flex-1">
          <ResponsiveContainer width="100%" height="100%" minHeight={100}>
            <AreaChart data={data} margin={{ left: -20, right: 8 }}>
              <defs><linearGradient id="visitorFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} /><stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 10 }} />
              <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#visitorFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
