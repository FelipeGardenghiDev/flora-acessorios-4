import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const empty = { name: '', sku: '', category: '', stock: '', minimum_stock: '', unit_price: '' };
export default function ProductForm({ onAdd, categories = [] }) {
  const [open, setOpen] = useState(false); const [form, setForm] = useState(empty); const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const submit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await onAdd({ ...form, stock: Number(form.stock), minimum_stock: Number(form.minimum_stock), unit_price: Number(form.unit_price) });
      setForm(empty);
      setOpen(false);
    } catch (err) {
      toast({ title: 'Erro ao salvar produto', description: String(err?.message || err), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };
  if (!open) return <Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" />Novo produto</Button>;
  return <form onSubmit={submit} className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-3 lg:grid-cols-6">
    <Input required placeholder="Produto" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
    <Input required placeholder="SKU" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
    <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none">
      <option value="" disabled>Selecione...</option>
      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
    </select>
    <Input required min="0" type="number" placeholder="Estoque" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
    <Input required min="0" type="number" placeholder="Estoque mínimo" value={form.minimum_stock} onChange={e => setForm({ ...form, minimum_stock: e.target.value })} />
    <div className="flex gap-2"><Input required min="0" step="0.01" type="number" placeholder="Preço" value={form.unit_price} onChange={e => setForm({ ...form, unit_price: e.target.value })} /><Button disabled={saving} type="submit">{saving ? 'Salvando' : 'Salvar'}</Button><Button type="button" variant="ghost" size="icon" onClick={() => setOpen(false)}><X className="h-4 w-4" /></Button></div>
  </form>;
}