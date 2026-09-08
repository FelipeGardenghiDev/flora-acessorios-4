import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function History() {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarHistorico() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('venda_cab')
          .select(`
            ID:id_venda,
            VALOR:valor_total,
            DATA_VENDA:data_venda,
            funcionario:id_func (nome, sobrenome),
            venda_item (
              produto:id_prod (categoria, descricao)
            )
          `)
          .order('data_venda', { ascending: false });

        if (error) throw error;

        const formatado = (data || []).map(v => ({
          ID: v.ID,
          VENDEDOR: `${v.funcionario?.nome || ''} ${v.funcionario?.sobrenome || ''}`.trim(),
          CATEGORIA: v.venda_item?.[0]?.produto?.categoria || '',
          NOME: v.venda_item?.[0]?.produto?.descricao || '',
          VALOR: v.VALOR,
          DATA_VENDA: v.DATA_VENDA
        }));

        setHistorico(formatado);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarHistorico();
  }, []);

  if (loading) return <p className="text-sm text-muted-foreground">Carregando histórico...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Histórico de Transações</h1>

      {historico.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          Nenhum registro encontrado no histórico.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Data</th>
                  <th className="px-5 py-3">Vendedor</th>
                  <th className="px-5 py-3">Produto</th>
                  <th className="px-5 py-3">Valor</th>
                </tr>
              </thead>
              <tbody>
                {historico.map(item => (
                  <tr key={item.ID} className="border-t border-border">
                    <td className="px-5 py-4 text-muted-foreground">{item.ID}</td>
                    <td className="px-5 py-4 text-muted-foreground">{new Date(item.DATA_VENDA).toLocaleDateString()}</td>
                    <td className="px-5 py-4 font-medium">{item.VENDEDOR}</td>
                    <td className="px-5 py-4">{item.NOME}</td>
                    <td className="px-5 py-4 font-semibold">R$ {Number(item.VALOR).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
