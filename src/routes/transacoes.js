const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.js');
const transacoesCtrl = require('../controllers/transacoesController.js');



//criar transaçao
router.post('/transacoes', auth, transacoesCtrl.criarTransacao);

//read receita
router.get('/transacoes', auth, transacoesCtrl.consultarReceitaDoUsuario);

//read categorias
router.get('/transacoes/categorias', auth, transacoesCtrl.verCategorias);

//update/replace categoria
router.patch('/transacoes/categorias', auth, transacoesCtrl.renomearCategoria);

//update informações pelo id;
router.patch('/transacoes/:id', auth, transacoesCtrl.atualizarTransacao);

// Apaga por ID
router.delete('/transacoes/:id', auth, transacoesCtrl.apagarPorId  );

//apagar por transação
router.delete('/transacoes/categorias/:categoria', auth, transacoesCtrl.apagarPorCategoria);


module.exports = router;

