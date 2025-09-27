const request = require('supertest');
const app = require('../src/index.js');
const { connect, closeDatabase, clearTransactions } = require('./setup');
//Desconecte o banco de dados no index.js e desligue o servidor


let token; 

beforeAll(async () => {
  await connect();

  const res = await request(app)
    .post('/api/users')
    .send({ nome: 'Gabriel', email: 'gabriel@gmail.com', senha: '12345678' });

  token = res.body.token; 
});

afterEach(async () => {
  await clearTransactions();
});

afterAll(async () => {
  await closeDatabase();
});

describe('Rotas de Transações', () => {

  it('Cria uma transação com sucesso', async () => {
    const res = await request(app)
      .post('/api/transacoes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        descricao: 'salário',
        valor: 2000,
        tipo: 'receita',
        categoria: 'trabalho'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.transacao).toHaveProperty('_id');
    expect(res.body.transacao.categoria).toBe('trabalho');
  });

  it('Lista transações e resumo', async () => {
    await request(app)
      .post('/api/transacoes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        descricao: 'Freela',
        valor: 500,
        tipo: 'receita',
        categoria: 'trabalho'
      });

    const res = await request(app)
      .get('/api/transacoes')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('transacoes');
    expect(res.body).toHaveProperty('resumo');
    expect(Array.isArray(res.body.transacoes)).toBe(true);
  });

  it('Atualiza uma transação por ID', async () => {
    const trans = await request(app)
      .post('/api/transacoes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        descricao: 'salario',
        valor: 2000,
        tipo: 'receita',
        categoria: 'trabalho'
      });

    const id = trans.body.transacao._id;

    const res = await request(app)
      .patch(`/api/transacoes/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ valor: 2500 });

    expect(res.statusCode).toBe(200);
    expect(res.body.transacao.valor).toBe(2500);
  });

  it('Apaga uma transação por ID', async () => {
    const trans = await request(app)
      .post('/api/transacoes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        descricao: 'Freela',
        valor: 500,
        tipo: 'receita',
        categoria: 'trabalho'
      });

    const id = trans.body.transacao._id;

    const res = await request(app)
      .delete(`/api/transacoes/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it('Apaga transações por categoria', async () => {
    await request(app)
      .post('/api/transacoes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        descricao: 'Freela1',
        valor: 200,
        tipo: 'receita',
        categoria: 'trabalho'
      });

    await request(app)
      .post('/api/transacoes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        descricao: 'Freela2',
        valor: 300,
        tipo: 'receita',
        categoria: 'trabalho'
      });

    const res = await request(app)
      .delete('/api/transacoes/categorias/trabalho')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.documentosApagados).toBe(2);
  });
});