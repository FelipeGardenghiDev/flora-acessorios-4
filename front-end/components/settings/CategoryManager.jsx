import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useInventory } from '@/hooks/useInventory';

export default function CategoryManager() {
  const { categories, addCategory, deleteCategory } = useInventory();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async e => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    if (categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      toast({ title: 'Categoria já existe', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      await addCategory({ name: trimmed });
      setName('');
      toast({ title: 'Categoria criada' });
    } catch (err) {
      toast({ title: 'Erro ao criar categoria', description: String(err?.message || err), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id, catName) => {
    try {
      await deleteCategory(id);
      toast({ title: 'Categoria removida', description: catName });
    } catch (err) {
      toast({ title: 'Erro ao remover categoria', description: String(err?.message || err), variant: 'destructive' });
    }
  };

  return (
    <div className="h-full space-y-5 rounded-2xl border border-border bg-card p-6">
      <div>
        <h3 className="font-heading text-base font-bold text-foreground">Categorias de Produto</h3>
        <p className="text-sm text-muted-foreground">Crie e gerencie as categorias disponíveis ao cadastrar produtos.</p>
      </div>
      <form onSubmit={submit} className="flex gap-2">
        <Input required placeholder="Nova categoria" value={name} onChange={e => setName(e.target.value)} />
        <Button disabled={saving} type="submit"><Plus className="mr-1 h-4 w-4" />Adicionar</Button>
      </form>
      <div className="space-y-2">
        {categories.length === 0
          ? <p className="text-sm text-muted-foreground">Nenhuma categoria cadastrada.</p>
          : categories.map(c => (
            <div key={c.id} className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-2.5">
              <span className="text-sm font-medium text-foreground">{c.name}</span>
              <Button variant="ghost" size="icon" onClick={() => remove(c.id, c.name)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
      </div>
    </div>
  );
}