const Transacao = require('../models/transacoes.js');

const criarTransacao = async (req, res)=> {
    const camposPermitidos = ['descricao', 'valor', 'tipo', 'categoria', 'data'];
    const verificar  = Object.keys(req.body).every(x => camposPermitidos.includes(x));
    if (!verificar) return res.status(400).json({erro: 'Informe os argumentos corretos'});


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
        res.status(500).json({error: err.message});
    }

}


const consultarReceitaDoUsuario = async (req, res) => {
    try {
        const hoje = new Date();
        const mes = req.query.mes ? parseInt(req.query.mes) : hoje.getMonth() + 1;
        const ano = req.query.ano ? parseInt(req.query.ano) : hoje.getFullYear();
        const categoria = req.query.categoria ? req.query.categoria : null;
        const tipo = req.query.tipo ? req.query.tipo : null;
        
        const transacoes = await Transacao.procurarPorDataCategoriaETipo(req.user._id, ano, mes, categoria, tipo)
            .limit(req.query.limit ? parseInt(req.query.limit) : 10)
            .skip(req.query.skip ? parseInt(req.query.skip) : 0).sort({date: -1});

        const totalReceita = transacoes
            .filter(t => t.tipo === 'receita')
            .reduce((acc, t) => acc + t.valor, 0);

        const totalDespesa = transacoes
            .filter(t => t.tipo === 'despesa')
            .reduce((acc, t) => acc + t.valor, 0);

        // Percentual de gasto por categoria
        const categorias = {};
        transacoes.forEach(t => {
            if (!categorias[t.categoria]) categorias[t.categoria] = 0;
            categorias[t.categoria] += t.valor;
        });

        const porcentagemDeGastosPorCategoria = {};
        const totalGastos = totalDespesa;
     
        if (totalGastos > 0) {
            for (const cat in categorias) {
                porcentagemDeGastosPorCategoria[cat] = ((categorias[cat] / totalGastos) * 100).toFixed(2);
            }
        } else {
            for (const cat in categorias) {
                porcentagemDeGastosPorCategoria[cat] = '0.00';
            }
        };


        const saldo = totalReceita - totalDespesa;
        res.json({
            transacoes,
            resumo: {
                totalReceita,
                totalDespesa,
                porcentagemDeGastosPorCategoria,
                saldo
            }
        });
        
    } catch (err) {
        res.status(500).json({ erro: err.message});
    }
};

const verCategorias = async (req, res) => {
    try {
        const arrDeCategorias = await Transacao.distinct('categoria', {user: req.user._id});
        res.json(arrDeCategorias);
    } catch (err) {
        res.status(500).json({error: err.message})
    }
};

const renomearCategoria =  async (req, res) => {
    
    const { antigaCategoria, novaCategoria } = req.body;
    if (!antigaCategoria || !novaCategoria) {
        return res.status(400).json({ erro: 'Você precisa informar a categoria antiga e a nova' });
    }


    try {
        const result = await Transacao.updateMany(
            { categoria: antigaCategoria.toLowerCase(), user: req.user._id},
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
};


const atualizarTransacao = async (req, res) => {
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
    
};


const apagarPorId = async (req, res) => {
    try {
        const aApagar = await Transacao.findOne({ _id: req.params.id, user: req.user._id});
        if (!aApagar) {
            return res.status(400).json({error: 'Informe um Id válido'});
        }
        await aApagar.deleteOne();
        res.json({ mensagem: 'Transação apagada com sucesso', transacao: aApagar});
    } catch (err) {
        res.status(500).json({error:err.message});
    }
   
};


const apagarPorCategoria =  async (req, res) => {
    try {
        const apagados = await Transacao.deleteMany({ categoria: req.params.categoria.toLowerCase(), user: req.user._id });
        if (apagados.deletedCount ===  0) {
            return res.status(400).json({error: 'Informe uma categoria válida'});
        }
        res.json({ mensagem: 'Elementos apagados com sucesso', documentosApagados: apagados.deletedCount, categoria: req.params.categoria});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
    
};


module.exports = {criarTransacao, consultarReceitaDoUsuario, verCategorias,
renomearCategoria, atualizarTransacao, apagarPorId, apagarPorCategoria
}