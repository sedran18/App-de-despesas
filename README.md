
# App de despesas

Esta é uma API RESTful desenvolvida em Node.js para o gerenciamento de finanças pessoais. A aplicação permite que os usuários se cadastrem, autentiquem e controlem suas transações financeiras (receitas e despesas), obtendo resumos e análises sobre seus gastos.

## ✨ Funcionalidades Principais

* **Autenticação Segura:** Cadastro e login de usuários com autenticação baseada em JSON Web Tokens (JWT).
* **CRUD de Transações:** Funcionalidades completas para Criar, Ler, Atualizar e Deletar transações financeiras.
* **Resumo Financeiro Inteligente:** A rota de listagem de transações retorna um resumo completo do período, contendo:
    * Total de receitas e despesas.
    * Saldo final.
    * Análise de gastos com o **percentual detalhado por categoria**.
* **Filtros Avançados:** A listagem de transações pode ser filtrada dinamicamente via *query params* (mês, ano, tipo ou categoria).

## 📂 Estrutura do Projeto
```bash
/
├── src/
│   ├── controllers/    # Lógica de controle das rotas
│   ├── middlewares/    # Middlewares (ex: autenticação)
│   ├── models/         # Modelos e esquemas do Mongoose
│   ├── routes/         # Definição das rotas da API
│   └── index.js        # Arquivo principal da aplicação Express
├── tests/              # Testes automatizados
├── .env                # Arquivo para variáveis de ambiente
└── package.json
```

## 🚀 Tecnologias Utilizadas

* **Node.js**: Ambiente de execução JavaScript.
* **Express.js**: Framework para a construção da API.
* **MongoDB**: Banco de dados NoSQL.
* **Mongoose**: ODM para modelagem dos objetos do MongoDB.
* **JWT (jsonwebtoken)**: Para geração e verificação de tokens.
* **Jest & Supertest**: Para a escrita e execução de testes.
* **dotenv**: Para gerenciamento de variáveis de ambiente.

## ⚙️ Instalação e Configuração

Siga os passos abaixo para executar o projeto localmente.

**Pré-requisitos:**

* Node.js (v16 ou superior)
* NPM ou Yarn
* MongoDB (instância local ou um cluster na nuvem)

**Passos:**

1.  **Clone o repositório:**
    ```bash
    git clone [https://URL-DO-SEU-REPOSITORIO.git](https://URL-DO-SEU-REPOSITORIO.git)
    cd nome-do-diretorio
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz do projeto, utilizando o modelo abaixo:

    ```env
    # Porta em que a aplicação será executada
    PORT=3000

    # URI de conexão com o banco de dados MongoDB
    MONGODB_URI=mongodb://localhost:27017/finance-app

    # Chave secreta para a assinatura dos tokens JWT
    JWT_SECRET=suaChaveSuperSecretaAqui
    ```

## ▶️ Executando a Aplicação

* **Modo de desenvolvimento:**
    ```bash
    npm run dev
    ```

* **Modo de produção:**
    ```bash
    npm start
    ```

## 🧪 Executando os Testes

```bash
npm test
```
## 📖 Documentação da API
**Autenticação**

```POST /api/users``` **- Criar novo usuário**
Cria um novo usuário e retorna seus dados junto com um token de autenticação.

**Corpo da Requisição:**

```JSON

{
    "nome": "Gabriel",
    "email": "gabriel@gmail.com",
    "senha": "12345678"
}
```
**Resposta de Sucesso (201 Created):**

```JSON

