import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { computeInventoryMetrics } from './dashboardMetrics';

const InventoryContext = createContext();

// PostgREST retorna colunas `numeric` como string (evita perda de precisão) —
// convertemos aqui, na borda, para que todo o app trabalhe com number.
const normalizeProduct = (p) => ({ ...p, stock: Number(p.stock), minimum_stock: Number(p.minimum_stock), unit_price: Number(p.unit_price) });
const normalizeDemandRecord = (r) => ({ ...r, units_sold: Number(r.units_sold) });

export function InventoryProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [demandRecords, setDemandRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*');

      if (productsError) throw productsError;

      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      if (categoriesError) console.warn('Tabela de categorias não configurada ou sem registros.');

      const { data: demandData, error: demandError } = await supabase
        .from('demand_records')
        .select('*');

      if (demandError) console.warn('Tabela de histórico de demanda não configurada ou sem registros.');

      setProducts((productsData || []).map(normalizeProduct));
      setCategories(categoriesData || []);
      setDemandRecords((demandData || []).map(normalizeDemandRecord));
    } catch (err) {
      console.error('Erro ao buscar inventário no Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  const metrics = useMemo(() => computeInventoryMetrics(products, demandRecords), [products, demandRecords]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const addProduct = async (productData) => {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select();

    if (error) {
      console.error('Erro ao adicionar produto:', error);
      throw error;
    }
    setProducts((prev) => [...prev, ...data.map(normalizeProduct)]);
    return data;
  };

  const updateProduct = async (id, productData) => {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
    const updated = normalizeProduct(data[0]);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return data;
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir produto:', error);
      throw error;
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addCategory = async (categoryData) => {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select();

    if (error) {
      console.error('Erro ao adicionar categoria:', error);
      throw error;
    }
    setCategories((prev) => [...prev, ...data]);
    return data;
  };

  const deleteCategory = async (id) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir categoria:', error);
      throw error;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        categories,
        demandRecords,
        metrics,
        loading,
        fetchInventory,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        deleteCategory,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export const useInventory = () => useContext(InventoryContext);