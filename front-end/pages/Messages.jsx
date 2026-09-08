import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Messages() {
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function carregarMensagens() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('mensagens')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMensagens(data || []);
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarMensagens();
  }, []);

  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!novaMensagem.trim()) return;

    setSending(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      const { error } = await supabase
        .from('mensagens')
        .insert([{ texto: novaMensagem, user_id: user?.id }]);

      if (error) throw error;

      setNovaMensagem('');
      const { data: atualizadas } = await supabase
        .from('mensagens')
        .select('*')
        .order('created_at', { ascending: false });

      setMensagens(atualizadas || []);
    } catch (error) {
      alert("Erro ao enviar mensagem: " + error.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground">Carregando mensagens...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Central de Mensagens</h1>

      <form onSubmit={handleEnviar} className="flex gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <Input
          type="text"
          value={novaMensagem}
          onChange={(e) => setNovaMensagem(e.target.value)}
          placeholder="Digite sua mensagem..."
          required
        />
        <Button type="submit" disabled={sending}>
          <Send className="mr-2 h-4 w-4" />{sending ? 'Enviando...' : 'Enviar'}
        </Button>
      </form>

      {mensagens.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          Nenhuma mensagem ainda.
        </p>
      ) : (
        <ul className="space-y-3">
          {mensagens.map(msg => (
            <li key={msg.id} className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleString()}</p>
              <p className="mt-1 text-sm text-foreground">{msg.texto}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