{
    "user": {
        "nome": "Gabriel",
        "email": "gabriel@gmail.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
```POST /api/users/login``` **- Login de usuário**

Autentica um usuário existente e retorna um novo token.

**Corpo da Requisição:**

```JSON

{
    "email": "gabriel@gmail.com",
    "senha": "12345678"
}
```
**Resposta de Sucesso (200 OK):**

```JSON

{
    "user": {
        "nome": "Gabriel",
        "email": "gabriel@gmail.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

```POST /api/users/me``` **- Ver dados do usuário**

Retorna dados seguros do usuário (Necessita autenticação).

```JSON
{
    "user": {
        "nome": "Gabriel",
        "email": "gabriel@gmail.com"
    }
}
``` 

```POST /api/users/logout``` **- Remove token**

Remove token (enviado no header) da autenticação.


```POST /api/users/logoutAll``` **- Remove todos os tokens**

Remove todos os tokens do usuário (Necessita autenticação).

``` 
**Transações (Rota Protegida)**

Lembrando que todas as requisições tem que ser autenticada via token, adicionando Bearer <token> no header Authentication.

```GET /api/transacoes``` **- Listar transações com resumo**

Retorna as transações do usuário e um resumo financeiro, com possibilidade de filtros.

**Filtros (Query Params):**

* mes (Number): Filtra por um mês específico (ex: mes=9).

* ano (Number): Filtra por um ano específico (ex: ano=2025).

* tipo (String): Filtra por receita ou despesa.

* categoria (String): Filtra por uma categoria exata.

**Exemplo de Uso:**

```HTTP
GET /api/transacoes?ano=2025&mes=9&tipo=despesa
```

**Resposta de Sucesso (200 OK):**

```JSON
{
    "transacoes": [
        {
            "_id": "68d83a15a4e6e789fe2a04e5",
            "descricao": "Cinema",
            "valor": 50,
            "tipo": "despesa",
            "categoria": "lazer",
            "data": "2025-09-27T19:28:37.869Z"
        }
    ],
    "resumo": {
        "totalReceita": 3000,
        "totalDespesa": 550.50,
        "porcentagemDeGastosPorCategoria": {
            "alimentação": "63.58",
            "lazer": "9.08",
            "transporte": "27.34"
        },
        "saldo": 2449.50
    }
}
```

```GET /api/transacoes/categorias``` **- Listar categorias adicionadas**

Retorna um array listando todas as categorias adicionadas no banco de dados.
```JSON
["alimentação", "transporte", "salário"]
```
```POST /api/transacoes``` **- Criar nova transação**

Adiciona uma nova transação para o usuário autenticado.

**Corpo da Requisição:**

```JSON
{
    "descricao": "Salário",
    "valor": 3000,
    "tipo": "receita",
    "categoria": "trabalho"
}
```
**Resposta de Sucesso (201 Created):**

```JSON
{
    "_id": "novoIdDaTransacao",
    "descricao": "Salário",
    "valor": 3000,
    "tipo": "receita",
    "categoria": "trabalho",
    "data": "2025-09-27T20:00:00.000Z"
}
```
```PATCH /api/transacoes/:id``` **- Atualizar uma transação**

Atualiza uma transação existente pelo seu ID.

**Corpo da Requisição (apenas os campos a serem alterados):**

```JSON

{
    "valor": 3500,
    "descricao": "Salário com aumento"
}
```
**Resposta de Sucesso (200 OK):**

```JSON
{
    "_id": "idDaTransacao",
    "descricao": "Salário com aumento",
    "valor": 3500,
    "tipo": "receita",
    "categoria": "trabalho",
    "data": "2025-09-27T20:00:00.000Z"
}
```

```PATCH /api/transacoes``` **- Renomear uma categoria**

Renomeia uma categoria

**Corpo da Requisição:**

```JSON
{ "antigaCategoria": "freelancer", "novaCategoria": "salario" }
```

**Resposta de Sucesso (200 OK):**

```JSON
{
    "mensagem": "Categoria atualizada com sucesso",
    "documentosAfetados": 4
}
```

```DELETE /api/transacoes/:id``` **- Deletar uma transação**

Remove uma transação pelo seu ID.

**Resposta de Sucesso (200 OK):**

```JSON
{
    "mensagem": "Transação apagada com sucesso"
}
```


```DELETE /api/transacoes/:categoria``` **- Deletar uma transação por categoria**

Remove uma transação pela sua categoria.

**Resposta de Sucesso (200 OK):**

```JSON
{
    "mensagem": "Transação apagada com sucesso"
}
```
## ⚖️ Licença
Este projeto está licenciado sob a Licença MIT.