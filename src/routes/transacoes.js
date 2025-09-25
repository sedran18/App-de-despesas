const express = require('express');
const router = express.Router();
const Transacao = require('../models/transacoes.js');
const auth = require('../middlewares/auth.js');
const User = require('../models/users.js');

//criar transaçao
router.post('/transacoes', auth, async (req, res)=> {
    const verificar = ['descricao', 'valor', 'tipo', 'categoria', 'data'];
    const keys = Object.keys(req.body);
    if (!keys.every(x => verificar.includes(x))) return res.status(400).json({erro: 'Informe os argumentos corretos'});


    try {
        const categoria = req.body.categoria.toLowerCase();
        const limiteCategoria = await Transacao.verificarLimiteCategorias(req.user._id, categoria);

        if (!limiteCategoria) {
            return res.status(400).json({ erro: 'Limite de categorias atingido' });
        };


        const transacao = new Transacao({
            descricao: req.body.descricao,
            valor: req.body.valor,
            tipo: req.body.tipo,
            categoria,
            user: req.user._id});

        await transacao.save();
        res.status(201).json({transacao})
    } catch (err) {
        res.status(500).json({error: 'Erro ao criar transação'});
    }

});


//read receita
router.get('/transacoes', auth, async (req, res) => {
    try {
        const hoje = new Date();
        const mes = req.query.mes ? parseInt(req.query.mes) : hoje.getMonth() + 1;
        const ano = req.query.ano ? parseInt(req.query.ano) : hoje.getFullYear();
        const categoria = req.query.categoria ? req.query.categoria : null;
        const tipo = req.query.tipo ? req.query.tipo : null;
        
        const transacoes = await Transacao.procurarPorDataCategoriaETipo(req.user._id, ano, mes, categoria, tipo)
            .limit(req.query.limit ? parseInt(req.query.limit) : 10)
            .skip(req.query.skip ? parseInt(req.query.skip) : 0);

        res.json(transacoes);
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao mostrar transações' });
    }
});

//read categorias
router.get('/transacoes/categorias', auth, async (req, res) => {
    try {
        const arrDeCategorias = await Transacao.distinct('categoria', {user: req.user._id});
        res.json(arrDeCategorias);
    } catch (err) {
        res.status(500).json({error: 'Erro ao recuperar categorias'})
    }
});



//update informações pelo id;
router.patch('/transacoes/:id', auth, async (req, res) => {
    const camposPermitidos = ['descricao', 'valor', 'tipo', 'categoria', 'data'];
    const camposRecebidos = Object.keys(req.body);

    const valido = camposRecebidos.every(campo => camposPermitidos.includes(campo));
    if (!valido) return res.status(400).json({ erro: 'Campos inválidos para atualização' });


    try {
        const transacao = await Transacao.findOne({_id: req.params.id, user: req.user._id}); //id do documento e id do user;
        if (!transacao) return res.status(404).json({ erro: 'Transação não encontrada' });

        camposRecebidos.forEach(campo => {
            if (campo === 'categoria') {
                transacao[campo] = req.body[campo].toLowerCase();
            } else {
                transacao[campo] = req.body[campo];
            }
         });

        await transacao.save();
        res.json({transacao});
     } catch (err) {
        res.status(500).json({ erro: err.message });
    }
    
});

//update/replace categoria
router.patch('/transacoes/categorias', async (req, res) => {
    const { antigaCategoria, novaCategoria } = req.body;

    if (!antigaCategoria || !novaCategoria) {
        return res.status(400).json({ erro: 'Você precisa informar a categoria antiga e a nova' });
    }

    try {
        const result = await Transacao.updateMany(
            { categoria: antigaCategoria.toLowerCase() },
            { $set: { categoria: novaCategoria.toLowerCase() } },
            { runValidators: true } 
        );

        res.json({
            mensagem: 'Categoria atualizada com sucesso',
            documentosAfetados: result.modifiedCount
        });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});



//apagar transação
// Apaga por ID
router.delete('/transacoes/:id', auth, async (req, res) => {
    const apagado = await Transacao.deleteOne({ _id: req.params.id, user: req.user._id });
    if (apagado.deletedCount === 0) return res.status(404).json({ erro: 'Transação não encontrada' });
    res.json({ mensagem: 'Transação apagada com sucesso'});
});

router.delete('/transacoes/categorias/', auth, async (req, res) => {
    const apagados = await Transacao.deleteMany({ categoria: req.query.categoria.toLowerCase(), user: req.user._id });
    res.json({ mensagem: 'Elementos apagados com sucesso', documentosApagados: apagados.deletedCount });
});


module.exports = router;

