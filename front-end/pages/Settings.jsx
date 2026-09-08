import React, { useState } from 'react';
import CategoryManager from '../components/settings/CategoryManager';
import { Button } from '@/components/ui/button';
import { useTheme } from '../lib/ThemeContext';

export default function Settings() {
  const { tema, setTema } = useTheme();
  const [saving, setSaving] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMensagem('');
    try {
      await setTema(tema);
      setMensagem('Configurações salvas com sucesso!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Configurações do Sistema</h1>

      <div className="max-w-md space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <form onSubmit={handleSalvar} className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Tema da Interface</label>
            <select
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="light">Claro (Light)</option>
              <option value="dark">Escuro (Dark)</option>
            </select>
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </form>

        {mensagem && <p className="text-sm text-primary">{mensagem}</p>}
      </div>

      <CategoryManager />
    </div>
  );
}
