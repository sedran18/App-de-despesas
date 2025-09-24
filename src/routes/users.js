const express = require('express');
const router = express.Router();
const User = require('../models/users.js');
const auth = require('../middlewares/auth.js');


//create user
router.post('/users',  (req, res) => {
    try {
        const user = new User(req.body)
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

//read receita
router.get('/users', (req, res) => {

})

//update informações
router.patch('/users', (req, res) => {

})

//remove usuário
router.delete('/users', auth, async (req, res) => {
    try {
        await req.user.deleteOne();
        res.json(req.user);
    } catch (e) {
        res.status(500).json({erro: e.message});
    }
})


module.exports = router;