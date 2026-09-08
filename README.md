# Flora Acessórios 4.0 — Projeto Integrador

> 📌 **Status do Projeto (Alinhamento de Reunião):**  
> O **Front-End** está integrado, funcional e pronto para demonstração e navegação de telas.  
> As frentes de **Back-End** e **Database** serão desenvolvidas do zero pela equipe, com novas definições de linguagem, arquitetura e modelagem.

---

## 📁 Estrutura do Monorepo

```text
flora-acessorios-4/
├── back-end/       # ⏳ A ser desenvolvido do zero pela equipe
├── database/       # ⏳ Modelagem e scripts SQL a serem desenvolvidos do zero
├── front-end/      # ✅ [PRONTO] Interface de usuário completa em React + Vite
├── .gitignore
└── README.md
```

---

## 🎨 Front-End (Visão Geral)

O front-end foi completamente modernizado, oferecendo uma experiência de usuário (UI/UX) responsiva, interativa e acessível.

### 🛠️ Tecnologias e Bibliotecas Utilizadas

* **Framework & Build:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) (execução ultrarrápida e Hot Module Replacement).
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/) com suporte a classes utilitárias e variáveis semânticas de tema.
* **Componentes de UI:** [Shadcn UI](https://ui.shadcn.com/) (primitivas acessíveis baseadas em [Radix UI](https://www.radix-ui.com/)).
* **Gráficos & Visualização:** [Recharts](https://recharts.org/) (gráficos de linha, barras e relatórios dinâmicos).
* **Interatividade Avançada:** `@dnd-kit` (sistema de arrastar e soltar / *Drag & Drop* dos widgets do painel).
* **Roteamento:** [React Router DOM](https://reactrouter.com/) (rotas protegidas e navegação SPA).
* **Ícones:** [Lucide React](https://lucide.dev/).
* **Feedback ao Usuário:** Notificações flutuantes via Sonner / Toast.
* **Tema:** Suporte nativo a Modo Claro e Modo Escuro (*Dark Mode*).

---

### 🖥️ Telas e Módulos Implementados

1. **Dashboard Principal (`/`):**
   * Grade de cartões reorganizáveis por *drag-and-drop*.
   * Indicadores-chave (KPIs): faturamento, saúde do estoque e alertas de estoque baixo.
   * Gráficos analíticos de nível de estoque, insights de clientes e previsão de demanda.
2. **Gerenciamento de Pedidos (`/orders`):**
   * Formulário intuitivo de inserção de vendas (seleção de vendedor, produto e cálculo de valor).
   * Tabela resumida das vendas mais recentes.
3. **Catálogo de Produtos (`/products`):**
   * Listagem de estoque com indicadores visuais de urgência (crítico, baixo, saudável).
   * Filtros por categoria e disponibilidade.
   * Botões de ajuste rápido de quantidade (+ / -).
   * Botão de importação em lote via arquivo CSV.
4. **Ranking de Vendedores (`/leaderboard`):**
   * Pódio visual com medalhas e faturamento total ordenado por vendedor.
5. **Relatório de Vendas (`/sales-report`):**
   * Consolidação do faturamento agrupado por mês e faturamento total do período.
6. **Histórico de Transações (`/history`):**
   * Tabela analítica completa com detalhes de data, vendedor, produto e valor de cada transação.
7. **Central de Mensagens (`/messages`):**
   * Interface de chat interno e mural de avisos entre a equipe.
8. **Favoritos (`/favourites`):**
   * Painel de acesso rápido aos produtos marcados com estrela/coração.
9. **Configurações & Categorias (`/settings`):**
   * Criação e exclusão dinâmica de categorias de produtos.
10. **Autenticação & Perfil:**
    * Telas completas de Login (`/login`), Cadastro (`/register`), Esqueci a Senha (`/forgot-password`), Redefinição de Senha (`/reset-password`) e Perfil (`/profile`).

---

### 🚀 Como Executar o Front-End Localmente

1. Entre no diretório do front-end:
   ```bash
   cd front-end
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Abra seu navegador no endereço indicado (por padrão: `http://127.0.0.1:5173`).

---

## 🤝 Alinhamento para Back-End & Banco de Dados

* **Ponto de Integração:** Toda a lógica de comunicação de dados do front-end está isolada no arquivo [`front-end/services/api.js`](front-end/services/api.js).
* **Próximo Passo do Grupo:** Assim que a equipe definir a nova stack de Back-End (ex.: Node.js, Python/FastAPI, Java/Spring, PHP, etc.) e o modelo de banco de dados (relacional ou não), bastará conectar as funções de `api.js` aos novos endpoints REST HTTP.
