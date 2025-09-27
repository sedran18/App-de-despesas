const User = require('../models/users.js');
const Transacao = require('../models/transacoes.js');

const criarUsuario =  async (req, res) => {
    const camposPermitidos = ['nome', 'email', 'senha'];
    const verificar = Object.keys(req.body).every(x=> camposPermitidos.includes(x)); 
    console.log('POST')

    if (!verificar) return  !res.status(400).json({erro: 'Informe os argumentos corretos'});

    try {
        const user = new User(req.body);
        await user.save();

        const token = await user.gerarToken();

        res.status(201).json({ user, token });
    } catch (e) {
        res.status(400).json({erro: e.message})
    }
}


const loginUsuario = async (req, res) => {
    const camposPermitidos = ['email', 'senha'];
    const verificar = Object.keys(req.body).every(x => camposPermitidos.includes(x));
    if (!verificar) {
        return res.status(400).json('Informe os campos corretos');
    }

    try {
        const user = await  User.encontrarPorCredenciais(req.body);
        const token = await user.gerarToken();
        res.json({user, token})
    } catch (err) {
        res.status(400).json('Login mal sucedido');
    }
}

const atualizarDados = async (req, res) => {
  const camposPermitidos = ['nome', 'senha'];
  const updates = Object.keys(req.body);

  const valido = updates.every(campo => camposPermitidos.includes(campo));
  if (!valido) return res.status(400).json({ erro: 'Campos inválidos' });

  try {
    updates.forEach(campo => req.user[campo] = req.body[campo]);
    await req.user.save();
    res.json(req.user);
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
};


const deletarUsuário = async (req, res) => {
    try {
        await req.user.deleteOne();
        await Transacao.deleteMany({user: req.user._id});
        res.json(req.user);
    } catch (e) {
        res.status(500).json({erro: e.message});
    }
}

module.exports = {criarUsuario, deletarUsuário, loginUsuario, atualizarDados};