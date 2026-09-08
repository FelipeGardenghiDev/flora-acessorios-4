import { supabase } from '../lib/supabaseClient';

// 1. Lista os vendedores ordenados pelo nome completo
export async function listaVendedores() {
  const { data, error } = await supabase
    .from('funcionario')
    .select(`
      ID:id_func,
      NOME_COMPLETO:nome, 
      sobrenome,
      CPF:cpf,
      ADMISSAO:admissao,
      DESLIGAMENTO:desligamento
    `)
    .order('nome', { ascending: true });

  if (error) throw error;
  
  return data.map(f => ({
    ...f,
    NOME_COMPLETO: `${f.NOME_COMPLETO} ${f.sobrenome || ''}`.trim()
  }));
}

// 2. Lista os produtos ordenados por categoria, ID e descrição
export async function listaProdutos() {
  const { data, error } = await supabase
    .from('produto')
    .select(`
      ID:id_prod,
      CATEGORIA:categoria,
      DESCRICAO:descricao,
      VALOR:valor
    `)
    .order('categoria', { ascending: true })
    .order('id_prod', { ascending: true })
    .order('descricao', { ascending: true });

  if (error) throw error;
  return data;
}

// 3. Lista os produtos para formulário ordenados apenas por ID
export async function listaProdutosForm() {
  const { data, error } = await supabase
    .from('produto')
    .select(`
      ID:id_prod,
      CATEGORIA:categoria,
      DESCRICAO:descricao,
      VALOR:valor
    `)
    .order('id_prod', { ascending: true });

  if (error) throw error;
  return data;
}

// 4. Lista os anos distintos das vendas
export async function listaAnosVendas() {
  const { data, error } = await supabase
    .from('venda_cab')
    .select('data_venda');

  if (error) throw error;

  const anosSet = new Set(data.map(v => new Date(v.data_venda).getFullYear()));
  const anos = Array.from(anosSet)
    .sort((a, b) => b - a)
    .map(ANO => ({ ANO }));

  return anos;
}

// 5. Lista as vendas agrupadas por mês (com filtro opcional de ano)
export async function listaVendas(ano = null) {
  let query = supabase.from('venda_cab').select('data_venda, valor_total');

  if (ano) {
    query = query
      .gte('data_venda', `${ano}-01-01`)
      .lte('data_venda', `${ano}-12-31`);
  }

  const { data, error } = await query;
  if (error) throw error;

  const agrupado = {};
  data.forEach(venda => {
    const dataObj = new Date(venda.data_venda);
    const mes = dataObj.getUTCMonth() + 1;

    if (!agrupado[mes]) {
      agrupado[mes] = 0;
    }
    agrupado[mes] += Number(venda.valor_total);
  });

  return Object.keys(agrupado).map(mes => ({
    MES: Number(mes),
    TOTAL: agrupado[mes]
  })).sort((a, b) => a.MES - b.MES);
}

// 6. Busca o ID do vendedor pelo nome completo
export async function getVendedorByName(vendedorNome) {
  const { data, error } = await supabase
    .from('funcionario')
    .select('id_func, nome, sobrenome');

  if (error) throw error;

  const encontrado = data.find(f => `${f.nome} ${f.sobrenome}`.trim() === vendedorNome);
  return encontrado ? encontrado.id_func : null;
}

// 7. Gera o cabeçalho de uma nova venda
export async function geraVenda(id_func, data_venda, valor) {
  const { data, error } = await supabase
    .from('venda_cab')
    .insert([
      { id_func, data_venda, valor_total: valor }
    ])
    .select('id_venda')
    .single();

  if (error) throw error;
  return data.id_venda;
}

// 8. Insere um item na venda
export async function insereItemVenda(id_venda, id_prod, valor) {
  const { data, error } = await supabase
    .from('venda_item')
    .insert([
      { id_venda, id_prod, quantidade: 1, valor_unit: valor }
    ]);

  if (error) throw error;
  return true;
}

// 9. Lista as 4 vendas mais recentes
export async function listaVendasRecentes() {
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
    .order('data_venda', { ascending: false })
    .limit(4);

  if (error) throw error;

  return data.map(v => ({
    ID: v.ID,
    VENDEDOR: `${v.funcionario?.nome || ''} ${v.funcionario?.sobrenome || ''}`.trim(),
    CATEGORIA: v.venda_item?.[0]?.produto?.categoria || '',
    NOME: v.venda_item?.[0]?.produto?.descricao || '',
    VALOR: v.VALOR,
    DATA_VENDA: v.DATA_VENDA
  }));
}

// 10. Lista vendas por mês e ano opcional
export async function listaVendasPorMes(mes, ano = null) {
  let query = supabase
    .from('venda_cab')
    .select(`
      ID:id_venda,
      VALOR:valor_total,
      DATA_VENDA:data_venda,
      funcionario:id_func (nome, sobrenome),
      venda_item (
        produto:id_prod (categoria, descricao)
      )
    `);

  const anoAlvo = ano || new Date().getFullYear();
  const inicioMes = `${anoAlvo}-${String(mes).padStart(2, '0')}-01`;
  const proximoMes = mes === 12 ? `${anoAlvo + 1}-01-01` : `${anoAlvo}-${String(mes + 1).padStart(2, '0')}-01`;

  query = query
    .gte('data_venda', inicioMes)
    .lt('data_venda', proximoMes)
    .order('data_venda', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;

  return data.map(v => ({
    ID: v.ID,
    VENDEDOR: `${v.funcionario?.nome || ''} ${v.funcionario?.sobrenome || ''}`.trim(),
    CATEGORIA: v.venda_item?.[0]?.produto?.categoria || '',
    NOME: v.venda_item?.[0]?.produto?.descricao || '',
    VALOR: v.VALOR,
    DATA_VENDA: v.DATA_VENDA
  }));
}

// 11. Salva uma nova venda completa (substitui o antigo salvar_venda.php)
export async function salvarVenda({ vendedor, codigo_produto, valor_venda, mes_venda, ano_venda }) {
  if (!vendedor || !codigo_produto || !valor_venda || !mes_venda || !ano_venda) {
    throw new Error("Dados incompletos!");
  }

  const id_func = await getVendedorByName(vendedor);
  if (!id_func) {
    throw new Error("Vendedor não encontrado!");
  }

  const diaAtual = String(new Date().getDate()).padStart(2, '0');
  const mesFormatado = String(mes_venda).padStart(2, '0');
  const data_venda = `${ano_venda}-${mesFormatado}-${diaAtual}`;

  const id_venda = await geraVenda(id_func, data_venda, valor_venda);
  if (!id_venda) {
    throw new Error("Erro ao inserir venda!");
  }

  await insereItemVenda(id_venda, codigo_produto, valor_venda);

  return { status: "ok" };
}