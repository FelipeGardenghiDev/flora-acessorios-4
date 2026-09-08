import { useState, useEffect } from 'react';
import { 
  listaVendas, 
  listaAnosVendas, 
  listaVendasRecentes, 
  listaVendedores, 
  listaProdutos 
} from '../services/api';

export function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vendas, setVendas] = useState([]);
  const [anos, setAnos] = useState([]);
  const [vendasRecentes, setVendasRecentes] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    async function carregarDadosDashboard() {
      try {
        setLoading(true);
        
        // Buscando os dados em paralelo do Supabase via api.js
        const [
          resVendas, 
          resAnos, 
          resRecentes, 
          resVendedores, 
          resProdutos
        ] = await Promise.all([
          listaVendas(),
          listaAnosVendas(),
          listaVendasRecentes(),
          listaVendedores(),
          listaProdutos()
        ]);

        setVendas(resVendas);
        setAnos(resAnos);
        setVendasRecentes(resRecentes);
        setVendedores(resVendedores);
        setProdutos(resProdutos);
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    carregarDadosDashboard();
  }, []);

  return {
    loading,
    error,
    vendas,
    anos,
    vendasRecentes,
    vendedores,
    produtos
  };
}