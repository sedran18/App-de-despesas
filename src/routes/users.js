const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.js');
const usersCtrl = require('../controllers/usersController.js');


//create user
router.post('/users', usersCtrl.criarUsuario);

//login
router.post('/users/login', usersCtrl.loginUsuario);

//atualizar dados do usuário
router.patch('/users', auth, usersCtrl.atualizarDados )

//remove usuário
router.delete('/users', auth, usersCtrl.deletarUsuário)


module.exports = router;