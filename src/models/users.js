const { Timestamp } = require('bson');
const { kMaxLength } = require('buffer');
const mongoose = require('mongoose');
const validator = require('validator');


const userEsquema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(valor) {
                return validator.isEmail(valor); // retorna true ou false
            },
            message: props => `"${props.value}" não é um email válido!`
        }
    },
    senha: {
        type: String,
        required: true
    }
}, {timestamps: true})