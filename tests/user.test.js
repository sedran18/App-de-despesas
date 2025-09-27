const request = require('supertest');
const app = require('../src/index.js');
const { connect, closeDatabase, clearDatabase } = require('./setup');
//Desconecte o banco de dados no index.js e desligue o servidor

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe('Usuários', () => {
    it('criar usuário e retornar token e usuário', async () => {
        const res = await request(app).post('/api/users').send({
            nome: 'Gabriel',
            email: 'gabriel@example.com',
            senha: '123456'
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.user.nome).toBe('Gabriel');
        expect(res.body.token).toBeDefined();
    });


    it('não cria usuário com campos inválidos', async () => {
        const res = await request(app).post('/api/users').send({
            nome: 'Gabriel',
            senha: '12345678'
        });

        expect(res.statusCode).toBe(400);
    });


    it('login válido retorna token', async () => {
        await request(app).post('/api/users').send({
            nome: 'Gabriel',
            email: 'gabriel@gmail.com',
            senha: '12345678'
        });

        const res = await request(app).post('/api/users/login').send({
            email: 'gabriel@gmail.com',
            senha: '12345678'
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });


    it('login inválido retorna erro', async () => {
        const res = await request(app).post('/api/users/login').send({
            email: 'gabriel@gmail.com',
            senha: '12345678'
        });

        expect(res.statusCode).toBe(400);
    });

    it('logout Usuário', async () => {
        const user = await request(app).post('/api/users').send({
            nome: 'Gabriel',
            email: 'gabriel@gmail.com',
            senha: '12345678'
        });
         
        const token = user.body.token;

        const res = await request(app).post('/api/users/logout').set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
    });

    it('logout todos usuários', async () => {
        const user = await request(app).post('/api/users').send({
            nome: 'Gabriel',
            email: 'gabriel@gmail.com',
            senha: '12345678'
        });
         
        const token = user.body.token;

        const res = await request(app).post('/api/users/logoutAll').set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    })

     
    it('verPerfil', async () => {
        const user = await request(app).post('/api/users').send({
            nome: 'Gabriel',
            email: 'gabriel@gmail.com',
            senha: '12345678'
        });
         
        const token = user.body.token;

        const res = await request(app).get('/api/users/me').set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
    });


    it('atualizar dados', async () => {
        const user = await request(app).post('/api/users').send({
            nome: 'Gabriel',
            email: 'gabriel@gmail.com',
            senha: '12345678'
        });

        const token = user.body.token;

        const res = await request(app).patch('/api/users') .set('Authorization', `Bearer ${token}`).send({
            senha: 'gabriel123'
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.nome).toBe(user.body.user.nome);
    });

    it('Não atualiza se não informar um senha ou nome', async () => {
        const user = await request(app).post('/api/users').send({
            nome: 'Gabriel',
            email: 'gabriel@gmail.com',
            senha: '12345678'
        });

        const token = user.body.token;

        const res = await request(app).patch('/api/users') .set('Authorization', `Bearer ${token}`).send({
            email: 'nardes@gmail.com'
        });

        expect(res.statusCode).toBe(400);
    });


    it('deletar usuário', async () => {
        const user = await request(app).post('/api/users').send({
            nome: 'Gabriel',
            email: 'gabriel@gmail.com',
            senha: '12345678'
        });

        const token = user.body.token;

        const res = await request(app).delete('/api/users') .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.email).toBe(user.body.user.email);

    });


     it('enviar token errado', async () => {
        const user = await request(app).post('/api/users').send({
            nome: 'Gabriel',
            email: 'gabriel@gmail.com',
            senha: '12345678'
        });

        const token = user.body.token;

        const res = await request(app).delete('/api/users') .set('Authorization', `Bearer 122445`);

        expect(res.statusCode).toBe(401);
    });
})