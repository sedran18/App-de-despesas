const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
}, {timestamps: true})


userEsquema.pre('save', async function (next) {
    if (!this.isModified('senha')) return next();
    this.senha = await bcrypt.hash(this.senha, 10);
    next();
});

userEsquema.methods.toJSON = function () {
    const userObj =  this.toObject();
    delete userObj.senha;
    delete userObj.tokens;

    return userObj;
}

userEsquema.statics.encontrarPorCredenciais = async function(credenciaisObj) {
    const comparativos = ['email', 'senha'];
    const reqKeys = Object.keys(credenciaisObj);

    const verificarChavesDoUser = reqKeys.every(key => comparativos.includes(key));
    if (!verificarChavesDoUser) {
        throw new Error('Informações inseridas incorretamente');
    }

    const { email, senha } = credenciaisObj;
    const user = await this.findOne({ email }); 

    if (!user) {
        throw new Error('Informe um email válido');
    }

    const senhaVerificada = await bcrypt.compare(senha, user.senha);
    if (!senhaVerificada) {
        throw new Error('Senha inválida');
    }

    return user;
};


userEsquema.methods.gerarToken = async function () {
    const token = jwt.sign({_id: this._id.toString()}, process.env.JWT_SECRET, { expiresIn: '7d' });
    this.tokens.push({token});
    await this.save();

    return token;
}
const User = mongoose.model('User', userEsquema);
module.exports = User;