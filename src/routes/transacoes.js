const express = require('express');
const router = express.Router();
const Transacao = require('../models/transacoes.js');
const auth = require('../middlewares/auth.js');
const User = require('../models/users.js');

//criar transaçao
router.post('/transacoes', auth, async (req, res)=> {
    const verificar = ['descricao', 'valor', 'tipo', 'categoria', 'data'];
    const keys = Ovject.keys(req.body);
    if (!keys.every(x => verificar.includes(x))) return !res.status(400).json({erro: 'Informe os argumentos corretos'});


    try {
        const limiteCategoria = await Transacao.verificarLimiteCategorias(req.user._id, req.body.categoria);
        if (limiteCategoria === false) {
            throw new Error('Não é possível adicionar mais categorias')
        }
        const transacao = new Transacao(req.body);
        await transacao.save();
        res.json({transacao})
    } catch (err) {
        res.send(500).json({error: err.message});
    }

});


//read receita
router.get('/transacoes', auth, async (req, res) => {
    try {
        const hoje = new Date();
        const mes = req.query.mes ? parseInt(req.query.mes) : hoje.getMonth() + 1;
        const ano = req.query.ano ? parseInt(req.query.ano) : hoje.getFullYear();
        const categoria = req.query.categoria ? req.query.categoria : null;
        
        const transacoes = await Transacao.procurarPorDataECategoria(req.user._id, ano, mes, categoria)
            .limit(req.query.limit ? parseInt(req.query.limit) : 10)
            .skip(req.query.skip ? parseInt(req.query.skip) : 0);

        res.json(transacoes);
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao mostrar transações' });
    }
});

//read categorias
router.get('/transacoes/categorias', auth, (req, res) => {

})



//update informações
router.patch('/transacoes', (req, res) => {

});

//update/replace categoria
router.patch('/transacoes/categorias', (req, res) => {

});

//apagar categoria;
router.delete('/transacoes/categorias', (req, res) => {

});

//apagar transação
router.delete('/transacoes/categorias', (req, res) => {

});


