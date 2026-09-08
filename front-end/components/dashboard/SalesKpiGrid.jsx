import { AlertTriangle, DollarSign, Package, ShoppingBag } from 'lucide-react';

const colors = { orange: 'text-[#ffb067] bg-[#ffb067]/10', mint: 'text-primary bg-primary/10', pink: 'text-[#ff8db8] bg-[#ff8db8]/10', blue: 'text-[#6dcced] bg-[#6dcced]/10' };

export default function SalesKpiGrid({ metrics }) {
  const fmt = v => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const cards = [
    { label: 'Valor em estoque', value: `R$ ${fmt(metrics.value)}`, delta: metrics.valueDelta, icon: DollarSign, tone: 'orange' },
    { label: 'Pedidos no mês', value: metrics.orders, delta: metrics.ordersDelta, icon: ShoppingBag, tone: 'mint' },
    { label: 'Produtos cadastrados', value: metrics.products, delta: null, sub: 'total', icon: Package, tone: 'pink' },
    { label: 'Abaixo do mínimo', value: metrics.alerts, delta: null, sub: 'requer reposição', icon: AlertTriangle, tone: 'blue' }
  ];
  return (
    <section className="flex h-full min-h-[180px] w-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-5 shrink-0"><h2 className="font-heading text-lg font-bold">Resumo de vendas</h2><p className="text-xs text-muted-foreground">Dados em tempo real</p></div>
      <div className="grid min-h-0 flex-1 content-start gap-2 grid-cols-[repeat(auto-fit,minmax(80px,1fr))]">
        {cards.map(({ label, value, delta, sub, icon: Icon, tone }) => (
          <div key={label} className="min-w-0 rounded-xl border border-border bg-background/40 p-2">
            <div className={`mb-4 flex h-9 w-9 items-center justify-center rounded-lg ${colors[tone]}`}><Icon className="h-[18px] w-[18px]" /></div>
            <p className="truncate text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 truncate font-heading font-extrabold text-[clamp(0.875rem,2.5vw,1.5rem)]">{value}</p>
            {delta !== null
              ? <span className={`mt-1 flex items-center gap-0.5 truncate text-xs font-medium ${delta >= 0 ? 'text-primary' : 'text-destructive'}`}>{delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}% vs mês anterior</span>
              : <span className="mt-1 block truncate text-xs text-muted-foreground">{sub}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}