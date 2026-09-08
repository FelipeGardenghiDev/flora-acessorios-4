import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function LevelChart({ data }) {
  return <section className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm">
    <div className="mb-5 shrink-0"><h2 className="font-heading text-lg font-bold">Level</h2><p className="text-xs text-muted-foreground">Estoque por produto</p></div>
    <div className="min-h-0 w-full flex-1"><ResponsiveContainer width="100%" height="100%" minHeight={100}><BarChart data={data} barGap={6} margin={{ left: -20, right: 8 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
      <XAxis dataKey="short" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
      <Tooltip cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 10 }} />
      <Bar dataKey="stock" name="Volume" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={18} />
      <Bar dataKey="minimum_stock" name="Mínimo" fill="hsl(var(--muted-foreground) / 0.4)" radius={[4, 4, 0, 0]} maxBarSize={18} />
    </BarChart></ResponsiveContainer></div>
  </section>;
}