API de Controle Financeiro
Esta é uma API RESTful desenvolvida em Node.js para o gerenciamento de finanças pessoais. A aplicação permite que os usuários se cadastrem, autentiquem e controlem suas transações financeiras (receitas e despesas), obtendo resumos e análises sobre seus gastos.

✨ Funcionalidades Principais
Autenticação Segura: Cadastro de usuários e autenticação baseada em JSON Web Tokens (JWT). Ao criar um novo usuário ou fazer login, um token de acesso é retornado para ser usado em rotas protegidas.

CRUD de Transações: Funcionalidades completas para Criar, Ler, Atualizar e Deletar transações financeiras.

Resumo Financeiro Inteligente: A rota de listagem de transações retorna, além da lista, um resumo completo do período, contendo:

Total de receitas.

Total de despesas.

Saldo (diferença entre receitas e despesas).

Análise de gastos com o percentual detalhado por categoria.

Filtros Avançados: A listagem de transações pode ser filtrada dinamicamente através de query params, permitindo consultas por mês, ano, tipo ou categoria.

🚀 Tecnologias Utilizadas
Node.js: Ambiente de execução JavaScript.

Express.js: Framework para a construção da API.

MongoDB: Banco de dados NoSQL para armazenamento dos dados.

Mongoose: ODM para modelagem dos objetos do MongoDB.

JWT (jsonwebtoken): Para geração e verificação de tokens de autenticação.

Jest & Supertest: Para a escrita e execução de testes automatizados.

dotenv: Para gerenciamento de variáveis de ambiente.

⚙️ Instalação e Configuração
Siga os passos abaixo para executar o projeto localmente.

Pré-requisitos:

Node.js (v16 ou superior)

NPM ou Yarn

MongoDB (uma instância local ou um cluster na nuvem como o MongoDB Atlas)

Passos:

Clone o repositório:

Bash

git clone https://URL-DO-SEU-REPOSITORIO.git
cd nome-do-diretorio
Instale as dependências:

Bash

npm install
Configure as variáveis de ambiente:
Crie um arquivo chamado .env na raiz do projeto, copiando o conteúdo do arquivo .env.example (se houver) ou usando o modelo abaixo:

Snippet de código

# Porta em que a aplicação será executada
PORT=3000

# URI de conexão com o banco de dados MongoDB
MONGODB_URI=mongodb://localhost:27017/finance-app

# Chave secreta para a assinatura dos tokens JWT
JWT_SECRET=suaChaveSuperSecretaAqui
▶️ Executando a Aplicação
Para iniciar o servidor em modo de desenvolvimento (com nodemon, se configurado):

Bash

npm run dev
Para iniciar o servidor em modo de produção:

Bash

npm start
🧪 Executando os Testes
Para rodar a suíte de testes automatizados e verificar a integridade da aplicação, execute:

Bash

npm test
📖 Documentação da API
Autenticação
POST /api/users - Criar novo usuário
Cria um novo usuário e retorna os dados do usuário junto com um token de autenticação.

Corpo da Requisição:

JSON

{
    "nome": "Gabriel",
    "email": "gabriel@gmail.com",
    "senha": "12345678"
}
Resposta de Sucesso (201 Created):

JSON

{
    "user": {
        "_id": "68d838efa4e6e789fe2a04d8",
        "nome": "Gabriel",
        "email": "gabriel@gmail.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
Transações (Rota Protegida)
GET /api/transacoes - Listar transações com resumo
Retorna uma lista de transações do usuário autenticado e um resumo financeiro.

Filtros (Query Params):

mes (Number): Filtra as transações por um mês específico (ex: mes=9 para Setembro).

ano (Number): Filtra as transações por um ano específico (ex: ano=2025).

tipo (String): Filtra por receita ou despesa.

categoria (String): Filtra por uma categoria exata (ex: categoria=lazer).

Exemplo de Uso:GET /api/transacoes?ano=2025&mes=9&tipo=despesa

Resposta de Sucesso (200 OK):

JSON

{
    "transacoes": [
        {
            "_id": "68d83a15a4e6e789fe2a04e5",
            "descricao": "Cinema",
            "valor": 50,
            "tipo": "despesa",
            "categoria": "lazer",
            "data": "2025-09-27T19:28:37.869Z",
            "user": "68d838efa4e6e789fe2a04d8"
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
POST /api/transacoes - Criar nova transação
Adiciona uma nova transação (receita ou despesa) para o usuário autenticado.

Corpo da Requisição:

JSON

{
    "descricao": "Salário",
    "valor": 3000,
    "tipo": "receita",
    "categoria": "trabalho"
}