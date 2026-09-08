import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    async function carregarPerfil() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          setUser(user);
          setNome(user.user_metadata?.nome || '');
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarPerfil();
  }, []);

  const handleAtualizar = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMensagem('');
    try {
      const { error } = await supabase.auth.updateUser({
        data: { nome }
      });

      if (error) throw error;
      setMensagem('Perfil atualizado com sucesso!');
    } catch (error) {
      alert("Erro ao atualizar perfil: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground">Carregando perfil...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Meu Perfil</h1>

      <div className="max-w-md space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div>
          <p className="text-xs text-muted-foreground">E-mail</p>
          <p className="font-medium text-foreground">{user?.email}</p>
        </div>

        <form onSubmit={handleAtualizar} className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Nome Completo</label>
            <Input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </form>

        {mensagem && <p className="text-sm text-primary">{mensagem}</p>}
      </div>
    </div>
  );
}
