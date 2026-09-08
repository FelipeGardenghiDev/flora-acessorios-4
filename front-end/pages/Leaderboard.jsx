import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const medalClass = ['bg-[#ffd166]/20 text-[#b8860b]', 'bg-secondary text-secondary-foreground', 'bg-[#ff8db8]/15 text-[#ff8db8]'];

export default function Leaderboard() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarLeaderboard() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('venda_cab')
          .select(`
            valor_total,
            funcionario:id_func (id_func, nome, sobrenome)
          `);

        if (error) throw error;

        const totaisPorVendedor = {};

        data.forEach(venda => {
          const func = venda.funcionario;
          if (!func) return;

          const nomeCompleto = `${func.nome} ${func.sobrenome || ''}`.trim();

          if (!totaisPorVendedor[nomeCompleto]) {
            totaisPorVendedor[nomeCompleto] = 0;
          }
          totaisPorVendedor[nomeCompleto] += Number(venda.valor_total || 0);
        });

        const rankingOrdenado = Object.keys(totaisPorVendedor).map(nome => ({
          nome,
          total: totaisPorVendedor[nome]
        })).sort((a, b) => b.total - a.total);

        setRanking(rankingOrdenado);
      } catch (error) {
        console.error("Erro ao carregar o leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarLeaderboard();
  }, []);

  if (loading) return <p className="text-sm text-muted-foreground">Carregando ranking...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Ranking de Vendedores</h1>

      {ranking.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          Nenhum dado de vendas disponível para o ranking.
        </p>
      ) : (
        <div className="space-y-3">
          {ranking.map((item, index) => (
            <div key={item.nome} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-heading text-sm font-bold ${medalClass[index] || 'bg-muted text-muted-foreground'}`}>
                {index < 3 ? <Trophy className="h-4 w-4" /> : index + 1}
              </div>
              <p className="flex-1 font-medium text-foreground">{item.nome}</p>
              <p className="font-heading text-lg font-bold text-primary">R$ {item.total.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
