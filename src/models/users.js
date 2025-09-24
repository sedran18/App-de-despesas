const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');


const userEsquema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function(valor) {
                return validator.isEmail(valor); // retorna true ou false
            },
            message: props => `"${props.value}" não é um email válido!`
        }
    },
    senha: {
        type: String,
        required: true,
        minlength: 6
    }
}, {timestamps: true})


userEsquema.pre('save', async function (next) {
    if (!this.isModified('senha')) return next();
    this.senha = await bcrypt.hash(this.senha, 10);
    next();
});

userEsquema.methods.compararSenha = async function (senhaRecebida) {
    return await bcrypt.compare(senhaRecebida, this.senha);
}

const User = mongoose.model('User', userEsquema);
module.exports = {User};