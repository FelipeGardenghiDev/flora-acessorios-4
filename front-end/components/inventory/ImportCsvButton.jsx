import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useInventory } from '@/hooks/useInventory';

const REQUIRED_COLUMNS = ['product_sku', 'date', 'units_sold'];

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (!lines.length) return [];

  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  const colIndex = Object.fromEntries(REQUIRED_COLUMNS.map(col => [col, header.indexOf(col)]));
  if (Object.values(colIndex).some(i => i === -1)) {
    throw new Error('Use colunas: product_sku, date, units_sold');
  }

  return lines.slice(1).map(line => {
    const cells = line.split(',').map(c => c.trim());
    return {
      product_sku: cells[colIndex.product_sku],
      date: cells[colIndex.date],
      units_sold: Number(cells[colIndex.units_sold]),
    };
  }).filter(r => r.product_sku && r.date && !Number.isNaN(r.units_sold));
}

export default function ImportCsvButton() {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { fetchInventory } = useInventory();

  const handleFile = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const text = await file.text();
      const records = parseCsv(text);

      if (!records.length) {
        toast({ title: 'Nenhum registro encontrado', description: 'Use colunas: product_sku, date, units_sold', variant: 'destructive' });
      } else {
        const { error } = await supabase.from('demand_records').insert(records);
        if (error) throw error;
        toast({ title: 'Importação concluída', description: `${records.length} registros adicionados ao histórico.` });
        await fetchInventory();
      }
    } catch (err) {
      toast({ title: 'Erro na importação', description: String(err?.message || err), variant: 'destructive' });
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <>
      <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
      <Button variant="outline" disabled={loading} onClick={() => inputRef.current?.click()}>
        <Upload className="mr-2 h-4 w-4" />{loading ? 'Importando...' : 'Importar CSV'}
      </Button>
    </>
  );
}
