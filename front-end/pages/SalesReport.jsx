import React, { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import { listaVendas } from '../services/api';

const MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export default function SalesReport() {
  const [vendasPorMes, setVendasPorMes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarRelatorio() {
      try {
        setLoading(true);
        const data = await listaVendas();
        setVendasPorMes(data);
      } catch (error) {
        console.error("Erro ao carregar relatório de vendas:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarRelatorio();
  }, []);

  const faturamentoTotal = vendasPorMes.reduce((acc, item) => acc + Number(item.TOTAL || 0), 0);

  if (loading) return <p className="text-sm text-muted-foreground">Gerando relatório de vendas...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Relatório de Vendas</h1>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Faturamento Total</p>
            <p className="font-heading text-2xl font-extrabold text-foreground">R$ {faturamentoTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-heading text-lg font-bold text-foreground">Faturamento por Mês</h2>
        {vendasPorMes.length === 0 ? (
          <p className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            Nenhuma venda registrada ainda.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px] text-left text-sm">
                <thead className="bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3">Mês</th>
                    <th className="px-5 py-3">Faturamento</th>
                  </tr>
                </thead>
                <tbody>
                  {vendasPorMes.map(v => (
                    <tr key={v.MES} className="border-t border-border">
                      <td className="px-5 py-4 font-medium">{MONTH_NAMES[v.MES - 1] || v.MES}</td>
                      <td className="px-5 py-4 font-semibold">R$ {Number(v.TOTAL).toFixed(2)}</td>
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
