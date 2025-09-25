const mongoose = require('mongoose');
const User = require('..models/users.js');

const esquemaTransacoes = new mongoose.Schema({
    descricao: {
        type: String,
        required: true,
        maxlength: 200
    },
    valor: {
        type: Number,
        required: true,
        set: v => Number(v.toFixed(2))
    },
    tipo: {
        type: String,
        required: true,
        enum: ["receita", "despesa"]
    },
    categoria: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    data: {
        type: Date,
        default: Date.now(),

    }, 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

esquemaTransacoes.statics.procurarPorDataECategoria = async function (userId, ano, mes, categoria) {

    const dataInicio = new Date(ano, mes - 1, 1);
    const dataFim = new Date(ano, mes, 0, 23, 59, 59, 999);


    const filtro = {
        data: { $gte: dataInicio, $lte: dataFim },
        user: userId
    };

    if (categoria) {
        filtro.categoria = categoria.toLowerCase(); // garante que seja lowercase se você quiser normalizar
    }

    return this.find(filtro).populate('user', 'nome email');
}


esquemaTransacoes.statics.verificarLimiteCategorias = async function (userId, categoria) {
    const categorias = await this.distinct('categoria', { user: userId });
    if (categorias.length >= 10 && !categorias.includes(categoria.toLowerCase())) {
        return false;
    }
    return true;
}



const Transacao = mongoose.model("Transacao", esquemaTransacoes);
module.exports = Transacao;
