import React, { useState, useEffect } from 'react';
import { listaVendasRecentes, listaVendedores, listaProdutosForm, salvarVenda } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const selectClass = 'h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none';

export default function Orders() {
  const [vendas, setVendas] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    vendedor: '',
    codigo_produto: '',
    valor_venda: '',
    mes_venda: new Date().getMonth() + 1,
    ano_venda: new Date().getFullYear()
  });

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const [resVendas, resVendedores, resProdutos] = await Promise.all([
          listaVendasRecentes(),
          listaVendedores(),
          listaProdutosForm()
        ]);
        setVendas(resVendas);
        setVendedores(resVendedores);
        setProdutos(resProdutos);
      } catch (error) {
        console.error("Erro ao carregar dados de pedidos:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await salvarVenda(formData);

      const novasVendas = await listaVendasRecentes();
      setVendas(novasVendas);

      setFormData(prev => ({ ...prev, codigo_produto: '', valor_venda: '' }));
    } catch (error) {
      alert("Erro ao salvar venda: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Pedidos</h1>

      <form onSubmit={handleSubmit} className="grid gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Vendedor</label>
          <select
            className={`${selectClass} w-full`}
            value={formData.vendedor}
            onChange={e => setFormData({ ...formData, vendedor: e.target.value })}
            required
          >
            <option value="">Selecione...</option>
            {vendedores.map(v => (
              <option key={v.ID} value={v.NOME_COMPLETO}>{v.NOME_COMPLETO}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Produto</label>
          <select
            className={`${selectClass} w-full`}
            value={formData.codigo_produto}
            onChange={e => {
              const prodId = e.target.value;
              const prod = produtos.find(p => p.ID == prodId);
              setFormData({
                ...formData,
                codigo_produto: prodId,
                valor_venda: prod ? prod.VALOR : ''
              });
            }}
            required
          >
            <option value="">Selecione...</option>
            {produtos.map(p => (
              <option key={p.ID} value={p.ID}>{p.DESCRICAO} - R$ {p.VALOR}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Valor</label>
          <Input
            type="number"
            step="0.01"
            value={formData.valor_venda}
            onChange={e => setFormData({ ...formData, valor_venda: e.target.value })}
            required
          />
        </div>

        <div className="flex items-end">
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? 'Salvando...' : 'Salvar Venda'}
          </Button>
        </div>
      </form>

      <div>
        <h2 className="mb-3 font-heading text-lg font-bold text-foreground">Vendas Recentes</h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : vendas.length === 0 ? (
          <p className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            Nenhuma venda registrada ainda.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3">ID</th>
                    <th className="px-5 py-3">Vendedor</th>
                    <th className="px-5 py-3">Produto</th>
                    <th className="px-5 py-3">Valor</th>
                    <th className="px-5 py-3">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {vendas.map(v => (
                    <tr key={v.ID} className="border-t border-border">
                      <td className="px-5 py-4 text-muted-foreground">{v.ID}</td>
                      <td className="px-5 py-4 font-medium">{v.VENDEDOR}</td>
                      <td className="px-5 py-4">{v.NOME}</td>
                      <td className="px-5 py-4 font-semibold">R$ {v.VALOR}</td>
                      <td className="px-5 py-4 text-muted-foreground">{new Date(v.DATA_VENDA).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
