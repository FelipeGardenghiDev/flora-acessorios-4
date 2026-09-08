# flora-acessorios-4

Monorepo do projeto integrador **Flora Acessórios**.

## Estrutura do Repositório

```text
flora-acessorios-4/
├── back-end/      # A ser desenvolvido do zero pela equipe
├── database/      # Modelagem e scripts de banco de dados (a ser desenvolvido do zero)
├── front-end/     # Interface desenvolvida em React + Vite + Tailwind CSS
└── README.md
```

---

## Front-End

A interface do usuário foi construída utilizando:
- **React 18** com **Vite**
- **Tailwind CSS** e **Shadcn UI (Radix UI)**
- **Recharts** (gráficos e relatórios de vendas)
- **React Router Dom** (roteamento)
- **Lucide React** (ícones)

### Como executar o Front-End localmente

1. Acesse o diretório do front-end:
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

O Vite iniciará o servidor no endereço `http://127.0.0.1:5173`.

### Ponto de Integração da API

As chamadas e integrações de dados estão centralizadas no diretório [`front-end/services/api.js`](front-end/services/api.js). Quando o novo back-end for construído e as rotas/endpoints forem definidos pela equipe, basta atualizar as funções desse arquivo para consumirem a nova API.

---

## Back-End & Database

- Os diretórios `back-end/` e `database/` estão preparados para receber a nova implementação definida pelo grupo.
