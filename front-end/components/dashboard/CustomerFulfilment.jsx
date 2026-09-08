import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function CustomerFulfilment({ data, current, previous }) {
  const fmt = v => v.toLocaleString('pt-BR', { minimumFractionDigits: 0 });
  return (
    <section className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex shrink-0 flex-wrap items-start justify-between gap-2">
        <div className="min-w-0"><h2 className="truncate font-heading text-lg font-bold">Customer Fulfilment</h2><p className="truncate text-xs text-muted-foreground">Demanda por semana</p></div>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground"><span className="h-2 w-2 shrink-0 rounded-full bg-muted-foreground/50" />Período anterior</span>
          <span className="flex items-center gap-1.5 text-muted-foreground"><span className="h-2 w-2 shrink-0 rounded-full bg-primary" />Recente</span>
        </div>
      </div>
      <div className="mb-3 flex shrink-0 flex-wrap gap-6">
        <div className="min-w-0"><p className="truncate text-xs text-muted-foreground">Período anterior</p><p className="truncate font-heading text-lg font-bold text-muted-foreground/70">{fmt(previous)}</p></div>
        <div className="min-w-0"><p className="truncate text-xs text-muted-foreground">Recente</p><p className="truncate font-heading text-lg font-bold text-primary">{fmt(current)}</p></div>
      </div>
      <div className="min-h-0 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%" minHeight={100}>
          <LineChart data={data} margin={{ left: -20, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 10 }} />
            <Line type="monotone" dataKey="prev" name="Período anterior" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="demand" name="Recente" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}