import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProductFilters({ categories, filters, onChange }) {
  const base = 'h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none';
  const active = filters.category || filters.status || filters.urgency;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select className={base} value={filters.category} onChange={e => onChange({ ...filters, category: e.target.value })}>
        <option value="">Todas categorias</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select className={base} value={filters.status} onChange={e => onChange({ ...filters, status: e.target.value })}>
        <option value="">Todo status</option>
        <option value="in">Em estoque</option>
        <option value="out">Esgotado</option>
      </select>
      <select className={base} value={filters.urgency} onChange={e => onChange({ ...filters, urgency: e.target.value })}>
        <option value="">Toda urgência</option>
        <option value="critical">Crítico</option>
        <option value="low">Baixo</option>
        <option value="healthy">Saudável</option>
      </select>
      {active ? <Button variant="ghost" size="sm" onClick={() => onChange({ category: '', status: '', urgency: '' })}><X className="mr-1 h-4 w-4" />Limpar</Button> : null}
    </div>
  );
}