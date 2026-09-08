import { RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';

export default function Earnings({ value, health, alerts }) {
  const data = [{ name: 'health', value: health, fill: 'hsl(var(--primary))' }];
  return (
    <section className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-5 shrink-0"><h2 className="font-heading text-lg font-bold">Earnings</h2><p className="text-xs text-muted-foreground">Valor em estoque</p></div>
      <div className="flex min-h-0 flex-1 flex-wrap items-center gap-6">
        <div className="relative aspect-square w-[clamp(2.5rem,30%,50%)] shrink overflow-hidden rounded-full">
          <ResponsiveContainer width="100%" height="100%" minHeight={40}>
            <RadialBarChart innerRadius="65%" outerRadius="80%" data={data} startAngle={90} endAngle={-270}>
              <RadialBar background={{ fill: 'hsl(var(--muted))' }} dataKey="value" cornerRadius={20} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="font-heading font-extrabold text-[clamp(0.75rem,3vw,1.5rem)]">{health}%</span><span className="text-[10px] text-muted-foreground">saúde</span></div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-heading font-extrabold text-[clamp(1.125rem,4vw,1.875rem)]">R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="mt-2 truncate text-sm text-muted-foreground">{alerts} produto{alerts === 1 ? '' : 's'} abaixo do mínimo</p>
        </div>
      </div>
    </section>
  );
}