const express = require('express');
const router = express.Router();
const User = require('../models/users.js');
const Transacao = require('../models/transacoes.js');
const auth = require('../middlewares/auth.js');


//create user
router.post('/users',  async (req, res) => {
    const conferirArr = ['nome', 'email', 'senha'];
    const conferir = conferirArr.every(x=> Object.keys(req.body).includes(x)); 
    console.log('POST')

    if (!conferir) return  !res.status(400).json({erro: 'Informe os argumentos corretos'});

    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (e) {
        res.status(400).json({erro: e.message})
    }
});


//login
router.post('/users/login', async (req, res) => {
    try {
        const user =await  User.encontrarPorCredenciais(req.body);
        const token = await user.gerarToken();
        res.json({user, token})
    } catch (err) {
        res.status(400).json('Login mal sucedido');
        console.error(err);
    }


})



//remove usuário
router.delete('/users', auth, async (req, res) => {
    try {
        await req.user.deleteOne();
        await Transacao.deleteMany({user: req.user._id});
        res.json(req.user);
    } catch (e) {
        res.status(500).json({erro: e.message});
    }
})


module.exports = router;