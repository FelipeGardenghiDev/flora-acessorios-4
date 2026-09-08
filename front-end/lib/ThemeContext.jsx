import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const ThemeContext = createContext();
const STORAGE_KEY = 'flora_tema';

function applyThemeClass(tema) {
  document.documentElement.classList.toggle('dark', tema === 'dark');
}

export const ThemeProvider = ({ children }) => {
  const [tema, setTemaState] = useState(() => localStorage.getItem(STORAGE_KEY) || 'light');

  useEffect(() => {
    applyThemeClass(tema);
  }, [tema]);

  // Sem preferência local salva ainda: se houver sessão, herda o tema gravado
  // no user_metadata (ex.: usuário logando pela primeira vez neste dispositivo).
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      const remoteTema = session?.user?.user_metadata?.tema;
      if (remoteTema && remoteTema !== tema) {
        setTemaState(remoteTema);
        localStorage.setItem(STORAGE_KEY, remoteTema);
      }
    });
  }, []);

  const setTema = async (novoTema) => {
    setTemaState(novoTema);
    localStorage.setItem(STORAGE_KEY, novoTema);
    applyThemeClass(novoTema);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      await supabase.auth.updateUser({ data: { tema: novoTema } });
    } catch (error) {
      console.error('Não foi possível sincronizar o tema com o Supabase:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ tema, setTema }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};
