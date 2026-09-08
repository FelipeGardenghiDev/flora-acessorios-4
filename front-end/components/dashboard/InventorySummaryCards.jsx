import { AlertTriangle, Wallet } from 'lucide-react';

export default function InventorySummaryCards({ alerts, value }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/15 text-destructive"><AlertTriangle className="h-5 w-5" /></div>
          <div>
            <p className="text-xs text-muted-foreground">Itens abaixo do mínimo</p>
            <p className="font-heading text-2xl font-extrabold text-foreground">{alerts}</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Wallet className="h-5 w-5" /></div>
          <div>
            <p className="text-xs text-muted-foreground">Valor total em estoque</p>
            <p className="font-heading text-2xl font-extrabold text-foreground">R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}