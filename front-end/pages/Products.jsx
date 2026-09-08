import React, { useMemo, useState } from 'react';
import { useInventory } from '@/hooks/useInventory';
import ProductFilters from '@/components/products/ProductFilters';
import ProductTable from '@/components/products/ProductTable';
import ProductForm from '@/components/inventory/ProductForm';
import ImportCsvButton from '@/components/inventory/ImportCsvButton';
import { buildForecasts } from '@/lib/dashboardMetrics';

const urgencyOf = (p) => (p.stock <= 0 ? 'critical' : p.stock <= p.minimum_stock ? 'low' : 'healthy');

export default function Products() {
  const { products, categories, demandRecords, loading, addProduct, updateProduct, deleteProduct } = useInventory();
  const [filters, setFilters] = useState({ category: '', status: '', urgency: '' });

  const forecasts = useMemo(() => buildForecasts(products, demandRecords), [products, demandRecords]);

  const filtered = useMemo(() => products.filter(p => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.status === 'in' && p.stock <= 0) return false;
    if (filters.status === 'out' && p.stock > 0) return false;
    if (filters.urgency && urgencyOf(p) !== filters.urgency) return false;
    return true;
  }), [products, filters]);

  const handleAdjust = (product, delta) => {
    updateProduct(product.id, { stock: Math.max(0, product.stock + delta) });
  };

  const handleToggleFav = (product) => {
    updateProduct(product.id, { favourite: !product.favourite });
  };

  const handleDelete = (product) => {
    if (window.confirm(`Excluir "${product.name}"?`)) deleteProduct(product.id);
  };

  if (loading) return <p className="text-sm text-muted-foreground">Carregando produtos...</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Catálogo de Produtos</h1>
        <div className="flex gap-2">
          <ImportCsvButton />
          <ProductForm categories={categories} onAdd={addProduct} />
        </div>
      </div>

      <ProductFilters categories={categories.map(c => c.name)} filters={filters} onChange={setFilters} />

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          {products.length === 0 ? 'Nenhum produto cadastrado ainda.' : 'Nenhum produto encontrado para os filtros selecionados.'}
        </p>
      ) : (
        <ProductTable products={filtered} forecasts={forecasts} onAdjust={handleAdjust} onDelete={handleDelete} onToggleFav={handleToggleFav} />
      )}
    </div>
  );
}
