const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.js');
const usersCtrl = require('../controllers/usersController.js');


//create user
router.post('/users', usersCtrl.criarUsuario);

//ver perfil
router.get('/users/me', auth, usersCtrl.verPerfil);

//login
router.post('/users/login', usersCtrl.loginUsuario);

// Rota para logout da sessão atual
router.post('/users/logout', auth, usersCtrl.logoutUsuario);

// Rota para logout de todas as sessões (todos os dispositivos)
router.post('/users/logoutAll', auth, usersCtrl.logoutAll);

//atualizar dados do usuário
router.patch('/users', auth, usersCtrl.atualizarDados )

//remove usuário
router.delete('/users', auth, usersCtrl.deletarUsuário)


module.exports = router;