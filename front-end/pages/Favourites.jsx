import React, { useMemo } from 'react';
import { useInventory } from '@/hooks/useInventory';
import ProductTable from '@/components/products/ProductTable';
import { buildForecasts } from '@/lib/dashboardMetrics';

export default function Favourites() {
  const { products, demandRecords, loading, updateProduct, deleteProduct } = useInventory();

  const favourites = useMemo(() => products.filter(p => p.favourite), [products]);
  const forecasts = useMemo(() => buildForecasts(favourites, demandRecords), [favourites, demandRecords]);

  const handleAdjust = (product, delta) => {
    updateProduct(product.id, { stock: Math.max(0, product.stock + delta) });
  };

  const handleToggleFav = (product) => {
    updateProduct(product.id, { favourite: !product.favourite });
  };

  const handleDelete = (product) => {
    if (window.confirm(`Excluir "${product.name}"?`)) deleteProduct(product.id);
  };

  if (loading) return <p className="text-sm text-muted-foreground">Carregando favoritos...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Meus Produtos Favoritos</h1>

      {favourites.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          Nenhum produto favoritado ainda. Marque produtos com o ícone de coração em Produtos.
        </p>
      ) : (
        <ProductTable products={favourites} forecasts={forecasts} onAdjust={handleAdjust} onDelete={handleDelete} onToggleFav={handleToggleFav} />
      )}
    </div>
  );
}
